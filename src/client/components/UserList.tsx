import React from "react";
import cn from "classnames";
import { User } from "../../../types";

interface UserListProps {
  currentUser: User;
  userList: User[];
  privateMode: boolean;
  updatePrivate: () => void;
}

const UserList = ({
  userList,
  currentUser,
  updatePrivate,
  privateMode,
}: UserListProps): JSX.Element => {
  return (
    <>
      <h4>Who's Online?</h4>
      <ul className="user-list">
        <li className="user current">{currentUser.username}</li>
        {userList &&
          userList.map(({ username }, idx) => {
            return (
              username !== currentUser.username && (
                <li
                  key={`usr-${idx + 1}`}
                  onClick={updatePrivate}
                  className={cn("user", {
                    current: username === currentUser.username,
                  })}
                >
                  {username}
                </li>
              )
            );
          })}
      </ul>
    </>
  );
};

export default UserList;
