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
  },
});
const cors = require('cors');

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./src/utils/users');

const {formatMessage, captureMessage} = require('./src/utils/messages');

app.use(cors());

httpServer.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});

io.on('connection', (socket) => {
  console.log(`${socket.id} connected `);

  socket.on('joinRoom', ({username, room}) => {
    userJoin(socket.id, username, room);
  });

  // Welcome current user
  //socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

  // Send users and room info
  socket.on('readyForUsers', ({room}) => {
    socket.join(room);
    io.to(room).emit('roomUsers', {
      room: room,
      users: getRoomUsers(room),
    });
  });
  // Runs when client disconnects
  socket.on('userLeaving', ({id}) => {
    const user = userLeave(id);
    socket.on('disconnect', () => {
      if (user) {
        io.to(user.room).emit(
          'message'
          //formatMessage(botName, `${user.username} has left the chat`)
        );

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
  });
});
