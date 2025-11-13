import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Article, ArticleStatus } from '../schemas/article.schema'
import { Evidence, EvidenceResult } from '../schemas/evidence.schema'
import { Taxonomy } from '../schemas/taxonomy.schema'
import { AuthGuard } from '../common/auth.guard'
import { Roles } from '../common/roles.decorator'
import { IsEnum, IsString } from 'class-validator'

class EvidenceDto {
  @IsString() practice: string
  @IsString() claim: string
  @IsEnum(EvidenceResult) result: EvidenceResult
  @IsString() studyType: string
  @IsString() participantType: string
}

@Controller('api/analysis')
export class AnalysisController {
  constructor(
    @InjectModel(Article.name) private readonly articleModel: Model<Article>,
    @InjectModel(Evidence.name) private readonly evidenceModel: Model<Evidence>,
    @InjectModel(Taxonomy.name) private readonly taxonomyModel: Model<Taxonomy>
  ) {}

  @Get('')
  @UseGuards(AuthGuard)
  @Roles('analyst')
  async list() {
    const items = await this.articleModel.find({ status: ArticleStatus.Approved }).lean()
    return { items }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles('analyst')
  async form(@Param('id') id: string) {
    const item = await this.articleModel.findById(id).lean()
    const tax = await this.taxonomyModel.findOne().lean()
    return { item, practices: tax?.practices || [], claims: tax?.claims || [] }
  }

  @Post(':id')
  @UseGuards(AuthGuard)
  @Roles('analyst')
  async save(@Param('id') id: string, @Body() body: EvidenceDto) {
    const article = await this.articleModel.findById(id)
    if (!article) return { error: '未找到' }
    const ev = new this.evidenceModel({ article: new Types.ObjectId(id), ...body })
    await ev.save()
    article.status = ArticleStatus.Analyzed
    await article.save()
    return { success: true }
  }
}
