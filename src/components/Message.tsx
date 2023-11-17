import React from 'react';
import cn from 'classnames';
import type { Message } from '../redux/slices/messageSlice';

interface MessageProps {
  message: Message;
}
export default function MessageComponent({
  message,
}: MessageProps): JSX.Element {
  const { text, time } = message;
  const { username } = message.author;
  return (
    <>
      <div
        className={cn('message', { 'bot-message': username === 'Chatterbug' })}>
        <span className="small font-italic">
          {username} at {time}
        </span>
        <br />
        <span>{text}</span>
      </div>
    </>
  );
}
