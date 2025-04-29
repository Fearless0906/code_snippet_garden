import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import savedSnippetsReducer from './slices/savedSnippetsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    savedSnippets: savedSnippetsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
