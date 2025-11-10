import { Body, Controller, Get, Post } from '@nestjs/common';
import type { SubmissionDto } from '../common/dto';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
export class SubmissionsController {
  constructor(private submissions: SubmissionsService) {}

  @Post()
  create(@Body() body: SubmissionDto) {
    return this.submissions.create(body);
  }

  @Get('pending')
  pending() {
    return this.submissions.findPending();
  }
}