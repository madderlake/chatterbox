import type {User} from '../redux/slices/userSlice';

const users: User[] = [];
const typingUsers: string[] = [];
// Join user to chat
export const addUser = (user: User) => {
  users.push(user);
};

export const addTypingUser = (name: string) => typingUsers.push(name);
export const removeTypingUser = (name: string) => {
  typingUsers.map((_) => typingUsers.splice(typingUsers.indexOf(name), 1));
  return getTypingUsers();
};
export const getTypingUsers = () => {
  return typingUsers;
};
export const updateUserSid = (id: string, sid: string) => {
  const user = users.find((user) => user.id === id);
  if (user !== undefined) user.sid = sid;
  return user;
};

export const switchUserRoom = (id: string, newRoom: string) =>
  users.filter((user) => user.id === id).map((user) => user.room === newRoom);

export const getAllUsers = () => users;

// Get current user
export const getUser = (id: string) => users.find((user) => user.id === id);

// User leaves chat altogether
export const removeUser = (id: string): User[] => {
  const index = users.findIndex((user) => user.id === id);
  return index !== -1 ? users.splice(index, 1) : users;
};

// Get room users
export const getRoomUsers = (room: string) => {
  return users.filter((user) => user.room === room);
};
