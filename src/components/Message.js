import React from 'react';
import cn from 'classnames';

export default function Message({message}) {
  return (
    <>
      <div
        className={cn('message', {
          'bot-message': message.author.username === 'Chatterbug',
        })}>
        <span className="small font-italic">
          {message.author.username} at {message.time}
        </span>
        <br />
        <span>{message.text}</span>
      </div>
      {/* <hr /> */}
    </>
  );
}
