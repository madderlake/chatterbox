import http from 'http';
import express from 'express';
import {Socket, Server} from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = http.createServer(app);
const PORT = 8083;
app.use(cors());

const io = new Server(httpServer, {
  /* options */
  cors: {
    origin: `http://localhost:3000`,
    methods: ['GET', 'POST'],
    credentials: true,
    //transports: ['websocket', 'polling'],
  },
});

httpServer.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});
const {
  addUser,
  getAllUsers,
  sendChatBotMsg,
  switchUserRoom,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./src/utils/users');

const {captureMessage, getRoomMessages} = require('./src/utils/messages');

io.on('connect', (socket: Socket) => {
  console.log(`${socket.id} connected `);
  socket.on('joinRoom', ({username, room, id}, newUser) => {
    socket.join(room);
    getCurrentUser(id) === undefined && addUser({id, username, room});
    // Welcome current user
    newUser === null &&
      sendChatBotMsg(room, `🤗 Welcome to the ${room} room, ${username}! `);
    // Send users and messages back to room
    io.to(room).emit('roomUsers', getRoomUsers(room));
    io.to(room).emit('roomMessages', getRoomMessages(room));
  });

  socket.on('chatMessage', ({author, text, room}) => {
    captureMessage({author, text, room});
    io.to(room).emit('roomMessages', getRoomMessages(room));
  });
  //console.log(getAllUsers());

  // Runs when client leaves the chat
  socket.on('userLeaving', ({id, username, room}) => {
    sendChatBotMsg(room, `😥 ${username} has left the room `);
    socket.leave(room);
    //remove from users on server
    userLeave(id);
  });

  socket.on('userSwitching', ({id, username, room}, newRoom) => {
    sendChatBotMsg(room, `😥 ${username} has switched rooms `);
    switchUserRoom(id, newRoom);
    socket.leave(room);
  });
});
