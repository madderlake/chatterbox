import React, {useState, useContext} from 'react';
import UserList from './UserList';
import MessageList from './MessageList';
import AddMessage from './AddMessage';
import {SocketContext} from '../context/socket';

const ChatContainer = ({...props}) => {
  const socket = useContext(SocketContext);

  const [userList, setUserList] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const {username, room, id} = props.match.params;

  const [currentUser, setCurrentUser] = useState({
    username,
    room,
    id,
  });

  const handleUserLeave = () => {
    socket.emit('userLeaving', {
      id: currentUser.id,
    });
    const leaveRoom = window.confirm(
      'Are you sure you want to leave the chatroom?'
    );
    if (leaveRoom) {
      socket.disconnect();
      props.history.replace('/');
    }
  };

  React.useEffect(() => {
    console.log(`client connected - ${socket.id}`);

    socket.emit('readyForUsers', {
      room: room,
    });
    socket.on('roomUsers', ({room, users}) => {
      setUserList(users);
    });
    socket.on('roomMessages', ({room, messages}) => {
      setMessageList(messages);
    });
    // socket.on('message', ({room, messages}) => {
    //   setMessageList(messages);
    // });
    socket.on('disconnect', () => {
      setCurrentUser({});
    });
    // CLEAN UP
    return () => socket.disconnect();
  }, [setUserList]);

  return (
    <div className="container">
      <div className="row">
        <div className="header">
          <div className="col-8">
            <h3>{room} on Chatterbox</h3>
          </div>
          <div className="col-4 d-flex justify-content-end">
            <button className="btn btn-secondary" onClick={handleUserLeave}>
              Leave Room
            </button>
          </div>
        </div>
        <div className="sidebar col-4">
          <UserList userList={userList} />
        </div>
        <div className="messages col-8">
          <MessageList messageList={messageList} socket={socket} />
        </div>
      </div>
      <div className="add-message row">
        <AddMessage author={currentUser} socket={socket} />
      </div>
    </div>
  );
};

export default ChatContainer;
