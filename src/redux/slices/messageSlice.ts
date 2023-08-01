import {createSlice} from '@reduxjs/toolkit';

export type Author = {
  room: string;
  username: string;
  id: string;
};
export type Message = {
  author: Author;
  text: string;
  room: string;
  time: string;
};

interface MessageState {
  messageList: Message[];
}

const initialState: MessageState = {
  messageList: [],
};

const messageSlice = createSlice({
  name: 'messageSlice',
  initialState,
  reducers: {
    getMessages: (state, action) => {
      state.messageList = [...action.payload];
    },
  },
});

export const {getMessages} = messageSlice.actions;
export default messageSlice.reducer;
