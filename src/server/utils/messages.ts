import type { Message } from '../../../types';
import { users } from './users';
const messages: Message[] = [];

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

// Add message to chat or to user messages
export const captureMessage = (
  { ...message }: Message,
  id?: string
): Message => {
  message.time = setTime();
  if (!id) {
    messages.push(message);
  } else {
    const foundUser = users.find((user) => user.id === id);
    foundUser?.messages?.push(message);
  }
  return message;
};

// Send message from ChatBot
export const chatBot = { username: 'Chatterbug', id: '0', room: '' };

export const privateChatBotMsg = (id: string, { ...message }: Message) => {
  return captureMessage({ ...message }, id);
};

export const addChatBotMsg = (room: string, text: string) => {
  return captureMessage({ author: chatBot, room, text });
};

// Get room messages
export const getRoomMessages = (room: string) =>
  messages.filter((msg) => msg.room === room);
