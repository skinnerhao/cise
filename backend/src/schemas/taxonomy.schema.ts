import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type TaxonomyDocument = Taxonomy & Document

@Schema({ timestamps: true })
export class Taxonomy {
  @Prop({ type: [String], default: [] })
  practices: string[]

  @Prop({ type: [{ practice: String, text: String }], default: [] })
  claims: { practice: string; text: string }[]
}

export const TaxonomySchema = SchemaFactory.createForClass(Taxonomy)

