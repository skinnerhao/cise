import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubmissionDocument = Submission & Document;

export type SubmissionStatus = 'pending' | 'accepted' | 'rejected';

@Schema({ timestamps: true })
export class Submission {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  authors!: string;

  @Prop()
  doi?: string;

  @Prop()
  url?: string;

  @Prop({ required: true, default: 'pending' })
  status!: SubmissionStatus;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);