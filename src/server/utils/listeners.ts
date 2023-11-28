import type { User, Message, Author } from '../../../types';
import * as users from './users';
import * as msgs from './messages';
import { titleCase } from '../../client/utils/helpers';

const StartListeners = (server: any, socket: any): void => {
  console.log(`${socket.id} connected from listeners `);
  // const sidMap = socket.adapter.sids;

  // TODO; make const for allUsers
  socket.on('joinRoom', ({ ...user }, newUser: null | boolean) => {
    const { id, username, room } = user;
    user.sid = socket.id;
    socket.join(room);

    // Welcome current user
    if (newUser !== false) {
      msgs.sendChatBotMsg(
        room,
        `🤗 Welcome to the ${titleCase(room)} room, ${username}! `
      );

      users.getUser(id) === undefined &&
        users.addUser({ id, username, room, sid: socket.id });
    } else {
      users.updateUserSid(id, socket.id);
    }

    // Send users and messages back to room
    server.to(room).emit('roomUsers', users.getRoomUsers(room));
    server.to(room).emit('roomMessages', msgs.getRoomMessages(room));
  });

  socket.on('reconnectUser', (user: User) => {
    if (users.getUser(user.id) === undefined) {
      console.log(user.username, 'sid:', socket.id);
      msgs.sendChatBotMsg(user.room, `${user.username} reconnected`);
      users.addUser(user);
    }

    server.to(user.room).emit('roomUsers', users.getRoomUsers(user.room));
  });
  socket.on('chatMessage', async (msg: Message) => {
    const { author, text, room } = msg;
    msgs.captureMessage({ author, text, room });
    server.to(room).emit('roomMessages', msgs.getRoomMessages(room));
    server.to(room).emit('roomUsers', users.getRoomUsers(room));
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

  // Runs when server leaves the chat application
  socket.on('leave room', ({ id, username, room }: User) => {
    msgs.sendChatBotMsg(room, `😥 ${username} has left the room `);
    users.removeTypingUser(username);
    socket.leave(room);
    users.removeUser(id);
    server.to(room).emit('roomUsers', users.getRoomUsers(room));
    server.to(room).emit('roomMessages', msgs.getRoomMessages(room));
  });

  socket.on('log off', ({ id, username, room }: User) => {
    msgs.sendChatBotMsg(room, `😥 ${username} has logged off `);
    users.removeTypingUser(username);
    socket.leave(room);
    users.removeUser(id);
    socket.disconnect();
    server.to(room).emit('roomUsers', users.getRoomUsers(room));
    server.to(room).emit('roomMessages', msgs.getRoomMessages(room));
  });

  socket.on(
    'switch room',
    (id: string, username: string, room: string, newRoom: string) => {
      msgs.sendChatBotMsg(room, `😥 ${username} has switched rooms `);
      users.switchUserRoom(id, newRoom);
      socket.leave(room);
      socket.join(newRoom);
    }
  );

  socket.on('disconnect', () => {
    console.log(`${socket.id} has disconnected`);
  });
};

export default StartListeners;
