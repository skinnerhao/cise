import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Taxonomy } from '../schemas/taxonomy.schema'
import { AuthGuard } from './auth.guard'
import { Roles } from './roles.decorator'
import { IsString } from 'class-validator'
import { Article } from '../schemas/article.schema'

class PracticeDto { @IsString() practice: string }
class ClaimDto { @IsString() practice: string; @IsString() text: string }

@Controller('api/admin')
export class AdminController {
  constructor(
    @InjectModel(Taxonomy.name) private readonly taxonomyModel: Model<Taxonomy>,
    @InjectModel(Article.name) private readonly articleModel: Model<Article>
  ) {}

  @Get('')
  async page() {
    const tax = await this.taxonomyModel.findOne().lean()
    return { practices: tax?.practices || [], claims: tax?.claims || [] }
  }

  @Post('practice')
  @UseGuards(AuthGuard)
  @Roles('analyst')
  async addPractice(@Body() body: PracticeDto) {
    let tax = await this.taxonomyModel.findOne()
    if (!tax) tax = new this.taxonomyModel({})
    tax.practices = Array.from(new Set([...(tax.practices || []), body.practice]))
    await tax.save()
    return { success: true }
  }

  @Post('claim')
  @UseGuards(AuthGuard)
  @Roles('analyst')
  async addClaim(@Body() body: ClaimDto) {
    let tax = await this.taxonomyModel.findOne()
    if (!tax) tax = new this.taxonomyModel({})
    tax.claims = [...(tax.claims || []), { practice: body.practice, text: body.text }]
    await tax.save()
    return { success: true }
  }

  @Post('practice/delete')
  @UseGuards(AuthGuard)
  @Roles('analyst')
  async deletePractice(@Body() body: PracticeDto) {
    let tax = await this.taxonomyModel.findOne()
    if (!tax) tax = new this.taxonomyModel({})
    tax.practices = (tax.practices || []).filter(p => p !== body.practice)
    tax.claims = (tax.claims || []).filter(c => c.practice !== body.practice)
    await tax.save()
    await this.articleModel.updateMany({ proposedPractice: body.practice }, { $unset: { proposedPractice: '', proposedClaim: '' } })
    return { success: true }
  }

  @Post('claim/delete')
  @UseGuards(AuthGuard)
  @Roles('analyst')
  async deleteClaim(@Body() body: ClaimDto) {
    let tax = await this.taxonomyModel.findOne()
    if (!tax) tax = new this.taxonomyModel({})
    tax.claims = (tax.claims || []).filter(c => !(c.practice === body.practice && c.text === body.text))
    await tax.save()
    await this.articleModel.updateMany({ proposedPractice: body.practice, proposedClaim: body.text }, { $unset: { proposedPractice: '', proposedClaim: '' } })
    return { success: true }
  }
}
