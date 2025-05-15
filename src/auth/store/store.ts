import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import savedSnippetsReducer from './slices/savedSnippetsSlice';
import layoutReducer from '../../store/slices/layoutSlice';
import exerciseTimerReducer from '../../store/slices/exerciseTimerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    savedSnippets: savedSnippetsReducer,
    layout: layoutReducer,
    exerciseTimer: exerciseTimerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
