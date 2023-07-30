import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  currentUser: {},
  userList: [],
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    join: (state = initialState, action) => {
      state.currentUser = {...state.currentUser, ...action.payload};
    },
    addUsers: (state, action) => {
      state.userList = action.payload;
    },
    leave: (state, action) => {
      state.currentUser = {};
      state.userList = state.userList.filter(
        (user) => user.id !== action.payload
      );
    },
    switchRoom: (state, action) => {
      state.currentUser = {...state.currentUser, room: action.payload};
    },
  },
});

export const {join, addUsers, leave, switchRoom} = userSlice.actions;
export default userSlice.reducer;
