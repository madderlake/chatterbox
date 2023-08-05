import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
//import type {RootState} from '../store';

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
    getMessages: (state, action: PayloadAction<Message[]>) => {
      state.messageList = [...action.payload];
    },
  },
});

export const {getMessages} = messageSlice.actions;
export default messageSlice.reducer;
