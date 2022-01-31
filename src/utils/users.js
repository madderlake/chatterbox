const users = [];

// Join user to chat
function addUser({id, username, room}) {
  const user = {id, username, room};
  users.push(user);
  return user;
}

function updateUser({id, prop, value}) {
  const user = users.find((user) => user.id === id);
  console.log('updating', prop, 'to', value, 'on', user.username);
  user[prop] = value;
  console.log('updated user', user);
  return user;
}
// Get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    users.splice(index, 1);
    console.log('users remaining:', users);
    return users;
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  addUser,
  updateUser,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
