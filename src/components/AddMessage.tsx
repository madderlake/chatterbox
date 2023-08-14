import React, {
  useContext,
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
} from 'react';
import {ClientContext} from '../contexts/ClientContext';
import {Author, Message} from '../redux/slices/messageSlice';

interface AddMessageProps {
  author: Author;
}
const AddMessage = ({author}: AddMessageProps): JSX.Element => {
  const client = useContext(ClientContext);
  const [message, setMessage] = useState<Omit<Message, 'time'> | null>(null);
  const [typing, setTyping] = useState<boolean | null>(null);

  const notesRef = useRef<HTMLParagraphElement>(null);

  const handleSubmit = (ev: React.SyntheticEvent) => {
    ev.preventDefault();
    message !== null &&
      message.text &&
      client.emit('chatMessage', {
        author: author,
        text: message.text,
        room: author.room,
      });
    setMessage(null);
  };
  const inputRef = useRef<HTMLInputElement>(null);
  //console.log('typing', typing);
  const handleTyping = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' && e.key !== 'Tab') {
      //console.log('key', e.key);
      setTyping(true);
    } else {
      setTyping(false);
    }
  };

  // const handleStopTyping = (e: FocusEvent<HTMLInputElement>) => {
  //   setTyping(false);
  // };
  let typingText = '';
  const formatTypingText = (arr: string[]) => {
    const lastItem = arr[arr.length - 1];
    arr.map((user) => {
      if (arr.length === 1) {
        typingText = `${user} is typing...`;
      } else {
        const delimiter = arr.length > 2 ? ', ' : ' and ';
        // console.log(lastItem);
        const begUsersArray = arr.filter((item) => item !== lastItem);
        const arrayString = begUsersArray.join(delimiter);
        typingText = `${arrayString} and ${lastItem} are typing...`;
      }
    });
    return typingText;
  };
  useEffect(() => {
    //if (notesRef.current === null || inputRef.current === null) return;
    inputRef.current && inputRef.current.focus();
    if (typing === true) {
      client.emit('typing', author.username);
    } else if (typing === false) {
      client.emit('clearTyping', author.username);
    } else {
      return;
    }

    client.on('showTyping', (data: any) => {
      console.log('type data', data);
      // const typingUsers: string[] = Array.from(new Set(data));
      typingText = formatTypingText(data);
      if (notesRef.current !== null) {
        notesRef.current.textContent = typingText;
      }
    });
    client.on('stopTyping', (data: any) => {
      // if (notesRef.current === null) return;
      console.log('stopping', data);
      typingText = data.length > 0 ? formatTypingText(data) : '';

      if (notesRef.current !== null) {
        notesRef.current.textContent = typingText;
      }
    });
  }, [typing, typingText, author.username]);
  return (
    <>
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
          onKeyDown={handleTyping}
          //onBlur={handleStopTyping}
        />
        <input type="submit" className="btn btn-primary" value="Send" />
      </form>
      <div className="typing">
        <p id="#typing" ref={notesRef}></p>
      </div>
    </>
  );
};

export default AddMessage;
