import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Evidence, EvidenceDocument } from '../schemas/evidence.schema';

@Injectable()
export class EvidenceService {
  constructor(
    @InjectModel(Evidence.name) private evidenceModel: Model<EvidenceDocument>,
  ) {}

  async getById(id: string) {
    const e = await this.evidenceModel.findById(id).lean();
    if (!e) return { ok: false, error: 'not_found' };
    return {
      id: e._id.toString(),
      practice: e.practice,
      claim: e.claim,
      result: e.result,
      studyType: e.studyType,
      submissionId: e.submissionId.toString(),
    };
  }
}