import type {User} from '../redux/slices/userSlice';

const users: User[] = [];

// Join user to chat
export const addUser = (user: User) => {
  users.push(user);
};

export const switchUserRoom = (id: string, newRoom: string) => {
  return users
    .filter((user) => user.id === id)
    .map((user) => user.room === newRoom);
};

export const getAllUsers = () => {
  return users;
};
// Get current user
export const getUser = (id: string) => {
  return users.find((user) => user.id === id);
};

// User leaves chat altogether
export const removeUser = (id: string): User[] => {
  const index = users.findIndex((user) => user.id === id);
  return index !== -1 ? users.splice(index, 1) : users;
};

// Get room users
export const getRoomUsers = (room: string) => {
  return users.filter((user) => user.room === room);
};
