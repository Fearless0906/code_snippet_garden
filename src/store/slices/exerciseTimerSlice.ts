import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExerciseTimer {
  [key: string]: {
    elapsedTime: number;
    isRunning: boolean;
    lastStartTime: number | null;
  };
}

const initialState: ExerciseTimer = {};

export const exerciseTimerSlice = createSlice({
  name: 'exerciseTimer',
  initialState,
  reducers: {
    startTimer: (state, action: PayloadAction<string>) => {
      const exerciseId = action.payload;
      if (!state[exerciseId]) {
        state[exerciseId] = {
          elapsedTime: 0,
          isRunning: true,
          lastStartTime: Date.now()
        };
      } else {
        state[exerciseId].isRunning = true;
        state[exerciseId].lastStartTime = Date.now();
      }
    },
    pauseTimer: (state, action: PayloadAction<string>) => {
      const exerciseId = action.payload;
      if (state[exerciseId]?.isRunning) {
        state[exerciseId].elapsedTime += Date.now() - (state[exerciseId].lastStartTime || 0);
        state[exerciseId].isRunning = false;
        state[exerciseId].lastStartTime = null;
      }
    },
    updateElapsedTime: (state, action: PayloadAction<{ id: string; time: number }>) => {
      const { id, time } = action.payload;
      if (state[id]) {
        state[id].elapsedTime = time;
      }
    },
  },
});

export const { startTimer, pauseTimer, updateElapsedTime } = exerciseTimerSlice.actions;
export default exerciseTimerSlice.reducer;
