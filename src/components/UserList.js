import React from 'react';
import cn from 'classnames';

const UserList = ({userList, currentUser, ...props}) => {
  return (
    <>
      <h4>Who's Online?</h4>
      <ul className="user-list">
        {userList &&
          userList.map((user, idx) => {
            return (
              <li
                key={`usr-${idx + 1}`}
                className={cn('user', {
                  current: user.username === currentUser.username,
                })}>
                {user.username}
              </li>
            );
          })}
      </ul>
    </>
  );
};

export default UserList;
