import { Controller, Get, Param } from '@nestjs/common';
import { EvidenceService } from './evidence.service';

@Controller('evidence')
export class EvidenceController {
  constructor(private evidence: EvidenceService) {}

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.evidence.getById(id);
  }
}