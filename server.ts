import * as express from 'express';
import * as http from 'http';
import * as cors from 'cors';
import {Server} from 'socket.io';
import type {User} from './src/redux/slices/userSlice';
import type {Message} from './src/redux/slices/messageSlice';
//import StartListeners from './src/server/listeners';
import {getRoomMessages} from './src/server/messages';
import {sendChatBotMsg} from './src/server/messages';
import {captureMessage} from './src/server/messages';
import {addUser} from './src/server/users';
import {switchUserRoom} from './src/server/users';
// import {getAllUsers} from './users';
import {getCurrentUser} from './src/server/users';
import {removeUser} from './src/server/users';
import {getRoomUsers} from './src/server/users';
// import type {Socket} from 'socket.io';

const app = express();
const httpServer = http.createServer(app);
const PORT = 8083;

type Data = User | Message;
export interface ServerToClientEvents {
  // noArg: () => void;
  basicEmit: (ev: string, data: Data | Data[]) => void;
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
  socket.on('joinRoom', ({...user}, firstJoin: null | boolean) => {
    const {id, username, room} = user;
    socket.join(room);
    addUser({id, username, room});
    console.log(getRoomUsers(room));
    console.log(firstJoin);
    // Welcome current user
    firstJoin === null &&
      sendChatBotMsg(room, `🤗 Welcome to the ${room} room, ${username}! `);

    // Send users and messages back to room
    io.to(room).emit('basicEmit', 'roomUsers', getRoomUsers(room));
    io.to(room).emit('basicEmit', 'roomMessages', getRoomMessages(room));
  });

  socket.on('chatMessage', ({author, text, room}: Message) => {
    captureMessage({author, text, room});
    io.to(room).emit('basicEmit', 'roomMessages', getRoomMessages(room));
  });
  //console.log(getAllUsers());

  // Runs when server leaves the chat application
  socket.on('userLeaving', (id: string, username: string, room: string) => {
    sendChatBotMsg(room, `😥 ${username} has left the room `);
    socket.leave(room);
    removeUser(id);
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
