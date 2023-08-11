import React, {useState, useContext, useEffect} from 'react';
import {v4 as uuidv4} from 'uuid';
import {ClientContext} from '../contexts/ClientContext';
import {rooms} from './room-list';

export const Join = ({...props}) => {
  const client = useContext(ClientContext);

  const [state, setState] = useState({
    username: '',
    room: '',
    id: uuidv4(),
  });

  const handleSubmit = (ev: React.SyntheticEvent) => {
    ev.preventDefault();
    client.connect();
    state.username !== '' && client.emit('joinRoom', {...state}, null);
    props.history.push({
      pathname: `/${state.room}/${state.username}/${state.id}`,
      from: 'join',
      state,
    });
  };
  useEffect(() => {
    document.title = 'Chatterbox';
  }, []);
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
              onChange={(ev) =>
                setState({
                  ...state,
                  room: ev.target.value,
                })
              }>
              <option value="">Select a Room</option>
              {rooms.map(({key, name}, i) => (
                <option value={key} key={i}>
                  {name}
                </option>
              ))}
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
