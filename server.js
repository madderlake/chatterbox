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

app.use(cors());

httpServer.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});

const chatBot = {username: 'Chatterbug', id: '0', room: ''};

io.on('connection', (socket) => {
  socket.connected === true && console.log(`${socket.id} connected `);

  socket.on('joinRoom', ({id, username, room}) => {
    socket.join(room);
    if (getCurrentUser(id) === undefined) {
      addUser({id, username, room});
    } else {
      updateUser(id, 'room', room);
    }

    // Welcome current user
    captureMessage({
      author: chatBot,
      text: `🤗 Welcome to the ${room} room, ${username}! `,
      room: room,
    });
    // io.to(room).emit('currentUser', {
    //   currentUser: getCurrentUser(id),
    // });
    io.to(room).emit('roomUsers', {
      room: room,
      currentUser: getCurrentUser(id),
      users: getRoomUsers(room),
    });

    io.to(room).emit('sendMessages', {
      room: room,
      messages: getRoomMessages(room),
    });
    console.log('current user', getCurrentUser(id));
  });

  // Send users and room info
  socket.on('connect', ({room}) => {
    socket.join(room);
    io.to(room).emit('roomUsers', {
      room: room,
      users: getRoomUsers(room),
    });
  });

  socket.on('chatMessage', ({author, text, room}) => {
    captureMessage({author, text, room});
    io.to(room).emit('sendMessages', {
      messages: getRoomMessages(room),
    });
  });
  // Runs when client disconnects
  socket.on('userLeaving', ({id, username, room}) => {
    chatBot.room = room;
    captureMessage({
      author: chatBot,
      text: `😥 ${username} has left the room `,
      room: room,
    });
    io.to(room).emit('sendMessages', {
      room: room,
      messages: getRoomMessages(room),
    });
    socket.on('disconnect', () => {
      socket.leave(room);
      userLeave(id);
    });
  });
});
