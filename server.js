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
    //credentials: true,
    transports: ['websocket', 'polling'],
  },
});

const {
  addUser,
  updateUser,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./src/utils/users');

const {
  //formatMessage,
  captureMessage,
  getRoomMessages,
} = require('./src/utils/messages');

httpServer.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});

const chatBot = {username: 'Chatterbug', id: '0', room: ''};

io.on('connect', (socket) => {
  console.log(`${socket.id} connected `);

  socket.on('joinRoom', ({username, room, id}, firstJoin) => {
    socket.join(room);
    if (getCurrentUser(id) === undefined) {
      addUser({id, username, room});
    }
    // Welcome current user
    if (firstJoin === null) {
      captureMessage({
        author: chatBot,
        text: `🤗 Welcome to the ${room} room, ${username}! `,
        room: room,
      });
    }
    io.to(room).emit('roomUsers', {
      room: room,
      users: getRoomUsers(room),
    });

    io.to(room).emit('roomMessages', {
      room: room,
      messages: getRoomMessages(room),
    });
    console.log('users', getRoomUsers(room));
  });

  socket.on('chatMessage', ({author, text, room}) => {
    captureMessage({author, text, room});
    io.to(room).emit('roomMessages', {
      room,
      messages: getRoomMessages(room),
    });
    console.log(getRoomMessages(room));
  });

  // Runs when client leaves the chat
  socket.on('userLeaving', ({id, username, room}) => {
    chatBot.room = room;
    captureMessage({
      author: chatBot,
      text: `😥 ${username} has left the room `,
      room: room,
    });
    io.to(room).emit('roomMessages', {
      room: room,
      messages: getRoomMessages(room),
    });

    socket.leave(room);
    userLeave(id);
  });
});
