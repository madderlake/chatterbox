import {createSlice} from '@reduxjs/toolkit';

const initialState = {
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
