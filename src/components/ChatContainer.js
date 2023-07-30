import React, {useContext, useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import UserList from './UserList';
import MessageList from './MessageList';
import AddMessage from './AddMessage';
import {SocketContext} from '../contexts/SocketContext';
import {titleCase} from '../utils/helpers';
import {join, leave, switchRoom, addUsers} from '../redux/slices/userSlice';
import {getMessages} from '../redux/slices/messageSlice';
import {useParams} from 'react-router-dom';

const ChatContainer = ({...props}) => {
  const emptyRoom = !props.location.state && props.match.params.room;
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const params = useParams();
  const [currentUser, setCurrentUser] = useState({
    ...params,
  });
  /* TODO - change these const names */
  const cUser = useSelector((state) => state.user.currentUser);
  const uList = useSelector((state) => state.user.userList);
  const mList = useSelector((state) => state.messages.messageList);

  const roomName = titleCase(currentUser.room);
  const firstJoin = cUser.username !== currentUser.username;

  const handleUserLeave = () => {
    const leaveRoom = window.confirm(
      `Are you sure you want to leave the ${roomName} chatroom?`
    );
    if (leaveRoom) {
      socket.emit('userLeaving', {...currentUser}, true);
      dispatch(leave(currentUser.id));
      socket.disconnect();
      props.history.replace('/');
    }
  };

  const handleUserSwitch = (ev) => {
    if (window.confirm('Are you sure you want to switch rooms?')) {
      const newRoom = ev.target.value;
      socket.emit('userSwitching', {...currentUser}, newRoom);
      setCurrentUser({...currentUser, room: newRoom});
      dispatch(switchRoom(newRoom));

      socket.emit(
        'joinRoom',
        {
          username: currentUser.username,
          room: newRoom,
          id: currentUser.id,
        },
        null
      );

      props.history.push(
        `/${newRoom}/${currentUser.username}/${currentUser.id}`
      );
    }
  };

  useEffect(() => {
    socket.on('connect', async () => {
      if (firstJoin) {
        dispatch(join({...currentUser}));
      } else {
        socket.emit('joinRoom', {...currentUser}, firstJoin);
      }
    });
    socket.on('roomUsers', (users) => {
      dispatch(addUsers(users));
    });

    socket.on('roomMessages', (messages) => {
      dispatch(getMessages(messages));
    });

    // CLEAN UP
    return () => socket.removeAllListeners();
  }, [firstJoin, socket, currentUser, dispatch]);

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
          <div className="col-2 d-flex justify-content-end">
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
              <option value="javaScript">JavaScript</option>
              <option value="python">Python</option>
              <option value="php">PHP</option>
              <option value="c#">C#</option>
              <option value="ruby">Ruby</option>
              <option value="java">Java</option>
            </select>
          </div>
          <div className="col-2 d-flex justify-content-end">
            <button className="btn btn-secondary" onClick={handleUserLeave}>
              Leave Room
            </button>
          </div>
        </div>
        <div className="sidebar col-4">
          <UserList userList={uList} currentUser={cUser} />
        </div>
        <div className="messages col-8 overflow-auto">
          <MessageList messageList={mList} />
        </div>
      </div>
      <div className="add-message row">
        <AddMessage author={cUser} />
      </div>
    </div>
  );
};

export default ChatContainer;
