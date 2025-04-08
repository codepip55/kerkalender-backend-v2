import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from '../email/email.module';
import { ServiceSchema } from './schemas/services.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'service', schema: ServiceSchema }]),
    EmailModule,
  ],
  providers: [ServicesService],
  controllers: [ServicesController],
})
export class ServicesModule {}
