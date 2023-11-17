import React, {
  useContext,
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
} from 'react';
import { ClientContext } from '../contexts/ClientContext';
import { Author, Message } from '../redux/slices/messageSlice';

interface AddMessageProps {
  author: Author;
}
const AddMessage = ({ author }: AddMessageProps): JSX.Element => {
  const client = useContext(ClientContext);
  const [message, setMessage] = useState<Omit<Message, 'time'> | null>(null);
  const [typing, setTyping] = useState<boolean | null>(null);

  const notesRef = useRef<HTMLParagraphElement>(null);

  const handleSubmit = (ev: React.SyntheticEvent) => {
    ev.preventDefault();
    setTyping(false);
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
  const handleTyping = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' && e.key !== 'Tab') {
      setTyping(true);
    } else {
      setTyping(false);
    }
  };

  const formatTypingText = (arr: string[]): string => {
    if (arr.length < 1) return '';
    const lastItem = arr[arr.length - 1];
    let typingString: string;
    const delimiter = arr.length > 2 ? ', ' : ' and ';
    if (arr.length === 1) {
      typingString = `${[...arr]} is typing...`;
    } else {
      const begUsersArray = arr.filter((item) => item !== lastItem);
      const arrayString = begUsersArray.join(delimiter);
      typingString = `${arrayString} and ${lastItem} are typing...`;
    }
    return typingString;
  };
  useEffect(() => {
    inputRef.current && inputRef.current.focus();
    const emitString =
      typing === true ? 'typing' : typing === false ? 'notTyping' : null;
    emitString !== null && client.emit(emitString, { ...author });

    const onString =
      typing === true ? 'showTyping' : typing === false ? 'stillTyping' : null;

    client.on(onString, (data: string[]) => {
      const typingText = data.length > 0 ? formatTypingText(data) : '';
      if (notesRef.current !== null) {
        notesRef.current.textContent = typingText;
      }
    });
<<<<<<< Updated upstream
  }, [client, typing, author]);
=======
    client.on('stillTyping', (data: any) => {
      // if (notesRef.current === null) return;
      console.log('stopping', data);
      typingText = data.length > 0 ? formatTypingText(data) : '';

      if (notesRef.current !== null) {
        notesRef.current.textContent = typingText;
      }
    });
  }, [typing, typingText, author.username]);
>>>>>>> Stashed changes
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
        />
        <input type="submit" className="btn btn-primary" value="Send" />
      </form>
      <div className="typing mt-2 small">
        <p id="#typing" ref={notesRef}></p>
      </div>
    </>
  );
};

export default AddMessage;
