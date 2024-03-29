import type { User, Message, Author } from "../../types";
import * as users from "./functions/users";
import * as msgs from "./functions/messages";
import { titleCase } from "../client/utils/helpers";

const StartListeners = (server: any, socket: any): void => {
  console.log(`${socket.id} connected from listeners `);

  const connectedClients = server.sockets.sockets;

  const refreshRoom = (room: string) => {
    server.to(room).emit("roomUsers", users.getRoomUsers(room));
    server.to(room).emit("roomMessages", msgs.getRoomMessages(room));
  };
  socket.on("getRoomMessages", (room: string) => {
    server.to(room).emit("roomMessages", msgs.getRoomMessages(room));
  });
  socket.on("getRoomUsers", (room: string) => {
    server.to(room).emit("roomUsers", users.getRoomUsers(room));
  });
  socket.on("joinRoom", ({ ...user }) => {
    const { id, username, room } = user;
    socket.join(room);
    const newUser = users.getUser(id) === undefined;

    if (newUser) {
      user.sid = socket.id;
      users.addUser({ ...user } as User);
      msgs.addChatBotMsg(
        room,
        `🤗 Welcome to the ${titleCase(room)} room, ${username}! `
      );
      refreshRoom(room);
      server.to(room).emit("updateUserSid", user.sid);
    } else {
      users.updateUserSid(id, socket.id);
      user.sid = socket.id;
      const serverMsg = {
        text: `${username} reconnected!`,
        author: msgs.chatBot,
      };
      server.to(socket.id).emit("serverMsg", { ...serverMsg });
    }
    refreshRoom(room);
  });

  socket.on("chatMessage", async (msg: Message) => {
    const { author, text, room } = msg;
    msgs.captureMessage({ author, text, room });
    room !== undefined && refreshRoom(room);
  });

  socket.on("typing", (data: Author) => {
    users.addTypingUser(data.username);
    const typingArr = Array.from(users.getTypingUsers());
    server.to(data.room).emit("showTyping", typingArr);
  });

  socket.on("typingEnd", (data: Author) => {
    users.removeTypingUser(data.username);
    const typingArr = Array.from(users.getTypingUsers());
    server.to(data.room).emit("stillTyping", typingArr);
  });

  socket.on("leaveRoom", ({ id, username, room }: User) => {
    msgs.addChatBotMsg(room, `😥 ${username} has left the room `);
    users.removeTypingUser(username);
    socket.leave(room);
    users.removeUser(id);
    room !== undefined && refreshRoom(room);
  });

  socket.on("logOut", ({ id, username, room, sid }: User) => {
    msgs.addChatBotMsg(room, `😥 ${username} has logged off `);
    users.removeTypingUser(username);
    socket.leave(room);
    connectedClients.forEach((socket: any) => {
      if (socket.id === sid) socket.disconnect(true);
    });

    users.removeUser(id);
    room !== undefined && refreshRoom(room);
  });

  socket.on("switchRoom", ({ ...user }, newRoom: string) => {
    const { id, username, room } = user;
    msgs.addChatBotMsg(room, `😥 ${username} has switched rooms `);
    users.switchUserRoom(id, newRoom);
    socket.leave(room);
    socket.join(newRoom);
    room !== undefined && refreshRoom(room);
    room !== undefined && refreshRoom(newRoom);
  });

  socket.on("disconnect", (reason: string) => {
    console.log(`${socket.id} has disconnected - ${reason}`);
  });
};

export default StartListeners;
