import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('evidence')
  search(@Query('practice') practice?: string, @Query('claim') claim?: string) {
    return this.searchService.search(practice, claim);
  }
}