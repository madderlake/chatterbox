import React, { useContext, useState, useEffect } from 'react';
// import { useAppDispatch, useAppSelector } from '../redux/hooks';
import UserList from './UserList';
import MessageList from './MessageList';
import AddMessage from './AddMessage';
import { ClientContext } from '../contexts/ClientContext';
import { titleCase } from '../utils/helpers';
// import {
//   //join,
//   leave,
//   //switchRoom,
//   getUserList,
//   getRoomUserList,
// } from '../redux/slices/userSlice';
// import { addMessages } from '../redux/slices/messageSlice';

import { rooms } from './room-list';
/* TODO - move these out of redux **/
import type { Author, Message } from '../redux/slices/messageSlice';
import type { User } from '../redux/slices/userSlice';

export const ChatContainer = ({ ...props }) => {
  const client = useContext(ClientContext);

  const [currentUser, setCurrentUser] = useState<User>({
    ...props.history.location.state,
    sid: '',
  });

  //client.id && setCurrentUser({ ...currentUser, sid: client.id });
  // const cUser = currentUser;
  // const uList = useAppSelector((state) => state.user.userList);
  // const mList = useAppSelector((state) => state.messages.messageList);

  const [userList, setUserList] = useState<User[]>([]);
  const [messageList, setMessageList] = useState<Message[]>([]);

  const roomName = titleCase(currentUser.room);

  const handleUserLeaveApp = () => {
    const leaveRoom = window.confirm(
      `Are you sure you want to leave the ${roomName} chatroom?`
    );
    leaveRoom && client.emit('leave room', { ...currentUser }, false);
    client.disconnect();
    props.history.replace('/');
  };

  const handleUserSwitchRoom = (ev: React.SyntheticEvent) => {
    const newRoom = (ev.target as HTMLInputElement).value;
    if (
      window.confirm(`Are you sure you want to switch to the ${newRoom} room?`)
    ) {
      client.emit('switch room', { ...currentUser }, newRoom);
      setCurrentUser({ ...currentUser, room: newRoom });
      client.emit('joinRoom', { ...currentUser, room: newRoom }, true);
      props.history.push(
        `/${newRoom}/${currentUser.username}/${currentUser.id}`
      );
    }
  };

  useEffect(() => {
    document.title = `Chatterbox - ${
      currentUser.username !== undefined && currentUser.username
    }`;
    /* If this is a user that is simply reconnecting, refreshing etc */
    client.on('connect', () => {
      if (client.id !== currentUser.sid)
        client.emit('joinRoom', { ...currentUser }, false);
      setCurrentUser({ ...currentUser, sid: client.id });
    });
  }, [client, currentUser]);

  useEffect(() => {
    client.on('roomUsers', (users: User[]) => setUserList(users));
    client.on('roomMessages', (messages: Message[]) =>
      setMessageList(messages)
    );

    // client.on('server disconnected', () => {
    //   console.log('server disconnected');
    //   const serverDisconnect = window.confirm('server disconnected');
    //   if (serverDisconnect) props.history.replace('/');
    // });
    // CLEAN UP
    return () => client.removeAllListeners();
  }, [userList, messageList, client]);

  return (
    <div className="container w-lg-80">
      <div className="header d-flex justify-content-between">
        <h4 className="text-no-wrap">
          The {`${roomName}`} Room
          <span className="d-block small">
            <small>@Chatterbox</small>
          </span>
        </h4>

        <div className="d-inline-flex text-end flex-column-reverse">
          <select
            required
            className="btn btn-secondary btn-sm"
            style={{
              appearance: 'none',
            }}
            name="switch-room"
            id="switch-room"
            onChange={handleUserSwitchRoom}>
            <option value="">Switch Rooms</option>
            {rooms.map(({ key, name }, i) => (
              <option value={key} key={i}>
                {name}
              </option>
            ))}
          </select>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleUserLeaveApp}
            style={{ marginBottom: 8 }}>
            Log Out &raquo;
          </button>
        </div>
      </div>
      <div className="d-flex">
        <div className="sidebar col-lg-3 col-xs-1">
          <UserList userList={userList} currentUser={currentUser} />
        </div>
        <div className="messages w-100 overflow-auto">
          <MessageList messageList={messageList} />
        </div>
      </div>
      <div className="d-flex">
        <div className="add-message w-100">
          <AddMessage author={currentUser as Author} />
        </div>
      </div>
    </div>
  );
};
