const moment = require('moment');

const messages = [];

// Add message to chat
function captureMessage({author, text}) {
  const message = {author, text};
  message.time = moment().format('h:mm a');
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
  return messages.filter((msg) => msg.author.room === room);
}

module.exports = {
  captureMessage,
  formatMessage,
  getRoomMessages,
};
