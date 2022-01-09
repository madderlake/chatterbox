const moment = require('moment');

const messages = [];

// Add message to chat
function captureMessage({author, text}) {
  const message = {author, text};
  //console.log(formatMessage(message));
  messages.push(message);
  //console.log('messages', messages);
  return message;
}

function formatMessage({author, text}) {
  const name = author.username;
  return {
    name,
    text,
    time: moment().format('h:mm a'),
  };
}

// Get room messages
function getRoomMessages(room) {
  const roomMessages = messages.filter((msg) => msg.author.room === room);
  return roomMessages.map((msg) => formatMessage(msg));
}

module.exports = {
  captureMessage,
  formatMessage,
  getRoomMessages,
};
