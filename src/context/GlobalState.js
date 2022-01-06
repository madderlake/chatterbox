import React, {createContext, useReducer} from 'react';
import AppReducer from './AppReducer';

const initialState = {
  userList: [],
  messageList: [],
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({children}) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Actions for changing state

  function addUserToList(User) {
    dispatch({
      type: 'ADD_USER',
      payload: User,
    });
  }
  function removeUserFromList(User) {
    dispatch({
      type: 'REMOVE_USER',
      payload: User,
    });
  }

  function addMessageToList(Message) {
    dispatch({
      type: 'ADD_MESSAGE',
      payload: Message,
    });
  }
  function removeMessageFromList(Message) {
    dispatch({
      type: 'REMOVE_MESSAGE',
      payload: Message,
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        userList: state.userList,
        messageList: state.messageList,
        addUserToList,
        removeUserFromList,
        addMessageToList,
        removeMessageFromList,
      }}>
      {children}
    </GlobalContext.Provider>
  );
};
