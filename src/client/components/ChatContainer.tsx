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
  const [serverMessage, setServerMessages] = useState("");

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

  const newUser =
    // currentUser.sid !== undefined && currentUser.sid !== client.id;
    currentUser.sid === undefined;

  useEffect(() => {
    document.title = `Chatterbox - ${currentUser.username}`;
    // if (newUser) setCurrentUser({ ...currentUser, sid: client.id });
    client.on("updateUserSid", (sid: string) => {
      console.log(sid);
      setCurrentUser({ ...currentUser, sid: client.id });
    });
    client.on("connect", () => {
      client.emit("joinRoom", { ...currentUser });
      console.log(newUser);

      // client.on("privateServerMsg", (to: string, { ...message }: Message) => {
      //   const messages = currentUser.messages || [];
      //   if (to === currentUser.id)
      //     setCurrentUser({
      //       ...currentUser,
      //       messages: [...messages, { ...message }],
      //     });
    });

    return () => client.removeAllListeners();
    // });
  }, [newUser, client, currentUser]);

  useEffect(() => {
    client.on("roomUsers", (users: User[]) => {
      setUserList(users);
    });

    client.on("roomMessages", (messages: Message[]) =>
      setMessageList(messages)
    );

    client.on("serverMsg", (message: Message) => {
      console.log("server msg:", message);
      setServerMessages(message.text);
    });

    return () => client.removeAllListeners();
  }, [client, userList, messageList]);

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
        <div className="messages w-100 overflow-auto">
          <MessageList
            messageList={messageList}
            currentUser={currentUser}
            serverMessage={serverMessage}
          />
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
