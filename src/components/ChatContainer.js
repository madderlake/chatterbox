import React, {useState, useContext} from 'react';
import UserList from './UserList';
import MessageList from './MessageList';
import AddMessage from './AddMessage';
import {SocketContext} from '../contexts/socket';
import {titleCase} from '../utils/helpers';

const ChatContainer = ({...props}) => {
  //const urlParams = props.location.state && props.location.state;
  const {username, room, id} = props.location.state ? props.location.state : {};
  const emptyRoom = !props.location.state && props.match.params.room;
  const socket = useContext(SocketContext);
  //console.log(socket);
  /* State */
  const [userList, setUserList] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    username,
    room,
    id,
  });
  const roomName = titleCase(currentUser.room);
  const handleUserLeave = () => {
    const leaveRoom = window.confirm(
      `Are you sure you want to leave the ${roomName} chatroom?`
    );
    if (leaveRoom) {
      socket.emit('userLeaving', {
        id: id,
      });
      socket.disconnect();
      props.history.replace('/');
    }
  };

  // const handleUserSwitch = (ev) => {
  //   console.log('user switching');
  //   const leaveRoom = window.confirm('Are you sure you want to switch rooms?');
  //   if (leaveRoom) {
  //     //socket.disconnect();
  //     socket.emit('userLeaving', {
  //       id: currentUser.id,
  //     });
  //     socket.emit('joinRoom', {
  //       username: currentUser.username,
  //       room: ev.target.value,
  //       id: currentUser.id,
  //     });
  //     socket.on('roomUsers', ({users}) => {
  //       setUserList(users);
  //     });
  //     console.log({...currentUser});
  //     //props.history.push(`${currentUser.room}/${currentUser.username}/`);
  //     props.history.push({
  //       pathname: `/${ev.target.value}`,
  //       from: 'chat',
  //       state: {
  //         username: currentUser.username,
  //         room: ev.target.value,
  //         id: currentUser.id,
  //       },
  //     });
  //   }
  // };
  React.useEffect(() => {
    console.log(`client connected - ${socket.id} to ${room}`);
    socket.on('roomUsers', ({users}) => {
      //console.log({...currentUser});
      setCurrentUser(currentUser);
      //console.log(users);
      setUserList(users);
    });

    socket.on('roomMessages', ({messages}) => {
      setMessageList(messages);
    });
    socket.on('disconnect', () => {
      console.log('disconnecting...');
      setCurrentUser({});
    });
    // CLEAN UP
    // return () => socket.disconnect();
  }, [room, socket, setCurrentUser, setUserList, setMessageList]);

  return (
    <div className="container">
      <div className="row">
        <div className="header">
          <div className="col-8">
            <h4 className="m-0 p-0 text-nowrap">
              The {`${roomName}` || emptyRoom} Room
              <span className="small"> @Chatterbox</span>
            </h4>
          </div>
          {/* <div className="col-2 d-flex justify-content-end">
            <select
              required
              className="btn btn-secondary"
              style={{
                appearance: 'none',
              }}
              name="room"
              id="room"
              onChange={handleUserSwitch}>
              <option value="">Switch Rooms</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="PHP">PHP</option>
              <option value="C#">C#</option>
              <option value="Ruby">Ruby</option>
              <option value="Java">Java</option>
            </select>
          </div> */}
          <div className="col-2 d-flex justify-content-end">
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
