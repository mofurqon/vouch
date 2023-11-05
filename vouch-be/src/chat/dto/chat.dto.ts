import {
    IsNotEmpty,
    IsString,
  } from 'class-validator';
  
  export class CreateChatDto {
    @IsNotEmpty()
    @IsString()
    message: string;
  
    @IsNotEmpty()
    @IsString()
    roomId: string;
  
    @IsNotEmpty()
    @IsString()
    userId: string;
  }

  export class JoinRoomDto {
    @IsNotEmpty()
    @IsString()
    username: string;
  
    @IsNotEmpty()
    @IsString()
    roomname: string;
  }

  export class ExitRoomDto {
    @IsNotEmpty()
    @IsString()
    userId: string;
  
    @IsNotEmpty()
    @IsString()
    roomId: string;
  }
  