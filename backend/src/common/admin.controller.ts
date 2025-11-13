import { Controller, Get, Post, Body } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Taxonomy } from '../schemas/taxonomy.schema'

class PracticeDto { practice: string }
class ClaimDto { practice: string; text: string }

@Controller('api/admin')
export class AdminController {
  constructor(@InjectModel(Taxonomy.name) private readonly taxonomyModel: Model<Taxonomy>) {}

  @Get('')
  async page() {
    const tax = await this.taxonomyModel.findOne().lean()
    return { practices: tax?.practices || [], claims: tax?.claims || [] }
  }

  @Post('practice')
  async addPractice(@Body() body: PracticeDto) {
    let tax = await this.taxonomyModel.findOne()
    if (!tax) tax = new this.taxonomyModel({})
    tax.practices = Array.from(new Set([...(tax.practices || []), body.practice]))
    await tax.save()
    return { success: true }
  }

  @Post('claim')
  async addClaim(@Body() body: ClaimDto) {
    let tax = await this.taxonomyModel.findOne()
    if (!tax) tax = new this.taxonomyModel({})
    tax.claims = [...(tax.claims || []), { practice: body.practice, text: body.text }]
    await tax.save()
    return { success: true }
  }
}

