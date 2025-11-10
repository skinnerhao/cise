import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubmissionsModule } from './submissions/submissions.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AnalysisModule } from './analysis/analysis.module';
import { EvidenceModule } from './evidence/evidence.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    // 默认优先使用 IPv4 避免 ::1 解析导致连接问题
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/speed'),
    SubmissionsModule,
    ReviewsModule,
    AnalysisModule,
    EvidenceModule,
    SearchModule,
  ],
  controllers: [AppController],
})
export class AppModule {}