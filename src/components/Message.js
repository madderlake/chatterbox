import React from 'react';

export default function Message({message}) {
  return (
    <div className="message">
      <p>
        <span>
          {message.name} at {message.time}
        </span>
        <br />
        {message.text}
      </p>
    </div>
  );
}
