import type { Message } from '../../../types';
import { users } from './users';
const messages: Message[] = [];
console.log(messages);
// Set time
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
export const captureMessage = ({ ...message }: Message): Message => {
  message.time = setTime();
  messages.push(message);
  return message;
};

// Send message from ChatBot
export const chatBot = { username: 'Chatterbug', id: '0', room: '' };

export const privateServerMessage = (id: string, { ...message }: Message) => {
  const recipient = users.find((user) => user.id === id);
  console.log('recipient', recipient);
  // const message = captureMessage({ text, author });
  message.time = setTime();
  recipient?.messages?.push({ ...message });
  console.log('recipient', recipient);
  return message;
};

export const addChatBotMsg = (room: string, text: string) => {
  return captureMessage({
    author: chatBot,
    text,
    room,
  });
};

// export const addServerMsg = (to: string, text: string) => {
//   return captureMessage({ author: chatBot, text });
// };

// Get room messages
export const getRoomMessages = (room: string) =>
  messages.filter((msg) => msg.room === room);
