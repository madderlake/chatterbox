import React from 'react';
import cn from 'classnames';

export default function Message({message}) {
  return (
    <>
      <div
        className={cn('message', {
          'bot-message': message.name === 'Chatterbug',
        })}>
        <span className="small font-italic">
          {message.name} at {message.time}
        </span>
        <br />
        <span>{message.text}</span>
      </div>
      {/* <hr /> */}
    </>
  );
}
