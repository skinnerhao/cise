import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Submission, SubmissionDocument } from '../schemas/submission.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Submission.name) private submissionModel: Model<SubmissionDocument>,
  ) {}

  async accept(id: string) {
    await this.submissionModel.updateOne({ _id: id }, { $set: { status: 'accepted' } });
    return { ok: true, id, action: 'accepted' };
  }

  async reject(id: string) {
    await this.submissionModel.updateOne({ _id: id }, { $set: { status: 'rejected' } });
    return { ok: true, id, action: 'rejected' };
  }
}