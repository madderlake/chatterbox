import type {User} from '../redux/slices/userSlice';
import type {Message} from '../redux/slices/messageSlice';

import {captureMessage, getRoomMessages, sendChatBotMsg} from './messages';
import {
  addUser,
  switchUserRoom,
  getAllUsers,
  getUser,
  removeUser,
  getRoomUsers,
} from './users';

const StartListeners = (server: any, socket: any): void => {
  console.log(`${socket.id} connected from listeners `);
  socket.on('joinRoom', ({...user}, newUser: null | boolean) => {
    const {id, username, room} = user;
    socket.join(room);
    console.log(newUser);
    console.log(getRoomUsers(user.room));

    // Welcome current user
    if (newUser === null || newUser === true) {
      sendChatBotMsg(room, `🤗 Welcome to the ${room} room, ${username}! `);
      getUser(id) === undefined && addUser({id, username, room});
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
  });
};

export default StartListeners;
