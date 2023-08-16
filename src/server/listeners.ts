import type {User} from '../redux/slices/userSlice';
import type {Message, Author} from '../redux/slices/messageSlice';
import * as users from './users';
import * as msgs from './messages';

const StartListeners = (server: any, socket: any): void => {
  console.log(`${socket.id} connected from listeners `);
  // TODO; make const for allUsers
  socket.on('joinRoom', ({...user}, newUser: null | boolean) => {
    const {id, username, room} = user;
    user.sid = socket.id;
    socket.join(room);

    // Welcome current user
    if (newUser !== false) {
      msgs.sendChatBotMsg(
        room,
        `🤗 Welcome to the ${room} room, ${username}! `
      );
      users.getUser(id) === undefined &&
        users.addUser({id, username, room, sid: socket.id});
    } else {
      users.updateUserSid(id, socket.id);
    }
    // Send users and messages back to room
    server.to(room).emit('roomUsers', users.getRoomUsers(room));
    server.to(room).emit('roomMessages', msgs.getRoomMessages(room));
  });

  socket.on('chatMessage', ({author, text, room}: Message) => {
    msgs.captureMessage({author, text, room});
    server.to(room).emit('roomMessages', msgs.getRoomMessages(room));
  });
  //console.log(users.getAllUsers());

  socket.on('typing', (data: Author) => {
    users.addTypingUser(data.username);
    const typingArr = Array.from(users.getTypingUsers());
    server.to(data.room).emit('showTyping', typingArr);
  });

  socket.on('notTyping', (data: Author) => {
    users.removeTypingUser(data.username);
    const typingArr = Array.from(users.getTypingUsers());
    server.to(data.room).emit('stillTyping', typingArr);
  });
  // Runs when server leaves the chat application
  socket.on('userLeaving', ({id, username, room}: User) => {
    msgs.sendChatBotMsg(room as string, `😥 ${username} has left the room `);
    socket.leave(room as string);
    users.removeUser(id);
    //console.log('all users', users.getAllUsers());
  });

  socket.on(
    'userSwitching',
    (id: string, username: string, room: string, newRoom: string) => {
      msgs.sendChatBotMsg(room, `😥 ${username} has switched rooms `);
      users.switchUserRoom(id, newRoom);
      socket.leave(room);
    }
  );
  socket.on('disconnect', () => {
    console.log(`${socket.id} has disconnected`);
    const user = users.getAllUsers().find((user) => user.sid === socket.id);
    if (user !== undefined) {
      const {id, username, room} = user;
      users.removeUser(id);
      users.removeTypingUser(username);
      server.to(room).emit('roomUsers', users.getAllUsers());
      msgs.sendChatBotMsg(room, `😥 ${username} has logged off `);
      server.to(room).emit('roomMessages', msgs.getRoomMessages(room));
    }
  });
};

export default StartListeners;
