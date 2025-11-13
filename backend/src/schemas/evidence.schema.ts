import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type EvidenceDocument = Evidence & Document

export enum EvidenceResult {
  Support = 'support',
  Contradict = 'contradict',
  Neutral = 'neutral'
}

@Schema({ timestamps: true })
export class Evidence {
  @Prop({ type: Types.ObjectId, ref: 'Article', required: true })
  article: Types.ObjectId

  @Prop({ required: true })
  practice: string

  @Prop({ required: true })
  claim: string

  @Prop({ enum: EvidenceResult, required: true })
  result: EvidenceResult

  @Prop({ required: true })
  studyType: string

  @Prop({ required: true })
  participantType: string
}

export const EvidenceSchema = SchemaFactory.createForClass(Evidence)

