import { Module } from '@nestjs/common';
import { SetlistsController } from './setlists.controller';
import { SetlistsService } from './setlists.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SetlistSchema } from './schemas/setlist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'setlist', schema: SetlistSchema }]),
  ],
  controllers: [SetlistsController],
  providers: [SetlistsService],
})
export class SetlistsModule {}
