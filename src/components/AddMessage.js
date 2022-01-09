import React, {useContext, useRef, useEffect, useState} from 'react';
import {SocketContext} from '../context/socket';

const AddMessage = ({...props}) => {
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState({
    author: props.author,
    text: '',
  });

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (message.author && message.text) {
      socket.emit('chatMessage', {
        author: message.author,
        text: message.text,
      });
    }
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
            ...message,
            author: props.author,
            text: ev.target.value,
          })
        }
      />
      <input type="submit" className="btn btn-primary" value="Send" />
    </form>
  );
};

export default AddMessage;
