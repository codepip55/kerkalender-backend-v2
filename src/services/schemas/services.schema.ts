import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";
import { User } from "../../users/schemas/user.schema";

export type ServiceDocument = Service & Document;

@Schema()
export class Service {
  _id: string;
  get id() {
    return this._id;
  }

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  // location, notes, service_manager, setlist
  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  notes: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  })
  service_manager: User;

  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'setlist',
  //   required: true,
  // })
  // setlist: Setlist;

  @Prop({
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        positions: [
          {
            name: {
              type: String,
              required: true,
            },
            users: [
              {
                user: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'user',
                  required: true,
                },
                status: {
                  type: String,
                  enum: ['accepted', 'waiting', 'rejected'],
                  required: true,
                },
              },
            ],
          },
        ],
      },
    ],
  })
  teams: {
    name: string;
    positions: {
      name: string;
      users: {
        user: User;
        status: 'accepted' | 'waiting' | 'rejected';
      }[];
    }[];
  }[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

const ServiceSchema = SchemaFactory.createForClass(Service);
export { ServiceSchema };
