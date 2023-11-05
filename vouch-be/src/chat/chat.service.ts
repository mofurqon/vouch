import { Injectable } from '@nestjs/common';
import { CreateChatDto, ExitRoomDto, JoinRoomDto } from './dto/chat.dto';

import { Model } from 'mongoose';
import { ChatDocument, Chats } from './entities/chat.entity';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, Users } from './entities/user.entity';
import { RoomDocument, Rooms } from './entities/room.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('chats')
    private chatModel: Model<ChatDocument>,
    @InjectModel('users')
    private userModel: Model<UserDocument>,
    @InjectModel('rooms')
    private roomModel: Model<RoomDocument>,
  ) {}

  async create(createChatDto: CreateChatDto) {
    return (await this.chatModel.create(createChatDto)).populate('userId');
  }

  async findAll(roomId: string) {
    return await this.chatModel.find({ roomId }).populate('userId');
  }

  async joinRoom(joinRoomDto: JoinRoomDto) {
    try {
      let user: UserDocument;
      let room: RoomDocument;

      const findUser = await this.userModel.findOne({
        username: joinRoomDto.username,
      });

      if (findUser) {
        user = findUser;
      } else {
        user = await this.userModel.create({
          username: joinRoomDto.username,
        });
      }

      const findRoom = await this.roomModel.findOne({
        name: joinRoomDto.roomname,
      });
      if (findRoom) {
        if (findRoom.userList.includes(user._id))
          return {
            status: 400,
            message: 'Username already taken',
          };

        room = findRoom;
        await this.roomModel.updateOne(
          { _id: room._id },
          { $set: { userList: [...room.userList, user._id] } },
        );
      } else {
        room = await this.roomModel.create({
          name: joinRoomDto.roomname,
          userList: [user._id],
        });
      }

      return {
        user: user,
        room: room,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async exitRoom(exitRoomDto: ExitRoomDto) {
    try {
      const findRoom = await this.roomModel.findOne({
        _id: exitRoomDto.roomId,
      });

      const newUserList = findRoom.userList.filter(
        (user) => user._id.toString() !== exitRoomDto.userId,
      );

      return await this.roomModel.updateOne(
        { _id: exitRoomDto.roomId },
        { $set: { userList: newUserList } },
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUser(clientId: string) {
    return await this.userModel.findOne({ clientId });
  }
}
