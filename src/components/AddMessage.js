import React, {useContext, useState, useRef, useEffect} from 'react';
import {SocketContext} from '../contexts/SocketContext';

const AddMessage = ({author}) => {
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState({});

  const handleSubmit = (ev) => {
    ev.preventDefault();
    message.text &&
      socket.emit('chatMessage', {
        author: author,
        text: message.text,
        room: author.room,
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
            author: author,
            text: ev.target.value,
            room: author.room,
          })
        }
      />
      <input type="submit" className="btn btn-primary" value="Send" />
    </form>
  );
};

export default AddMessage;
