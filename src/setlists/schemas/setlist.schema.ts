import { Document } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Service } from '../../services/schemas/services.schema';
import mongoose from 'mongoose';

export type SetlistDocument = Setlist & Document;

export class Setlist {
  _id: string;
  get id() {
    return this._id;
  }

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'service',
    required: true,
  })
  service: Service;

  @Prop({
    type: [
      {
        title: {
          type: String,
          required: true,
        },
        artist: {
          type: String,
          required: true,
        },
        key: {
          type: String,
          required: true,
        },
        bpm: {
          type: Number,
          required: true,
        },
        vocalNotes: {
          type: String,
          required: true,
        },
        bandNotes: {
          type: String,
          required: true,
        },
      },
    ],
  })
  songs: {
    title: string;
    artist: string;
    key: string;
    bpm: number;
    vocalNotes: string;
    bandNotes: string;
  }[];

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

const SetlistSchema = SchemaFactory.createForClass(Setlist);
export { SetlistSchema };
