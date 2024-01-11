import React, { useEffect, useRef, useMemo } from 'react';
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

  const serverMessages = currentUser.messages?.find(
    (message) => (message.author.id = '0')
  );

  const allMessageList = useMemo((): Message[] => {
    return (
      (serverMessages !== undefined && messageList.concat(serverMessages)) || []
    );
  }, [serverMessages, messageList]);

  useEffect(() => {
    scrollToBottom();
  }, [allMessageList]);
  return (
    <>
      <h4>Chat Feed</h4>
      <div className="message-list">
        {allMessageList.length > 0 &&
          allMessageList.map((msg, index) => {
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
