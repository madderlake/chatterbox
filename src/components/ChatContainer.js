import React, {useState, useContext} from 'react';
import UserList from './UserList';
import MessageList from './MessageList';
import AddMessage from './AddMessage';
import {SocketContext} from '../context/socket';

const ChatContainer = ({...props}) => {
  const urlParams = props.location.state;
  const {username, room, id} = urlParams;
  const socket = useContext(SocketContext);

  /* State */
  const [userList, setUserList] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    username,
    room,
    id,
  });
  //console.log(currentUser);
  const handleUserLeave = () => {
    socket.emit('userLeaving', {
      id: id,
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
    // socket.emit('getMessages', {
    //   room: room,
    // });
    socket.emit('readyForUsers', {
      room: room,
    });
    socket.on('roomUsers', ({users}) => {
      setUserList(users);
    });
    socket.emit('readyForMessages', {
      room: room,
    });
    socket.on('roomMessages', ({messages}) => {
      setMessageList(messages);
    });
    socket.on('botMessage', ({messages}) => {
      setMessageList(messages);
    });
    socket.on('disconnect', () => {
      setCurrentUser({});
    });
    // CLEAN UP
    return () => socket.disconnect();
  }, [room, socket, currentUser, setUserList, setMessageList]);

  return (
    <div className="container">
      <div className="row">
        <div className="header">
          <div className="col-6">
            <h4 className="m-0 p-0 text-nowrap">
              The {room} Room
              <span className="small"> @Chatterbox</span>
            </h4>
          </div>
          <div className="col-6 d-flex justify-content-end">
            <button className="btn btn-secondary" onClick={handleUserLeave}>
              Leave Room
            </button>
          </div>
        </div>
        <div className="sidebar col-4">
          <UserList userList={userList} currentUser={currentUser} />
        </div>
        <div className="messages col-8 overflow-auto">
          <MessageList messageList={messageList} />
        </div>
      </div>
      <div className="add-message row">
        <AddMessage author={currentUser} />
      </div>
    </div>
  );
};

export default ChatContainer;
