import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  messageList: [],
  message: {},
};

const messageSlice = createSlice({
  name: 'messageSlice',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messageList = {...state.messageList, ...action.payload};
    },
    getMessages: (state, action) => {
      state.messageList = action.payload;
    },
  },
});

export const {addMessage, getMessages} = messageSlice.actions;
export default messageSlice.reducer;
