import { forwardRef, Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from '../email/email.module';
import { ServiceSchema } from './schemas/services.schema';
import { RequestsModule } from '../requests/requests.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'service', schema: ServiceSchema }]),
    EmailModule,
    forwardRef(() => RequestsModule),
  ],
  providers: [ServicesService],
  controllers: [ServicesController],
  exports: [ServicesService],
})
export class ServicesModule {}
