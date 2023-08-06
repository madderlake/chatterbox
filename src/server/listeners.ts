import {captureMessage} from './messages';
import {getRoomMessages} from './messages';
import {sendChatBotMsg} from './messages';
import {addUser} from './users';
import {switchUserRoom} from './users';
// import {getAllUsers} from './users';
import {getCurrentUser} from './users';
import {removeUser} from './users';
import {getRoomUsers} from './users';

import type {Socket} from 'socket.io';
import {io} from '../../server';

const StartListeners = (server: any, socket: Socket): void => {
  socket.on('joinRoom', ({username, room, id}, firstJoin) => {
    socket.join(room);
    addUser({id, username, room});
    console.log(getRoomUsers(room));
    // Welcome current user
    firstJoin === null &&
      sendChatBotMsg(room, `🤗 Welcome to the ${room} room, ${username}! `);

    // Send users and messages back to room
    server.to(room).emit('basicEmit', 'roomUsers', getRoomUsers(room));
    server.to(room).emit('basicEmit', 'roomMessages', getRoomMessages(room));
  });

  socket.on('chatMessage', ({author, text, room}) => {
    captureMessage({author, text, room});
    server.to(room).emit('basicEmit', 'roomMessages', getRoomMessages(room));
  });
  //console.log(getAllUsers());

  // Runs when server leaves the chat application
  socket.on('userLeaving', ({id, username, room}) => {
    sendChatBotMsg(room, `😥 ${username} has left the room `);
    socket.leave(room);
    removeUser(id);
  });

  socket.on('userSwitching', ({id, username, room}, newRoom: string) => {
    sendChatBotMsg(room, `😥 ${username} has switched rooms `);
    switchUserRoom(id, newRoom);
    socket.leave(room);
  });
};

export default StartListeners;
