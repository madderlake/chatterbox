import React, {useEffect, useRef} from 'react';
import Message from './Message';

const MessageList = ({...props}) => {
  const messages = props.messageList;
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
        {messages &&
          messages.map((msg, index) => {
            return <Message message={msg} key={`msg-${index + 1}`} />;
          })}
        <div ref={msgsEndRef} />
      </div>
    </>
  );
};

export default MessageList;
