import {configureStore, combineReducers} from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import messageReducer from './slices/messageSlice.js';
import session from 'redux-persist/lib/storage/session';
import {persistReducer} from 'redux-persist';
import thunk from 'redux-thunk';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
const persistConfig = {
  key: 'root',
  storage: session,
  stateReconciler: autoMergeLevel2,
};

const rootReducer = combineReducers({
  user: userReducer,
  messages: messageReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export default store;
