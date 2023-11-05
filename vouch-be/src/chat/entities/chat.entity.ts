import * as mongoose from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserDocument } from './user.entity';
import { RoomDocument } from './room.entity';

export type ChatDocument = Chats & Document;


@Schema({ timestamps: true })
export class Chats {
  @Prop({ required: true })
  message: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'rooms' })
  roomId: RoomDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  userId: UserDocument;
}

export const ChatSchema = SchemaFactory.createForClass(Chats);
