import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Submission, SubmissionDocument } from '../schemas/submission.schema';
import { Evidence, EvidenceDocument } from '../schemas/evidence.schema';
import type { EvidenceDto } from '../common/dto';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectModel(Submission.name) private submissionModel: Model<SubmissionDocument>,
    @InjectModel(Evidence.name) private evidenceModel: Model<EvidenceDocument>,
  ) {}

  async queue() {
    const list = await this.submissionModel.find({ status: 'accepted' }).sort({ createdAt: -1 }).lean();
    return list.map((s) => ({ id: s._id.toString(), title: s.title }));
  }

  async addEvidence(id: string, dto: EvidenceDto) {
    const submission = await this.submissionModel.findById(id).lean();
    if (!submission) return { ok: false, error: 'submission_not_found' };
    const created = await this.evidenceModel.create({
      submissionId: new Types.ObjectId(id),
      practice: dto.practice,
      claim: dto.claim,
      result: dto.result,
      studyType: dto.studyType,
    });
    return { ok: true, id: created._id.toString() };
  }
}