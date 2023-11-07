import React, { useEffect, useRef, useMemo } from 'react';
import Message from './Message';

const MessageList = ({ ...props }) => {
  const messages = useMemo(() => props.messageList || [], [props]);
  const msgsEndRef = useRef(null);
  const scrollToBottom = () => {
    return (
      msgsEndRef.current &&
      msgsEndRef.current.scrollIntoView({
        behavior: 'smooth',
      })
    );
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <>
      <h4>Chat Feed</h4>
      <div className="message-list">
        {messages.length > 0 &&
          messages.map((msg, index) => {
            return <Message message={msg} key={`msg-${index + 1}`} />;
          })}
        <div ref={msgsEndRef} />
      </div>
    </>
  );
};

export default MessageList;
