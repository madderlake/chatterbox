import type { User } from "../../../types";

// Init
export const users: User[] = [];
const typingUsers = new Set();
// Add user
//export const addUser = (user: User) => user.sid !== "" && users.push(user);
export const addUser = (user: User) => users.push(user);
// Update user sid

// User switch room
export const switchUserRoom = (id: string, newRoom: string) =>
  users.filter((user) => user.id === id).map((user) => (user.room = newRoom));

// get all users
export const getAllUsers = () => users;

// Get current user
export const getUser = (id: string) => users.find((user) => user.id === id);

export const updateUserSid = (id: string, sid: string) => {
  const user = getUser(id) as User;
  user.sid = sid;
};

// Remove user
export const removeUser = (id: User["id"]): User[] => {
  const index = users.findIndex((user) => user.id === id);
  users.splice(index, 1);
  return users;
};

// Get room users
export const getRoomUsers = (room: string) =>
  users.filter((user) => user.room === room);

// Typing
export const addTypingUser = (name: string) => typingUsers.add(name);
export const removeTypingUser = (name: string) => typingUsers.delete(name);
export const getTypingUsers = () => typingUsers;
