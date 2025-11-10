import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      ok: true,
      service: 'speed-backend',
      routes: ['submissions', 'reviews', 'analysis', 'evidence', 'search'],
      timestamp: new Date().toISOString(),
    };
  }
}