import type {User} from '../redux/slices/userSlice';
import type {Message} from '../redux/slices/messageSlice';

import {captureMessage, getRoomMessages, sendChatBotMsg} from './messages';
import {
  addUser,
  addTypingUser,
  removeTypingUser,
  switchUserRoom,
  getAllUsers,
  updateUserSid,
  getUser,
  removeUser,
  getRoomUsers,
  getTypingUsers,
} from './users';

const StartListeners = (server: any, socket: any): void => {
  console.log(`${socket.id} connected from listeners `);

  // TODO; make const for allUsers
  socket.on('joinRoom', ({...user}, newUser: null | boolean) => {
    const {id, username, room} = user;
    user.sid = socket.id;
    socket.join(room);
    console.log(newUser);
    console.log(getRoomUsers(user.room));

    // Welcome current user
    if (newUser !== false) {
      sendChatBotMsg(room, `🤗 Welcome to the ${room} room, ${username}! `);
      getUser(id) === undefined &&
        addUser({id, username, room, sid: socket.id});
    } else {
      updateUserSid(id, socket.id);
    }
    // Send users and messages back to room
    server.to(room).emit('roomUsers', getRoomUsers(room));
    server.to(room).emit('roomMessages', getRoomMessages(room));
  });

  socket.on('chatMessage', ({author, text, room}: Message) => {
    captureMessage({author, text, room});
    server.to(room).emit('roomMessages', getRoomMessages(room));
  });
  console.log(getAllUsers());

  socket.on('typing', (data: string) => {
    //
    addTypingUser(data);
    console.log(getTypingUsers());
    server.emit('showTyping', getTypingUsers());
  });

  socket.on('clearTyping', (data: string) => {
    removeTypingUser(data);
    console.log('rm user', removeTypingUser(data));
    server.emit('stopTyping', getTypingUsers());
  });
  // Runs when server leaves the chat application
  socket.on('userLeaving', ({id, username, room}: User) => {
    sendChatBotMsg(room as string, `😥 ${username} has left the room `);
    socket.leave(room as string);
    removeUser(id);
    console.log('all users', getAllUsers());
  });

  socket.on(
    'userSwitching',
    (id: string, username: string, room: string, newRoom: string) => {
      sendChatBotMsg(room, `😥 ${username} has switched rooms `);
      switchUserRoom(id, newRoom);
      socket.leave(room);
    }
  );
  socket.on('disconnect', () => {
    console.log(`${socket.id} has disconnected`);
    const user = getAllUsers().find((user) => user.sid === socket.id);
    if (user !== undefined) {
      const {id, username, room} = user;
      removeUser(id);
      server.to(room).emit('roomUsers', getAllUsers());
      sendChatBotMsg(room, `😥 ${username} has logged off `);
      server.to(room).emit('roomMessages', getRoomMessages(room));
    }
  });
};

export default StartListeners;
