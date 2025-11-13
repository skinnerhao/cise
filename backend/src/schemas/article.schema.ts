import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type ArticleDocument = Article & Document

export enum ArticleStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
  Analyzed = 'analyzed'
}

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true })
  title: string

  @Prop({ type: [String], default: [] })
  authors: string[]

  @Prop()
  journal: string

  @Prop()
  year: number

  @Prop({ unique: true, sparse: true })
  doi: string

  @Prop()
  submitterEmail: string

  @Prop({ enum: ArticleStatus, default: ArticleStatus.Pending })
  status: ArticleStatus

  @Prop()
  rejectedReason?: string
}

export const ArticleSchema = SchemaFactory.createForClass(Article)

