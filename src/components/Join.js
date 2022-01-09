import React, {useState, useContext} from 'react';
import {v4 as uuidv4} from 'uuid';
import {SocketContext} from '../context/socket';

const Join = ({...props}) => {
  const socket = useContext(SocketContext);
  socket.connect();

  const [state, setState] = useState({
    username: '',
    room: '',
    id: uuidv4(),
  });

  const handleSubmit = (ev) => {
    ev.preventDefault();
    state.username &&
      state.room &&
      socket.emit('joinRoom', {
        username: state.username,
        room: state.room,
        id: state.id,
      });

    //props.history.push(`${state.room}/${state.username}/${state.id}`);
    props.history.push({
      pathname: `/${state.room}`,
      from: 'join',
      state: {
        username: state.username,
        room: state.room,
        id: state.id,
      },
    });
  };

  return (
    <div className="join-chat container">
      <h1 className="text-center">Welcome to ChatterBox!</h1>
      <form onSubmit={handleSubmit}>
        <div className="row w-100">
          <div className="col-12 my-3">
            <input
              required
              type="text"
              name="username"
              className="w-100"
              placeholder="Type your Name to Join Chat"
              onChange={(ev) => setState({...state, username: ev.target.value})}
            />
          </div>
          <div className="col-12 my-3">
            {/* <label for="room">Select a Room</label> */}
            <select
              required
              style={{
                WebkitAppearance: 'none',
                width: '100%',
                backgroundColor: 'white',
                border: '1px solid #e1e1e1',
                padding: '3px 5px',
              }}
              name="room"
              id="room"
              onChange={(ev) => setState({...state, room: ev.target.value})}>
              <option value="">Select a Room</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="PHP">PHP</option>
              <option value="C#">C#</option>
              <option value="Ruby">Ruby</option>
              <option value="Java">Java</option>
            </select>
          </div>
          <div className="col-12 my-3">
            <input type="submit" className="btn btn-primary" value="Join" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Join;
