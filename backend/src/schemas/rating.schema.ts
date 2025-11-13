import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type RatingDocument = Rating & Document

@Schema({ timestamps: true })
export class Rating {
  @Prop({ type: Types.ObjectId, ref: 'Article', required: true })
  article: Types.ObjectId

  @Prop({ required: true })
  userEmail: string

  @Prop({ min: 1, max: 5, required: true })
  stars: number
}

export const RatingSchema = SchemaFactory.createForClass(Rating)
RatingSchema.index({ article: 1, userEmail: 1 }, { unique: true })
