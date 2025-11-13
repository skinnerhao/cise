import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { SubmissionController } from './submissions/submissions.controller'
import { ReviewController } from './reviews/reviews.controller'
import { AnalysisController } from './analysis/analysis.controller'
import { SearchController } from './search/search.controller'
import { AdminController } from './common/admin.controller'
import { Article, ArticleSchema } from './schemas/article.schema'
import { Evidence, EvidenceSchema } from './schemas/evidence.schema'
import { Rating, RatingSchema } from './schemas/rating.schema'
import { Taxonomy, TaxonomySchema } from './schemas/taxonomy.schema'
import { SavedQuery, SavedQuerySchema } from './schemas/saved-query.schema'
import { NotificationService } from './common/notification.service'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
      { name: Evidence.name, schema: EvidenceSchema },
      { name: Rating.name, schema: RatingSchema },
      { name: Taxonomy.name, schema: TaxonomySchema },
      { name: SavedQuery.name, schema: SavedQuerySchema }
    ])
  ],
  controllers: [SubmissionController, ReviewController, AnalysisController, SearchController, AdminController],
  providers: [NotificationService]
})
export class AppModule {}
