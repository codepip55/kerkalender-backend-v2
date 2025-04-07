import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getStatus() {
    return { status: 'ok' };
  }
}
