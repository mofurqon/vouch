import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, Users } from './entities/user.entity';
import { ChatSchema, Chats } from './entities/chat.entity';
import { RoomSchema, Rooms } from './entities/room.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'users', schema: UserSchema },
      { name: 'chats', schema: ChatSchema },
      { name: 'rooms', schema: RoomSchema },
    ]),
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
