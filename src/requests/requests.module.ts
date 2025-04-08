import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';

@Module({
  providers: [RequestsService],
  controllers: [],
})
export class RequestsModule {}
