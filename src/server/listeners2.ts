import type { User } from '../redux/slices/userSlice';
import type { Message, Author } from '../redux/slices/messageSlice';
import * as users from './users';
import * as msgs from './messages';
import { titleCase } from '../utils/helpers';

type newUser = null | boolean;

const welcomeUser = (user: User, newUser: newUser, socket: any) => {
  const { username, room, id } = user;
  if (newUser !== false) {
    msgs.sendChatBotMsg(
      user.room,
      `🤗 Welcome to the ${titleCase(user.room)} room, ${user.username}! `
    );
    users.getUser(id) === undefined &&
      users.addUser({ id, username, room, sid: socket.id });
  } else {
    users.updateUserSid(id, socket.id);
  }
};
const userJoinsRoom = (socket: any, user: User) => {
  const { room } = user;
  user.sid = socket.id;
  socket.join(room);
};

const StartListeners = (server: any, socket: any): void => {
  console.log(`${socket.id} connected from listeners2 `);
  //  receive messages from client and call functions
  socket.on('joinRoom', ({ ...user }: User, newUser: null | boolean) => {
    const { room } = user;
    userJoinsRoom(socket, user);
    welcomeUser(user, newUser, socket);
    server.to(room).emit('roomUsers', users.getRoomUsers(room));
    server.to(room).emit('roomMessages', msgs.getRoomMessages(room));
  });

  socket.on('chatMessage', ({ author, text, room }: Message) => {
    console.log('got msg!');
    msgs.captureMessage({ author, text, room });
    server.to(room).emit('roomMessages', msgs.getRoomMessages(room));
  });

  socket.on('typing', (data: Author) => {
    users.addTypingUser(data.username);
    const typingArr = Array.from(users.getTypingUsers());
    server.to(data.room).emit('showTyping', typingArr);
  });

  socket.on('endTyping', (data: Author) => {
    users.removeTypingUser(data.username);
    const typingArr = Array.from(users.getTypingUsers());
    server.to(data.room).emit('stillTyping', typingArr);
  });

  // Runs when server leaves the chat application
  socket.on('userLeaving', ({ id, username, room }: User) => {
    msgs.sendChatBotMsg(room, `😥 ${username} has left the room `);
    users.removeTypingUser(username);
    socket.leave(room);
    users.removeUser(id);
  });

  /* scenarios -
    -- new user - from form
    -- re-connected user after server disconnect (aka restart server)
    -- re-connect after page refresh

  // new user


  // re-connected after page refresh - still have users in SS


  // re-connected after server restart








 // on disconnect
    /*  scenarios -
     -- refresh page
     -- client logs off
     -- all users off
     -- **/
};

export default StartListeners;
