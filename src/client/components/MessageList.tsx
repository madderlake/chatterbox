import React, { useEffect, useRef, useMemo } from "react";
import MessageComponent from "./Message";

import type { Message, User } from "../../../types";

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
        behavior: "smooth",
      })
    );
  };

  const allMessageList = useMemo((): Message[] => {
    return [...messageList].sort((a: Message, b: Message) => {
      const aTime = a.time !== undefined && Date.parse(a.time);
      const bTime = b.time !== undefined && Date.parse(b.time);
      return Number(aTime) - Number(bTime);
    });
  }, [messageList]);

  useEffect(() => {
    scrollToBottom();
  }, [allMessageList]);
  return (
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
  );
};

export default MessageList;
