import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Submission, SubmissionSchema } from '../schemas/submission.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Submission.name, schema: SubmissionSchema }])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}