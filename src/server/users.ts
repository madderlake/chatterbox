import type {User} from '../redux/slices/userSlice';

const users: User[] = [];

// Join user to chat
export const addUser = (user: User) => {
  users.push(user);
  //return user;
};

export const switchUserRoom = (id: string, newRoom: string) => {
  return users
    .filter((user) => user.id === id)
    .map((user) => user.room === newRoom);
};

// const updateUser({id, prop, value}) {
//   const user = users.find((user) => user.id === id);
//   console.log('updating', prop, 'to', value, 'on', user.username);
//   user[prop] = value;
//   console.log('updated user', user);
//   return user;
// }
export const getAllUsers = () => {
  return users;
};
// Get current user
export const getCurrentUser = (id: string) => {
  return users.find((user) => user.id === id);
};

// User leaves chat altogether
export const removeUser = (id: string) => {
  const index = users.findIndex((user) => user.id === id);

  index !== -1 && users.splice(index, 1);
  console.log('users remaining:', users);
  // return users;
};

// Get room users
export const getRoomUsers = (room: string) => {
  return users.filter((user) => user.room === room);
};

// module.exports = {
//   addUser,
//   getAllUsers,
//   //updateUser,
//   sendChatBotMsg,
//   switchUserRoom,
//   getCurrentUser,
//   userLeave,
//   getRoomUsers,
// };
