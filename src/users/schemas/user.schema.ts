import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: string;
  get id() {
    return this._id;
  }

  @Prop({ required: true })
  cid: number;

  @Prop({ required: true })
  nameFull: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ nameFull: 'text' });
export { UserSchema };
