import React from 'react';
//import {GlobalContext} from '../context/GlobalState';
//import io from 'socket.io-client';

const UserList = ({userList, ...props}) => {
  //const [userList, setUserList] = useState([]);
  //console.log('userList', userList);
  // const storedUsers = JSON.parse(localStorage.getItem('storedUsers'));
  //const storedUserList = JSON.parse(localStorage.getItem('storedUsers'));

  return (
    <>
      <h4>Who's Online?</h4>
      <ul className="user-list">
        {userList.map((user, idx) => {
          return <li key={`usr-${idx + 1}`}>{user.username}</li>;
        })}
      </ul>
    </>
  );
};

export default UserList;
