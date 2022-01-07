import React from 'react';
import Message from './Message';

const MessageList = ({...props}) => {
  const messages = props.messageList;
  console.log(messages);

  return (
    <>
      <h4>Chat Feed</h4>
      <div className="message-list">
        {messages.map((msg, index) => {
          return <Message message={msg} key={`msg-${index + 1}`} />;
        })}
      </div>
    </>
  );
};

export default MessageList;
