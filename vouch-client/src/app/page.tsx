'use client';
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export default function Home() {
  const socket = io(process.env.NEXT_PUBLIC_BE_URL!);

  const [messages, setMessages] = useState<any[]>([]);
  const [username, setUsername] = useState<string>('');
  const [roomname, setRoomname] = useState<string>('');
  const [joined, setJoined] = useState(false);
  const [loginInfo, setLoginInfo] = useState<any>();
  const [text, setText] = useState('');
  const [errMessage, setErrMessage] = useState<any>(null);

  useEffect(() => {
    socket.emit(
      'findAllChat',
      { roomId: loginInfo?.room?._id },
      (resp: any) => {
        setMessages(resp);
      }
    );
  }, [loginInfo]);

  useEffect(() => {
    socket.on('message', (message) => {
      const newMessages = [...messages, message];
      setMessages(newMessages);
    });
  }, [messages]);

  const joinRoom = () => {
    socket.emit('join', { username, roomname }, (resp: any) => {
      if (resp?.status === 400) {
        setErrMessage(resp?.message);
      } else {
        setLoginInfo(resp);
        setJoined(true);
        setErrMessage(null);
      }
    });
  };

  const exitRoom = () => {
    socket.emit(
      'exit',
      { userId: loginInfo?.user?._id, roomId: loginInfo?.room?._id },
      (resp: any) => {
        if (resp?.status === 400) {
          setErrMessage(resp?.message);
        } else {
          setJoined(false);
          setRoomname('');
          setUsername('');
          setErrMessage(null);
        }
      }
    );
  };

  const handleJoinroom = () => {
    if (username.length > 0 && roomname.length > 0) {
      joinRoom();
    } else {
      setErrMessage('Username and RoomID is required');
    }
  };

  const sendMessage = () => {
    socket.emit(
      'createChat',
      {
        message: text,
        roomId: loginInfo?.room?._id,
        userId: loginInfo?.user?._id,
      },
      () => {
        setText('');
      }
    );
  };

  return (
    <>
      {!joined && (
        <div className="container mx-auto min-h-screen relative">
          <form>
            <div className="text-center text-2xl font-bold">Join Chatroom</div>
            <div className="mx-10 my-5">
              <input
                type="text"
                placeholder="Username"
                className="input input-bordered w-full bg-neutral-100"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mx-10 my-5">
              <input
                type="text"
                placeholder="RoomID"
                className="input input-bordered w-full bg-neutral-100"
                value={roomname}
                onChange={(e) => setRoomname(e.target.value)}
              />
            </div>
            <div className="mx-10 my-20 absolute bottom-1 inset-x-0">
              <button
                className="shadow bg-emerald-500 hover:bg-emerald-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded w-full"
                type="button"
                onClick={handleJoinroom}
              >
                Join
              </button>
            </div>
          </form>
          {errMessage && (
            <div className="toast">
              <div className="alert alert-error">
                <span>{errMessage}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {joined && (
        <div className="container mx-auto min-h-screen relative">
          <div className="flex justify-between">
            <div
              className="text-emerald-500 hover:cursor-pointer"
              onClick={exitRoom}
            >
              Exit
            </div>
            <div className="text-xl font-bold">{loginInfo?.room?.name}</div>
            <div className=""></div>
          </div>
          <div>
            {messages.map((message) => (
              <div
                className={
                  message?.userId?._id === loginInfo?.user?._id
                    ? 'chat chat-end'
                    : 'chat chat-start'
                }
                key={message?.id}
              >
                <div className="chat-header" key={message?.id}>
                  {message?.userId?.username}
                  <time className="text-xs opacity-50">
                    {' '}
                    {new Date(message?.createdAt).getHours() +
                      ':' +
                      new Date(message?.createdAt).getMinutes()}
                  </time>
                </div>
                <div
                  className={
                    message?.userId?._id === loginInfo?.user?._id
                      ? 'chat-bubble bg-emerald-500 text-white'
                      : 'chat-bubble bg-neutral-300 text-black'
                  }
                  key={message?.id}
                >
                  {message?.message}
                </div>
              </div>
            ))}
          </div>
          <div className="flex mt-5 sticky inset-x-0 bottom-1">
            <div className="flex-auto px-2">
              <input
                type="text"
                placeholder="Message here..."
                className="input input-bordered w-full"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyUp={(e) => (e.key === 'Enter' ? sendMessage() : undefined)}
              />
            </div>
            <div className="flex-none">
              <button
                className="btn btn-square bg-emerald-500"
                onClick={sendMessage}
                type="submit"
              >
                <svg
                  className="w-6 h-6 bg-emerald-500 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13V1m0 0L1 5m4-4 4 4"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
