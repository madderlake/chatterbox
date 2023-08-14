import React, {useContext, useState, useRef, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import UserList from './UserList';
import MessageList from './MessageList';
import AddMessage from './AddMessage';
import {ClientContext} from '../contexts/ClientContext';
import {titleCase} from '../utils/helpers';
import {join, leave, switchRoom, addUsers} from '../redux/slices/userSlice';
import {getMessages} from '../redux/slices/messageSlice';
import {useParams} from 'react-router-dom';
import {rooms} from './room-list';
import type {Author, Message} from '../redux/slices/messageSlice';
import type {User} from '../redux/slices/userSlice';

interface RouteParams {
  room: string;
  username: string;
  id: string;
}
export const ChatContainer = ({...props}) => {
  const client = useContext(ClientContext);
  const dispatch = useAppDispatch();
  const params = useParams<RouteParams>();
  const [currentUser, setCurrentUser] = useState<User>({
    ...params,
    sid: '',
  });

  /* TODO - change these const names */
  const cUser = useAppSelector((state) => state.user.currentUser);
  const uList = useAppSelector((state) => state.user.userList);
  const mList = useAppSelector((state) => state.messages.messageList);

  const roomName = titleCase(currentUser.room);
  const newUser = cUser.username !== currentUser.username;

  const handleUserLeave = () => {
    const leaveRoom = window.confirm(
      `Are you sure you want to leave the ${roomName} chatroom?`
    );
    leaveRoom && client.emit('userLeaving', {...currentUser}, true);
    dispatch(leave(currentUser.id));
    client.disconnect();
    props.history.replace('/');
  };

  const handleUserSwitch = (ev: React.SyntheticEvent) => {
    const newRoom = (ev.target as HTMLInputElement).value;
    if (
      window.confirm(`Are you sure you want to switch to the ${newRoom} room?`)
    ) {
      client.emit('userSwitching', {...currentUser}, newRoom);
      setCurrentUser({...currentUser, room: newRoom});
      dispatch(switchRoom(newRoom));

      client.emit('joinRoom', {...currentUser}, null);
      props.history.push(
        `/${newRoom}/${currentUser.username}/${currentUser.id}`
      );
    }
  };

  useEffect(() => {
    newUser !== false
      ? dispatch(join({...currentUser}))
      : client.emit('joinRoom', {...currentUser}, newUser);

    client.on('roomUsers', (users: User[]) => dispatch(addUsers(users)));
    client.on('roomMessages', (messages: Message[]) =>
      dispatch(getMessages(messages))
    );
    client.on('showTyping', (data: object) => {
      //console.log(data);
    });
    // CLEAN UP
    return () => client.removeAllListeners();
  }, [newUser, client, currentUser, dispatch]);

  return (
    <div className="container">
      <div className="row">
        <div className="header col-12">
          <h4 className="col-8 m-0 p-0 text-nowrap">
            The {`${roomName}`} Room
            <span className="small"> @Chatterbox</span>
          </h4>
          <div className="col-4 m-0 p-0 d-flex justify-content-end">
            <select
              required
              className="btn btn-secondary"
              style={{
                appearance: 'none',
              }}
              name="switch-room"
              id="switch-room"
              onChange={handleUserSwitch}>
              <option value="">Switch Rooms</option>
              {rooms.map(({key, name}, i) => (
                <option value={key} key={i}>
                  {name}
                </option>
              ))}
            </select>
            <button
              className="btn btn-secondary"
              onClick={handleUserLeave}
              style={{marginLeft: '1em'}}>
              Log off &raquo;
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
        <AddMessage author={cUser as Author} />
      </div>
      {/* <div className="typing">
        <p>
          ...<span id="#typing" ref={notesRef}></span>
        </p>
      </div> */}
    </div>
  );
};
