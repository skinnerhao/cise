import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document

export type UserRole = 'submitter' | 'reviewer' | 'analyst'

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  passwordHash: string

  @Prop({ required: true })
  role: UserRole
}

export const UserSchema = SchemaFactory.createForClass(User)

