import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Submission, SubmissionDocument } from '../schemas/submission.schema';
import type { SubmissionDto } from '../common/dto';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectModel(Submission.name) private submissionModel: Model<SubmissionDocument>,
  ) {}

  async create(dto: SubmissionDto) {
    const created = await this.submissionModel.create({ ...dto, status: 'pending' });
    return { ok: true, id: created._id.toString() };
  }

  async findPending() {
    const list = await this.submissionModel.find({ status: 'pending' }).sort({ createdAt: -1 }).lean();
    return list.map((s) => ({
      id: s._id.toString(),
      title: s.title,
      authors: s.authors,
      doi: s.doi,
    }));
  }
}