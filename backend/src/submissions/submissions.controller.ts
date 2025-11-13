import { Controller, Post, Body, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Article, ArticleStatus } from '../schemas/article.schema'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import * as BibtexParse from 'bibtex-parse-js'
import { NotificationService } from '../common/notification.service'
import { AuthGuard } from '../common/auth.guard'
import { Roles } from '../common/roles.decorator'
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator'

class SubmitDto {
  @IsOptional() @IsString() title?: string
  @IsOptional() @IsString() authors?: string
  @IsOptional() @IsString() journal?: string
  @IsOptional() @IsNumber() year?: number
  @IsOptional() @IsString() doi?: string
  @IsOptional() @IsEmail() submitterEmail?: string
  @IsOptional() @IsString() practice?: string
  @IsOptional() @IsString() claim?: string
}

@Controller('api')
export class SubmissionController {
  constructor(
    @InjectModel(Article.name) private readonly articleModel: Model<Article>,
    private readonly notifier: NotificationService
  ) {}

  @Post('submit')
  @UseGuards(AuthGuard)
  @Roles('submitter')
  @UseInterceptors(
    FileInterceptor('bibfile', {
      storage: diskStorage({ destination: './uploads', filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname) }),
      fileFilter: (_, file, cb) => cb(null, /\.bib$/i.test(file.originalname))
    })
  )
  async handleSubmit(@Body() body: SubmitDto, @UploadedFile() file?: Express.Multer.File) {
    let data: any = {}
    if (file) {
      const content = require('fs').readFileSync(file.path, 'utf8')
      const parsed = BibtexParse.toJSON(content)
      if (parsed && parsed[0]) {
        const e = parsed[0].entryTags || {}
        data.title = e.title || body.title
        data.authors = (e.author || body.authors || '').split(' and ').map((a: string) => a.trim()).filter(Boolean)
        data.journal = e.journal || body.journal
        data.year = Number(e.year || body.year)
        data.doi = e.doi || body.doi
        data.submitterEmail = body.submitterEmail
        data.proposedPractice = body.practice
        data.proposedClaim = body.claim
      }
    } else {
      data.title = body.title
      data.authors = (body.authors || '').split(',').map(a => a.trim()).filter(Boolean)
      data.journal = body.journal
      data.year = body.year ? Number(body.year) : undefined
      data.doi = body.doi
      data.submitterEmail = body.submitterEmail
      data.proposedPractice = body.practice
      data.proposedClaim = body.claim
    }
    if (!data.title) return { error: '缺少标题' }
    const existing = data.doi ? await this.articleModel.findOne({ doi: data.doi }) : null
    if (existing) return { error: '该DOI已存在' }
    const doc = new this.articleModel({ ...data, status: ArticleStatus.Pending })
    await doc.save()
    const reviewers = (process.env.REVIEWER_EMAILS || '').split(',').map(s => s.trim()).filter(Boolean)
    for (const r of reviewers) await this.notifier.sendEmail(r, '待审核文章', `新文章待审核: ${data.title}`)
    return { success: true }
  }
}
