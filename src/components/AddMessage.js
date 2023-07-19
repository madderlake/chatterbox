import React, {useContext, useRef, useEffect} from 'react';
import {SocketContext} from '../contexts/SocketContext';
import {useDispatch} from 'react-redux';
import {addMessage} from '../redux/slices/messageSlice';

const AddMessage = ({author}) => {
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();

  let newMessage = {
    author: author.username,
    text: '',
    room: author.room,
  };
  const handleSubmit = (ev) => {
    ev.preventDefault();
    dispatch(addMessage(newMessage));
    socket.emit('chatMessage', {
      author: newMessage.author,
      text: newMessage.text,
      room: newMessage.room,
    });
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
        value={''}
        onChange={(ev) => (newMessage = {...newMessage, text: ev.target.value})}
        // setMessage({
        //   ...message,
        //   author: props.author,
        //   text: ev.target.value,
        //   room: props.author.room,
        // })
      />
      <input type="submit" className="btn btn-primary" value="Send" />
    </form>
  );
};

export default AddMessage;
