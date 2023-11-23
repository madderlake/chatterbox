import { createSlice } from '@reduxjs/toolkit';

export type User = {
  username: string;
  room: string;
  id: string;
  sid: string | '';
};

interface UserState {
  // currentUser: User;
  userList: User[];
}

const initialState: UserState = {
  // currentUser: {
  //   username: '',
  //   room: '',
  //   id: '',
  //   sid: '',
  // },
  userList: [],
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    // join: (state, action) => {
    //   state.currentUser = { ...state.currentUser, ...action.payload };
    // },
    getUserList: (state, action) => {
      state.userList = [...action.payload];
    },
    getRoomUserList: (state, action) => {
      state.userList = state.userList.filter(
        (user) => user.room === action.payload
      );
    },
    leave: (state, action) => {
      // state.currentUser = {
      //   username: '',
      //   room: '',
      //   id: '',
      //   sid: '',
      // };
      state.userList = state.userList.filter(
        (user) => user.id !== action.payload
      );
    },
    // switchRoom: (state, action) => {
    //   state.currentUser = { ...state.currentUser, room: action.payload };
    // },
  },
});

export const { getUserList, getRoomUserList, leave } = userSlice.actions;
export default userSlice.reducer;
