const users = [];

// Join user to chat
function userJoin(id, username, room) {
  const user = {id, username, room};
  console.log(user);
  users.push(user);
  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// User leaves chat
function userLeave(id) {
  console.log('all users', users);
  const index = users.findIndex((user) => user.id === id);
  // console.log(
  //   'user to go',
  //   users.findIndex((user) => user.id === id)
  // );
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  console.log(
    'room users',
    users.filter((user) => user.room === room)
  );
  return users.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
