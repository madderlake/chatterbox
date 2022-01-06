import React, {useContext, useState} from 'react';
import {GlobalContext} from '../context/GlobalState';
import io from 'socket.io-client';

const AddMessage = ({...props}) => {
  //const {addMessageToList} = useContext(GlobalContext);
  const socket = props.socket;

  const [message, setMessage] = useState({
    author: props.author,
    text: '',
  });
  // const addMessage = (data) => {
  //   addMessageToList(data);
  // };

  //const socket = io();
  // socket.on('RECEIVE_MESSAGE', function (data) {
  //   addMessage(data);
  // });

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (message.author && message.text) {
      console.log('ready to send');
      socket.emit('chatMessage', {
        author: message.author,
        text: message.text,
      });
    }
    // setmessage({...message, message: ''});
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
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
