const messages = [];

// Add message to chat
function captureMessage({author, text, room}) {
  const message = {author, text, room};
  message.time = new Date().getHours() + ':' + new Date().getMinutes();
  messages.push(message);
  return message;
}

function formatMessage({author, text}) {
  const name = author.username;
  return {
    name,
    text,
    time,
  };
}

// Get room messages
function getRoomMessages(room) {
  // console.log(
  //   'room msgs',
  //   messages.filter((msg) => msg.room === room)
  // );
  return messages.filter((msg) => msg.room === room);
}

module.exports = {
  captureMessage,
  formatMessage,
  getRoomMessages,
};
