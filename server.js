const express = require('express');
const http = require('http');
const {Server} = require('socket.io');

const app = express();
const httpServer = http.createServer(app);
const PORT = 8083;
const cors = require('cors');
app.use(cors());

const io = new Server(httpServer, {
  /* options */
  cors: {
    origin: `http://localhost:3000`,
    methods: ['GET', 'POST'],
    credentials: true,
    transports: ['websocket', 'polling'],
  },
});

const {
  addUser,
  getAllUsers,
  switchUserRoom,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./src/utils/users');

const {captureMessage, getRoomMessages} = require('./src/utils/messages');

httpServer.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});

const chatBot = {username: 'Chatterbug', id: '0', room: ''};

const sendChatBotMsg = (room, text) => {
  return captureMessage({
    author: chatBot,
    text,
    room,
  });
};

io.on('connect', (socket) => {
  console.log(`${socket.id} connected `);

  socket.on('joinRoom', ({username, room, id}, firstJoin) => {
    socket.join(room);
    getCurrentUser(id) === undefined && addUser({id, username, room});
    // Welcome current user
    firstJoin === null &&
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
