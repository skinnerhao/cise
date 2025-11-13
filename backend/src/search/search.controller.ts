import { Controller, Get, Post, Query, Body, Param } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Evidence } from '../schemas/evidence.schema'
import { Article } from '../schemas/article.schema'
import { Taxonomy } from '../schemas/taxonomy.schema'
import { Rating } from '../schemas/rating.schema'
import { SavedQuery } from '../schemas/saved-query.schema'

class SearchDto {
  practice?: string
  claim?: string
  yearFrom?: number
  yearTo?: number
  sort?: string
  columns?: string
  userEmail?: string
}

class RateDto { userEmail: string; stars: number }

@Controller('api')
export class SearchController {
  constructor(
    @InjectModel(Evidence.name) private readonly evidenceModel: Model<Evidence>,
    @InjectModel(Article.name) private readonly articleModel: Model<Article>,
    @InjectModel(Taxonomy.name) private readonly taxonomyModel: Model<Taxonomy>,
    @InjectModel(Rating.name) private readonly ratingModel: Model<Rating>,
    @InjectModel(SavedQuery.name) private readonly savedQueryModel: Model<SavedQuery>
  ) {}

  @Get('taxonomy')
  async taxonomy() {
    const tax = await this.taxonomyModel.findOne().lean()
    return { practices: tax?.practices || [], claims: tax?.claims || [] }
  }

  @Get('search')
  async results(@Query() q: SearchDto) {
    const filter: any = {}
    if (q.practice) filter.practice = q.practice
    if (q.claim) filter.claim = q.claim
    const evidences = await this.evidenceModel.find(filter).lean()
    const articleIds = evidences.map(a => a.article)
    let articles = await this.articleModel.find({ _id: { $in: articleIds } }).lean()
    if (q.yearFrom || q.yearTo) {
      articles = articles.filter(a => (!q.yearFrom || (a.year || 0) >= Number(q.yearFrom)) && (!q.yearTo || (a.year || 0) <= Number(q.yearTo)))
    }
    const ratings = await this.ratingModel.aggregate([{ $match: { article: { $in: articles.map(a => a._id) } } }, { $group: { _id: '$article', avg: { $avg: '$stars' } } }])
    const ratingMap = new Map(ratings.map(r => [String(r._id), r.avg]))
    let rows = evidences
      .filter(ev => articles.find(a => String(a._id) === String(ev.article)))
      .map(ev => {
        const art: any = articles.find(a => String(a._id) === String(ev.article))
        return {
          _id: art._id,
          title: art.title,
          authors: art.authors,
          year: art.year,
          journal: art.journal,
          practice: ev.practice,
          claim: ev.claim,
          result: ev.result,
          studyType: ev.studyType,
          participantType: ev.participantType,
          rating: ratingMap.get(String(art._id)) || 0
        }
      })
    const sortField = q.sort || ''
    if (sortField) {
      rows.sort((a: any, b: any) => {
        if (sortField === 'author') return (a.authors?.[0] || '').localeCompare(b.authors?.[0] || '')
        if (sortField === 'year') return (a.year || 0) - (b.year || 0)
        if (sortField === 'claim') return (a.claim || '').localeCompare(b.claim || '')
        if (sortField === 'result') return (a.result || '').localeCompare(b.result || '')
        return 0
      })
    }
    const cols = (q.columns || '').split(',').filter(Boolean)
    return { rows, cols }
  }

  @Post('rate/:id')
  async rate(@Param('id') id: string, @Body() body: RateDto) {
    if (!body.userEmail) return { error: '需要邮箱' }
    await this.ratingModel.create({ article: id, userEmail: body.userEmail, stars: Number(body.stars) })
    return { success: true }
  }

  @Post('save-query')
  async saveQuery(@Body() body: SearchDto) {
    if (!body.userEmail) return { error: '需要邮箱' }
    const columns = (body.columns || '').split(',').filter(Boolean)
    await this.savedQueryModel.create({ userEmail: body.userEmail, practice: body.practice, claim: body.claim, yearFrom: body.yearFrom ? Number(body.yearFrom) : undefined, yearTo: body.yearTo ? Number(body.yearTo) : undefined, columns })
    return { success: true }
  }

  @Get('articles/by-doi')
  async byDoi(@Query('doi') doi: string) {
    const art = await this.articleModel.findOne({ doi }).lean()
    return { id: art?._id || null }
  }
}

