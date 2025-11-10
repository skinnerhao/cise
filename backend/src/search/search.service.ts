import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Evidence, EvidenceDocument } from '../schemas/evidence.schema';
import { Submission, SubmissionDocument } from '../schemas/submission.schema';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Evidence.name) private evidenceModel: Model<EvidenceDocument>,
    @InjectModel(Submission.name) private submissionModel: Model<SubmissionDocument>,
  ) {}

  async search(practice?: string, claim?: string) {
    const filter: Record<string, any> = {};
    if (practice) filter.practice = { $regex: practice, $options: 'i' };
    if (claim) filter.claim = { $regex: claim, $options: 'i' };

    const evidences = await this.evidenceModel.find(filter).sort({ createdAt: -1 }).lean();
    const submissionIds = evidences.map((e) => e.submissionId);
    const submissions = await this.submissionModel.find({ _id: { $in: submissionIds } }).lean();
    const subMap = new Map(submissions.map((s) => [s._id.toString(), s]));

    return evidences.map((e) => {
      const sub = subMap.get(e.submissionId.toString());
      const source = sub ? `${sub.authors} — ${sub.title}` : 'Unknown Source';
      return {
        id: e._id.toString(),
        practice: e.practice,
        claim: e.claim,
        conclusion: e.result,
        source,
      };
    });
  }
}