import React, { useEffect, useRef, useMemo } from "react";
import MessageComponent from "./Message";

import type { Message, User } from "../../../types";

interface MessageListProps {
  messageList: Message[];
  currentUser: User;
  serverMessage: Message["text"];
}
const MessageList = ({
  messageList,
  currentUser,
  serverMessage,
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
      //if (a.time === undefined || b.time === undefined) return;
      const aTime = a.time !== undefined && Date.parse(a.time);
      const bTime = b.time !== undefined && Date.parse(b.time);
      return Number(aTime) - Number(bTime);
    });
  }, [messageList]);

  // console.log(allMessageList);
  useEffect(() => {
    scrollToBottom();
  }, [allMessageList]);
  return (
    <>
      <h4>Chat Feed</h4>
      {serverMessage ? (
        <div
          style={{
            padding: ".25rem",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {serverMessage}
        </div>
      ) : null}

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
