import React from 'react';
import cn from 'classnames';
import type { Message, User } from '../../../types';

interface MessageProps {
  message: Message;
  currentUser: User;
}
export default function MessageComponent({
  message,
  currentUser,
}: MessageProps): JSX.Element {
  const { text, time } = message;
  const { username } = message.author;
  return (
    <>
      <div
        className={cn('message', { 'bot-message': username === 'Chatterbug' })}>
        <span className="small font-italic">
          {username === currentUser.username ? 'You' : username} at {time}
        </span>
        <br />
        <span>{text}</span>
      </div>
    </>
  );
}
