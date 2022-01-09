import React, {useEffect, useRef} from 'react';
import Message from './Message';

const MessageList = ({...props}) => {
  const messages = props.messageList;
  const divRef = useRef(null);

  useEffect(() => {
    divRef.current.scrollTop = divRef.current.scrollHeight;
  }, [props.messageList]);
  return (
    <>
      <h4>Chat Feed</h4>
      <div className="message-list" ref={divRef}>
        {messages &&
          messages.map((msg, index) => {
            return <Message message={msg} key={`msg-${index + 1}`} />;
          })}
      </div>
    </>
  );
};

export default MessageList;
