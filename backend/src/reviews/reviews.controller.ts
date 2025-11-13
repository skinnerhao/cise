import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Article, ArticleStatus } from '../schemas/article.schema'
import { NotificationService } from '../common/notification.service'
import { AuthGuard } from '../common/auth.guard'
import { Roles } from '../common/roles.decorator'
import { IsOptional, IsString } from 'class-validator'
import { Evidence } from '../schemas/evidence.schema'

class ReviewActionDto { @IsOptional() @IsString() reason?: string }

@Controller('api/review')
export class ReviewController {
  constructor(
    @InjectModel(Article.name) private readonly articleModel: Model<Article>,
    @InjectModel(Evidence.name) private readonly evidenceModel: Model<Evidence>,
    private readonly notifier: NotificationService
  ) {}

  @Get('')
  @UseGuards(AuthGuard)
  @Roles('reviewer')
  async list() {
    const items = await this.articleModel.find({ status: ArticleStatus.Pending }).lean()
    return { items }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles('reviewer')
  async detail(@Param('id') id: string) {
    const item = await this.articleModel.findById(id).lean()
    return { item }
  }

  @Post(':id/approve')
  @UseGuards(AuthGuard)
  @Roles('reviewer')
  async approve(@Param('id') id: string) {
    const item = await this.articleModel.findById(id)
    if (!item) return { error: '未找到' }
    const dup = item.doi ? await this.articleModel.findOne({ doi: item.doi, _id: { $ne: item._id } }) : null
    if (dup) return { error: '重复DOI' }
    item.status = ArticleStatus.Approved
    await item.save()
    if (item.proposedPractice && item.proposedClaim) {
      await this.evidenceModel.create({ article: new Types.ObjectId(String(item._id)), practice: item.proposedPractice, claim: item.proposedClaim, result: 'neutral', studyType: '未知', participantType: '未知' })
    }
    const analysts = (process.env.ANALYST_EMAILS || '').split(',').map(s => s.trim()).filter(Boolean)
    for (const a of analysts) await this.notifier.sendEmail(a, '待分析文章', `文章待分析: ${item.title}`)
    if (item.submitterEmail) await this.notifier.sendEmail(item.submitterEmail, '审核通过', `您的文章已通过审核: ${item.title}`)
    return { success: true }
  }

  @Post(':id/reject')
  @UseGuards(AuthGuard)
  @Roles('reviewer')
  async reject(@Param('id') id: string, @Body() body: ReviewActionDto) {
    const item = await this.articleModel.findById(id)
    if (!item) return { error: '未找到' }
    item.status = ArticleStatus.Rejected
    item.rejectedReason = body.reason || ''
    await item.save()
    if (item.submitterEmail) await this.notifier.sendEmail(item.submitterEmail, '审核拒绝', `您的文章被拒绝: ${item.title}`)
    return { success: true }
  }
}
