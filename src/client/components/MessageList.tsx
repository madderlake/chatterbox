import React, { useEffect, useRef } from 'react';
import MessageComponent from './Message';

import type { Message, User } from '../../../types';

interface MessageListProps {
  messageList: Message[];
  currentUser: User;
}
const MessageList = ({
  messageList,
  currentUser,
}: MessageListProps): JSX.Element => {
  const msgsEndRef = useRef<HTMLDivElement>(null);
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
  }, [messageList]);
  return (
    <>
      <h4>Chat Feed</h4>
      <div className="message-list">
        {messageList.length > 0 &&
          messageList.map((msg, index) => {
            return (
              <MessageComponent
                message={msg}
                currentUser={currentUser}
                key={`msg-${index + 1}`}
              />
            );
          })}
        <div ref={msgsEndRef} />
      </div>
    </>
  );
};

export default MessageList;
