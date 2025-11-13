import { Controller, Get, Param, Post, Body } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Article, ArticleStatus } from '../schemas/article.schema'
import { NotificationService } from '../common/notification.service'

class ReviewActionDto { reason?: string }

@Controller('api/review')
export class ReviewController {
  constructor(
    @InjectModel(Article.name) private readonly articleModel: Model<Article>,
    private readonly notifier: NotificationService
  ) {}

  @Get('')
  async list() {
    const items = await this.articleModel.find({ status: ArticleStatus.Pending }).lean()
    return { items }
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const item = await this.articleModel.findById(id).lean()
    return { item }
  }

  @Post(':id/approve')
  async approve(@Param('id') id: string) {
    const item = await this.articleModel.findById(id)
    if (!item) return { error: '未找到' }
    const dup = item.doi ? await this.articleModel.findOne({ doi: item.doi, _id: { $ne: item._id } }) : null
    if (dup) return { error: '重复DOI' }
    item.status = ArticleStatus.Approved
    await item.save()
    const analysts = (process.env.ANALYST_EMAILS || '').split(',').map(s => s.trim()).filter(Boolean)
    for (const a of analysts) await this.notifier.sendEmail(a, '待分析文章', `文章待分析: ${item.title}`)
    if (item.submitterEmail) await this.notifier.sendEmail(item.submitterEmail, '审核通过', `您的文章已通过审核: ${item.title}`)
    return { success: true }
  }

  @Post(':id/reject')
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

