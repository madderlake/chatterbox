import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {userReducer} from './slices/userSlice';
import {messageReducer} from './slices/messageSlice';
import storageSession from 'redux-persist/lib/storage';
import {persistReducer, persistStore} from 'redux-persist';
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storageSession,
};

const rootReducer = combineReducers({
  users: userReducer,
  messages: messageReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);
