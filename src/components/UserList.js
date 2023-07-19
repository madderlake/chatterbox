import React from 'react';
import cn from 'classnames';

const UserList = ({userList, currentUser}) => {
  return (
    <>
      <h4>Who's Online?</h4>
      <ul className="user-list">
        {/* <li className="user current">{currentUser.username}</li> */}
        {userList &&
          userList.map(({username}, idx) => {
            return (
              <li
                key={`usr-${idx + 1}`}
                className={cn('user', {
                  current: username === currentUser.username,
                })}>
                {username}
              </li>
            );
          })}
      </ul>
    </>
  );
};

export default UserList;
