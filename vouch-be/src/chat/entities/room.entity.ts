import * as mongoose from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserDocument } from './user.entity';

export type RoomDocument = Rooms & Document;

@Schema({ timestamps: true })
export class Rooms {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }] })
  userList: UserDocument[];

}

export const RoomSchema = SchemaFactory.createForClass(Rooms);
