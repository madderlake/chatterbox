import * as express from 'express';
import * as http from 'http';
import * as cors from 'cors';
import {Server} from 'socket.io';
import type {User} from './src/redux/slices/userSlice';
import type {Message} from './src/redux/slices/messageSlice';
//import StartListeners from './src/server/listeners';
import {
  getRoomMessages,
  sendChatBotMsg,
  captureMessage,
} from './src/server/messages';
import {
  addUser,
  switchUserRoom,
  removeUser,
  getRoomUsers,
  getAllUsers,
} from './src/server/users';

const app = express();
const httpServer = http.createServer(app);
const PORT = 8083;

type Data = User | Message;
type BasicEmit = (data: Data | Data[]) => void;

export interface ServerToClientEvents {
  // noArg: () => void;
  //basicEmit: (ev: string, data: Data | Data[]) => void;
  roomUsers: BasicEmit;
  roomMessages: BasicEmit;
  //withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

app.use(cors());

export const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents
>(httpServer, {
  /* options */
  cors: {
    origin: `*`,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

httpServer.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});

io.on('connection', (socket: any) => {
  console.log(`${socket.id} connected `);
  socket.on('joinRoom', ({...user}, newUser: null | boolean) => {
    const {id, username, room} = user;
    socket.join(room);
    addUser({id, username, room});
    console.log(getRoomUsers(room));
    console.log(newUser);
    // Welcome current user
    if (newUser === null)
      sendChatBotMsg(room, `🤗 Welcome to the ${room} room, ${username}! `);

    // Send users and messages back to room
    io.to(room).emit('roomUsers', getRoomUsers(room));
    io.to(room).emit('roomMessages', getRoomMessages(room));
  });

  socket.on('chatMessage', ({author, text, room}: Message) => {
    captureMessage({author, text, room});
    io.to(room).emit('roomMessages', getRoomMessages(room));
  });
  //console.log(getAllUsers());

  // Runs when server leaves the chat application
  socket.on('userLeaving', ({id, username, room}: User) => {
    sendChatBotMsg(room as string, `😥 ${username} has left the room `);
    socket.leave(room);
    removeUser(id);
    console.log('all users', getAllUsers());
    //io.to(room as string).emit('roomUsers', getRoomUsers(room as string));
  });

  socket.on(
    'userSwitching',
    (id: string, username: string, room: string, newRoom: string) => {
      sendChatBotMsg(room, `😥 ${username} has switched rooms `);
      switchUserRoom(id, newRoom);
      socket.leave(room);
    }
  );
});
