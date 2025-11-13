import * as dotenv from 'dotenv'
dotenv.config({ path: require('path').join(__dirname, '..', '.env') })
import mongoose from 'mongoose'
import { Model } from 'mongoose'
import { Article, ArticleSchema, ArticleStatus } from '../src/schemas/article.schema'
import { Evidence, EvidenceSchema } from '../src/schemas/evidence.schema'
import { Rating, RatingSchema } from '../src/schemas/rating.schema'
import { Taxonomy, TaxonomySchema } from '../src/schemas/taxonomy.schema'
import { SavedQuery, SavedQuerySchema } from '../src/schemas/saved-query.schema'
import { NotificationService } from '../src/common/notification.service'
import { SubmissionController } from '../src/submissions/submissions.controller'
import { ReviewController } from '../src/reviews/reviews.controller'
import { AnalysisController } from '../src/analysis/analysis.controller'
import { SearchController } from '../src/search/search.controller'

async function run() {
  await mongoose.connect(process.env.MONGODB_URI as string)

  const ArticleModel = mongoose.model<Article>('Article', ArticleSchema)
  const EvidenceModel = mongoose.model<Evidence>('Evidence', EvidenceSchema)
  const RatingModel = mongoose.model<Rating>('Rating', RatingSchema)
  const TaxonomyModel = mongoose.model<Taxonomy>('Taxonomy', TaxonomySchema)
  const SavedQueryModel = mongoose.model<SavedQuery>('SavedQuery', SavedQuerySchema)

  const notifier = new NotificationService()
  const submission = new SubmissionController(ArticleModel as unknown as Model<Article>, notifier)
  const review = new ReviewController(ArticleModel as unknown as Model<Article>, notifier)
  const analysis = new AnalysisController(ArticleModel as unknown as Model<Article>, EvidenceModel as unknown as Model<Evidence>, TaxonomyModel as unknown as Model<Taxonomy>)
  const search = new SearchController(EvidenceModel as any, ArticleModel as any, TaxonomyModel as any, RatingModel as any, SavedQueryModel as any)

  await TaxonomyModel.updateOne({}, { $setOnInsert: { practices: ['TDD'], claims: [{ practice: 'TDD', text: '提高代码质量' }] } }, { upsert: true })

  const doi = '10.9999/speed-verify-' + Date.now()
  const submitRes = await submission.handleSubmit({ title: 'Verify Article', authors: 'Tester', journal: 'TestConf', year: 2024 as any, doi, submitterEmail: 'tester@example.com' })
  console.log('submit:', submitRes)

  const pending = await review.list()
  const item = (pending as any).items.find((i: any) => i.doi === doi)
  if (!item) throw new Error('not in review queue')
  const approveRes = await review.approve(item._id)
  console.log('approve:', approveRes)

  const toAnalyze = await analysis.list()
  const aitem = (toAnalyze as any).items.find((i: any) => String(i._id) === String(item._id))
  if (!aitem) throw new Error('not in analysis queue')
  const saveRes = await analysis.save(item._id, { practice: 'TDD', claim: '提高代码质量', result: 'support' as any, studyType: '实验', participantType: '学生' })
  console.log('analyze:', saveRes)

  const res = await search.results({ practice: 'TDD', claim: '提高代码质量', sort: 'year' } as any)
  console.log('results rows:', (res as any).rows.length)

  const rateRes = await search.rate(item._id, { userEmail: 'tester@example.com', stars: 5 })
  console.log('rate:', rateRes)

  await mongoose.disconnect()
}

run().catch(e => { console.error(e); process.exit(1) })

