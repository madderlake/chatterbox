const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');

const app = express();
const httpServer = createServer(app);
const PORT = 8083;
const io = new Server(httpServer, {
  /* options */
  cors: {
    origin: `http://localhost:3000`,
    methods: ['GET', 'POST'],
    credentials: true,
    transports: ['websocket', 'polling'],
  },
});
const cors = require('cors');

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./src/utils/users');

const {
  formatMessage,
  captureMessage,
  getRoomMessages,
} = require('./src/utils/messages');

app.use(cors());

httpServer.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});

const chatBot = {username: 'Chatterbug', id: '0', room: ''};
io.on('connection', (socket) => {
  socket.connected === true && console.log(`${socket.id} connected `);
  // console.log(io.engine.clientsCount);
  socket.on('joinRoom', ({id, username, room}) => {
    userJoin({id, username, room});
    captureMessage({
      author: chatBot,
      text: `🤗 Welcome to the ${room} room, ${username}! `,
    });
    chatBot.room = room;
    // Welcome current user
    io.to(room).emit('roomMessages', {
      room: room,
      messages: getRoomMessages(room),
    });
  });

  // Send users and room info
  socket.on('readyForUsers', ({room}) => {
    socket.join(room);
    io.to(room).emit('roomUsers', {
      room: room,
      users: getRoomUsers(room),
    });
  });

  socket.on('readyForMessages', ({room}) => {
    io.to(room).emit('roomMessages', {
      room: room,
      messages: getRoomMessages(room),
    });
  });

  socket.on('chatMessage', ({author, text}) => {
    captureMessage({author, text});
    console.log(author.room, getRoomMessages(author.room));
    io.to(author.room).emit('roomMessages', {
      // room: author.room,
      messages: getRoomMessages(author.room),
    });
  });
  // Runs when client disconnects
  socket.on('userLeaving', ({id}) => {
    const user = userLeave(id);
    captureMessage({
      author: chatBot,
      text: `😥 ${user.username} has left the chat `,
    });
    chatBot.room = user.room;
    io.to(user.room).emit('roomMessages', {
      room: user.room,
      messages: getRoomMessages(user.room),
    });
    socket.on('disconnect', () => {
      if (user) {
        // Send users and room info
        socket.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
  });
});
