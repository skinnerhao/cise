import * as dotenv from 'dotenv'
dotenv.config({ path: require('path').join(__dirname, '..', '.env') })
import mongoose from 'mongoose'
import { ArticleStatus } from '../src/schemas/article.schema'

const ArticleSchema = new mongoose.Schema({ title: String, authors: [String], journal: String, year: Number, doi: { type: String, unique: true, sparse: true }, submitterEmail: String, status: { type: String, enum: Object.values(ArticleStatus) }, rejectedReason: String }, { timestamps: true })
const EvidenceSchema = new mongoose.Schema({ article: mongoose.Schema.Types.ObjectId, practice: String, claim: String, result: String, studyType: String, participantType: String }, { timestamps: true })
const RatingSchema = new mongoose.Schema({ article: mongoose.Schema.Types.ObjectId, userEmail: String, stars: Number }, { timestamps: true })
const TaxonomySchema = new mongoose.Schema({ practices: [String], claims: [{ practice: String, text: String }] }, { timestamps: true })

const Article = mongoose.model<any>('Article', ArticleSchema)
const Evidence = mongoose.model<any>('Evidence', EvidenceSchema)
const Rating = mongoose.model<any>('Rating', RatingSchema)
const Taxonomy = mongoose.model<any>('Taxonomy', TaxonomySchema)

async function ensureTaxonomy() {
  const practices = ['TDD', 'Code Review', 'Pair Programming']
  const claims = [
    { practice: 'TDD', text: '提高代码质量' },
    { practice: 'TDD', text: '缩短交付周期' },
    { practice: 'Code Review', text: '减少缺陷' },
    { practice: 'Code Review', text: '提高可维护性' },
    { practice: 'Pair Programming', text: '提高知识共享' },
    { practice: 'Pair Programming', text: '提高生产率' }
  ]
  let tax = await Taxonomy.findOne()
  if (!tax) tax = new Taxonomy({ practices: [], claims: [] })
  tax.practices = Array.from(new Set([...(tax.practices || []), ...practices]))
  const key = (c: any) => c.practice + ':' + c.text
  const existingKeys = new Set((tax.claims || []).map(key))
  const merged = [...tax.claims]
  for (const c of claims) if (!existingKeys.has(key(c))) merged.push(c)
  tax.claims = merged
  await tax.save()
}

async function ensureArticle(payload: any) {
  const found = await Article.findOne({ doi: payload.doi })
  if (found) return found
  return Article.create(payload)
}

async function ensureEvidence(payload: any) {
  const found = await Evidence.findOne({ article: payload.article, practice: payload.practice, claim: payload.claim })
  if (found) return found
  return Evidence.create(payload)
}

async function seed() {
  await ensureTaxonomy()

  const a1 = await ensureArticle({ title: 'An Empirical Study of TDD', authors: ['Alice', 'Bob'], journal: 'SE Journal', year: 2021, doi: '10.1000/tdd2021', submitterEmail: 'alice@example.com', status: ArticleStatus.Approved })
  await ensureEvidence({ article: a1._id, practice: 'TDD', claim: '提高代码质量', result: 'support', studyType: '实验', participantType: '学生' })
  await Rating.create([{ article: a1._id, userEmail: 'u1@example.com', stars: 5 }, { article: a1._id, userEmail: 'u2@example.com', stars: 4 }])

  const a2 = await ensureArticle({ title: 'Code Reviews in Industry', authors: ['Carol'], journal: 'ICSE', year: 2019, doi: '10.1000/cr2019', submitterEmail: 'carol@example.com', status: ArticleStatus.Approved })
  await ensureEvidence({ article: a2._id, practice: 'Code Review', claim: '减少缺陷', result: 'support', studyType: '案例研究', participantType: '从业者' })
  await Rating.create([{ article: a2._id, userEmail: 'u3@example.com', stars: 3 }, { article: a2._id, userEmail: 'u4@example.com', stars: 4 }])

  const a3 = await ensureArticle({ title: 'Early TDD Productivity Trade-offs', authors: ['Dave'], journal: 'XP Conf', year: 2020, doi: '10.1000/tdd2020-tradeoff', submitterEmail: 'dave@example.com', status: ArticleStatus.Approved })
  await ensureEvidence({ article: a3._id, practice: 'TDD', claim: '缩短交付周期', result: 'contradict', studyType: '案例研究', participantType: '从业者' })

  const a4 = await ensureArticle({ title: 'Pair Programming Knowledge Sharing Study', authors: ['Erin', 'Frank'], journal: 'Empirical SE', year: 2018, doi: '10.1000/pp2018-ks', submitterEmail: 'erin@example.com', status: ArticleStatus.Approved })
  await ensureEvidence({ article: a4._id, practice: 'Pair Programming', claim: '提高知识共享', result: 'support', studyType: '实验', participantType: '学生' })
  await ensureEvidence({ article: a4._id, practice: 'Pair Programming', claim: '提高生产率', result: 'neutral', studyType: '实验', participantType: '学生' })

  await ensureArticle({ title: 'New Empirical Evidence of TDD', authors: ['Grace'], journal: 'SE Practice', year: 2022, doi: '10.1000/tdd2022-new', submitterEmail: 'grace@example.com', status: ArticleStatus.Pending })
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI as string)
  await seed()
  console.log('Seed completed')
  process.exit(0)
}

run()
