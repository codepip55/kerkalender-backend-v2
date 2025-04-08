import { forwardRef, Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [forwardRef(() => ServicesModule)],
  providers: [RequestsService],
  exports: [RequestsService],
})
export class RequestsModule {}
