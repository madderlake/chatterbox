import React, { useContext, useState, useEffect } from "react";
import Header from "./Header";
import UserList from "./UserList";
import MessageList from "./MessageList";
import AddMessage from "./AddMessage";
import { ClientContext } from "../contexts/ClientContext";
import { titleCase } from "../utils/helpers";
import type { User, Message } from "../../../types";

export const ChatContainer = ({ ...props }) => {
  const client = useContext(ClientContext);
  const manager = client.io;
  const [currentUser, setCurrentUser] = useState<User>({
    ...props.history.location.state,
    messages: [],
  });
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [serverMessage, setServerMessage] = useState("");

  const togglePrivate = () => setIsPrivate(!isPrivate);
  if (currentUser.username === undefined)
    props.history.push({
      pathname: `/`,
      from: "chat",
    });
  const [userList, setUserList] = useState<User[]>([]);
  const [messageList, setMessageList] = useState<Message[]>([]);

  const roomName = titleCase(currentUser.room);

  const handleLogOut = () => {
    const confirmLogOut = window.confirm(`Are you sure you want to logOut?`);
    confirmLogOut && client.emit("logOut", { ...currentUser });
    manager.skipReconnection = true;
    client.disconnect();
    props.history.replace("/");
  };

  const handleSwitchRoom = (ev: React.SyntheticEvent) => {
    const newRoom = (ev.target as HTMLInputElement).value;
    const confirmSwitch = window.confirm(
      `Are you sure you want to switch to the ${newRoom} room, ${currentUser.username}?`
    );
    confirmSwitch && client.emit("switchRoom", { ...currentUser }, newRoom);
    setCurrentUser({ ...currentUser, room: newRoom });
    client.emit("joinRoom", { ...currentUser, room: newRoom }, true);
    props.history.push({
      pathname: `/${newRoom}/${currentUser.username}/${currentUser.id}`,
      state: { ...currentUser, room: newRoom },
    });
  };
  useEffect(() => {
    if (client.connected === false) setServerMessage("Waiting for server...");
  }, [client]);
  useEffect(() => {
    document.title = `Chatterbox - ${currentUser.username}`;
    client.on("updateUserSid", (sid: string) =>
      setCurrentUser({ ...currentUser, sid: sid })
    );

    client.emit("getRoomMessages", currentUser.room);
    client.emit("getRoomUsers", currentUser.room);

    client.on("connect", () => {
      setServerMessage("");
      client.emit("joinRoom", { ...currentUser });
    });

    client.on("roomUsers", (users: User[]) => setUserList(users));

    client.on("roomMessages", (messages: Message[]) =>
      setMessageList(messages)
    );

    client.on("serverMsg", (message: Message) =>
      setServerMessage(message.text)
    );

    return () => client.removeAllListeners();
  }, [client, currentUser]);

  return (
    <div className="container w-lg-80">
      <Header
        room={roomName}
        handleSwitch={handleSwitchRoom}
        handleLogOut={handleLogOut}
      />
      <div className="d-flex">
        <div className="sidebar col-lg-3 col-xs-1">
          <UserList
            userList={userList}
            updatePrivate={togglePrivate}
            privateMode={isPrivate}
            currentUser={currentUser}
          />
        </div>
        <div className="msg-wrapper position-relative w-100">
          <div className="msg-header position-absolute top-0 left-0 bg-white w-100 z-3 p-2">
            <h4 className="p-0 m-0">Chat Feed</h4>
            {serverMessage ? <div>⚡️ {serverMessage}</div> : null}
          </div>
          <div className="messages w-100 overflow-auto position-relative pt-0">
            <MessageList messageList={messageList} currentUser={currentUser} />
          </div>
        </div>
      </div>
      <div className="d-flex">
        <div className="add-message w-100">
          <AddMessage author={currentUser} />
        </div>
      </div>
    </div>
  );
};
