import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { EvidenceDto } from '../common/dto';
import { AnalysisService } from './analysis.service';

@Controller('analysis')
export class AnalysisController {
  constructor(private analysis: AnalysisService) {}

  @Get('queue')
  queue() {
    return this.analysis.queue();
  }

  @Post(':id/evidence')
  addEvidence(@Param('id') id: string, @Body() body: EvidenceDto) {
    return this.analysis.addEvidence(id, body);
  }
}