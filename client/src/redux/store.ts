import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import messageReducer from './slices/messageSlice';
import session from 'redux-persist/lib/storage/session';
import { persistReducer } from 'redux-persist';
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

const persistedReducer = persistReducer<RootReducer>(
  persistConfig,
  rootReducer
);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export default store;

export type RootReducer = ReturnType<typeof rootReducer>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
