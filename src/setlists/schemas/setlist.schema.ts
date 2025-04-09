import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Service } from '../../services/schemas/services.schema';
import mongoose from 'mongoose';

export type SetlistDocument = Setlist & Document;

@Schema()
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
    required: true,
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
