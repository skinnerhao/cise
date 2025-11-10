import { Controller, Param, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviews: ReviewsService) {}

  @Post('accept/:id')
  accept(@Param('id') id: string) {
    return this.reviews.accept(id);
  }

  @Post('reject/:id')
  reject(@Param('id') id: string) {
    return this.reviews.reject(id);
  }
}