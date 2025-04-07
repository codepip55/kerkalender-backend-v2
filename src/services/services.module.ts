import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'service', schema: 'ServiceSchema' }]),
  ],
  providers: [ServicesService],
  controllers: [ServicesController],
})
export class ServicesModule {}
