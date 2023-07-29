const messages = [];

// Add message to chat
function captureMessage({author, text, room}) {
  const message = {author, text, room};
  const hrs = new Date().getHours();
  let hours = hrs % 12;
  hours = hours ? hours : 12;
  const ampm = hrs > 12 ? 'pm' : 'am';
  const mins = new Date().getMinutes();
  const minutes = mins >= 10 ? mins : '0' + mins;
  message.time = hours + ':' + minutes + ampm;
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
  return messages.filter((msg) => msg.room === room);
}

module.exports = {
  captureMessage,
  formatMessage,
  getRoomMessages,
};
