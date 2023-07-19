import React, {useContext, useState, useRef, useEffect} from 'react';
import {SocketContext} from '../contexts/SocketContext';

const AddMessage = ({...props}) => {
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState({});

  const handleSubmit = (ev) => {
    ev.preventDefault();
    socket.emit('chatMessage', {
      author: props.author,
      text: message.text,
      room: props.author.room,
    });
    setMessage({});
  };
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  });
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        ref={inputRef}
        placeholder="Type your Message"
        value={message.text || ''}
        onChange={(ev) =>
          setMessage({
            // ...message,
            author: props.author,
            text: ev.target.value,
            room: props.author.room,
          })
        }
      />
      <input type="submit" className="btn btn-primary" value="Send" />
    </form>
  );
};

export default AddMessage;
