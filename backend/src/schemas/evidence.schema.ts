import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EvidenceDocument = Evidence & Document;

@Schema({ timestamps: true })
export class Evidence {
  @Prop({ type: Types.ObjectId, ref: 'Submission', required: true })
  submissionId!: Types.ObjectId;

  @Prop({ required: true })
  practice!: string;

  @Prop({ required: true })
  claim!: string;

  @Prop({ required: true })
  result!: string; // 支持/不支持/混合

  @Prop({ required: true })
  studyType!: string;
}

export const EvidenceSchema = SchemaFactory.createForClass(Evidence);