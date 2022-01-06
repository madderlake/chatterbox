export default (state, action) => {
  switch (action.type) {
    case 'ADD_USER':
      return {
        userList: [action.payload, ...state.userList],
      };
    case 'REMOVE_USER':
      return {
        userList: state.userList.filter((item) => item !== action.payload),
      };
    case 'ADD_MESSAGE':
      return {
        messageList: [action.payload, ...state.messageList],
      };
    case 'REMOVE_MESSAGE':
      return {
        messageList: state.messageList.filter(
          (item) => item !== action.payload
        ),
      };
    default:
      return state;
  }
};
