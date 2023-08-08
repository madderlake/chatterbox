import type {Message} from '../redux/slices/messageSlice';

const messages: Message[] = [];

// Time utility
const setTime = (): string => {
  const hrs = new Date().getHours();
  const mins = new Date().getMinutes();
  let hours = hrs % 12;
  hours = hours ? hours : 12;
  const ampm = hrs > 12 ? 'pm' : 'am';
  const minutes = mins >= 10 ? mins : '0' + mins;
  return hours + ':' + minutes + ampm;
};

// Add message to chat
export const captureMessage = ({...message}: Message): Message => {
  message.time = setTime();
  messages.push(message);
  return message;
};

// Send message from ChatBot
export const sendChatBotMsg = (room: string, text: string) => {
  const chatBot = {username: 'Chatterbug', id: '0', room: ''};
  return captureMessage({
    author: chatBot,
    text,
    room,
    time: setTime(),
  });
};

// Get room messages
export const getRoomMessages = (room: string) => {
  return messages.filter((msg) => msg.room === room);
};
