import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type SavedQueryDocument = SavedQuery & Document

@Schema({ timestamps: true })
export class SavedQuery {
  @Prop({ required: true })
  userEmail: string

  @Prop()
  practice?: string

  @Prop()
  claim?: string

  @Prop()
  yearFrom?: number

  @Prop()
  yearTo?: number

  @Prop({ type: [String], default: [] })
  columns: string[]
}

export const SavedQuerySchema = SchemaFactory.createForClass(SavedQuery)

