import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto, ExitRoomDto, JoinRoomDto } from './dto/chat.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('createChat')
  async create(@MessageBody() createChatDto: CreateChatDto) {
    const result = await this.chatService.create(createChatDto);
    this.server.emit('message', result);
    return result;
  }

  @SubscribeMessage('findAllChat')
  async findAll(@MessageBody('roomId') roomId: string) {
    const result = await this.chatService.findAll(roomId);

    return result;
  }

  @SubscribeMessage('join')
  async joinRoom(@MessageBody() body: JoinRoomDto) {
    const result = await this.chatService.joinRoom(body);
    return result;
  }

  @SubscribeMessage('exit')
  async exitRoom(@MessageBody() body: ExitRoomDto) {
    const result = await this.chatService.exitRoom(body);
    return result;
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.chatService.getUser(client.id);
    client.broadcast.emit('typing', { name: result.username, isTyping });
  }
}
