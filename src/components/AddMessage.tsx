import React, {useContext, useState, useRef, useEffect} from 'react';
import {SocketContext} from '../contexts/SocketContext';
import {Author, Message} from '../redux/slices/messageSlice';

interface AddMessageProps {
  author: Author;
}
const AddMessage = ({author}: AddMessageProps): JSX.Element => {
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState<Omit<Message, 'time'> | null>(null);

  const handleSubmit = (ev: React.SyntheticEvent) => {
    ev.preventDefault();
    message !== null &&
      message.text &&
      socket.emit('chatMessage', {
        author: author,
        text: message.text,
        room: author.room,
      });
    setMessage(null);
  };
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  });
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        ref={inputRef}
        placeholder="Type your Message"
        value={message !== null ? message.text : ''}
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
