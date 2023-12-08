import type { User, Message, Author } from '../../../types';
import * as users from './users';
import * as msgs from './messages';
import { titleCase } from '../../client/utils/helpers';

const StartListeners = (server: any, socket: any): void => {
  console.log(`${socket.id} connected from listeners `);
  const connectedClients = server.sockets.sockets;

  const refreshRoom = (room: string) => {
    server.to(room).emit('roomUsers', users.getRoomUsers(room));
    server.to(room).emit('roomMessages', msgs.getRoomMessages(room));
  };

  socket.on('joinRoom', ({ ...user }, newUser: null | boolean) => {
    const { id, username, room, sid } = user;
    socket.join(room);
    users.getUser(id) === undefined &&
      users.addUser({ id, username, room, sid } as User);

    if (newUser === true) {
      msgs.sendChatBotMsg(
        room,
        `🤗 Welcome to the ${titleCase(room)} room, ${username}! `
      );
    } else {
      msgs.sendChatBotMsg(
        room,
        `🤗 Reconnected to the ${titleCase(room)} room, ${username}!`
      );
    }
    // Send users and messages back to room
    refreshRoom(room);
  });

  socket.on('chatMessage', async (msg: Message) => {
    const { author, text, room } = msg;
    msgs.captureMessage({ author, text, room });
    refreshRoom(room);
  });

  socket.on('typing', (data: Author) => {
    users.addTypingUser(data.username);
    const typingArr = Array.from(users.getTypingUsers());
    server.to(data.room).emit('showTyping', typingArr);
  });

  socket.on('typingEnd', (data: Author) => {
    users.removeTypingUser(data.username);
    const typingArr = Array.from(users.getTypingUsers());
    server.to(data.room).emit('stillTyping', typingArr);
  });

  socket.on('leaveRoom', ({ id, username, room }: User) => {
    msgs.sendChatBotMsg(room, `😥 ${username} has left the room `);
    users.removeTypingUser(username);
    socket.leave(room);
    users.removeUser(id);
    refreshRoom(room);
  });

  socket.on('logOut', ({ id, username, room, sid }: User) => {
    msgs.sendChatBotMsg(room, `😥 ${username} has logged off `);
    users.removeTypingUser(username);
    socket.leave(room);
    connectedClients.forEach((socket: any) => {
      if (socket.id === sid) socket.disconnect(true);
    });

    users.removeUser(id);
    refreshRoom(room);
  });

  socket.on('switchRoom', ({ ...user }, newRoom: string) => {
    const { id, username, room } = user;
    msgs.sendChatBotMsg(room, `😥 ${username} has switched rooms `);
    users.switchUserRoom(id, newRoom);
    socket.leave(room);
    socket.join(newRoom);
    refreshRoom(room);
    refreshRoom(newRoom);
  });

  socket.on('disconnect', (reason: string) => {
    console.log(`${socket.id} has disconnected - ${reason}`);
  });
};

export default StartListeners;
