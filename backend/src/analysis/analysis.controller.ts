import { Controller, Get, Param, Post, Body } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Article, ArticleStatus } from '../schemas/article.schema'
import { Evidence, EvidenceResult } from '../schemas/evidence.schema'
import { Taxonomy } from '../schemas/taxonomy.schema'

class EvidenceDto {
  practice: string
  claim: string
  result: EvidenceResult
  studyType: string
  participantType: string
}

@Controller('api/analysis')
export class AnalysisController {
  constructor(
    @InjectModel(Article.name) private readonly articleModel: Model<Article>,
    @InjectModel(Evidence.name) private readonly evidenceModel: Model<Evidence>,
    @InjectModel(Taxonomy.name) private readonly taxonomyModel: Model<Taxonomy>
  ) {}

  @Get('')
  async list() {
    const items = await this.articleModel.find({ status: ArticleStatus.Approved }).lean()
    return { items }
  }

  @Get(':id')
  async form(@Param('id') id: string) {
    const item = await this.articleModel.findById(id).lean()
    const tax = await this.taxonomyModel.findOne().lean()
    return { item, practices: tax?.practices || [], claims: tax?.claims || [] }
  }

  @Post(':id')
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

