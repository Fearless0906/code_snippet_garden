import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SavedSnippetsState {
  count: number;
}

const initialState: SavedSnippetsState = {
  count: 0,
};

const savedSnippetsSlice = createSlice({
  name: 'savedSnippets',
  initialState,
  reducers: {
    setSavedCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    incrementSavedCount: (state) => {
      state.count += 1;
    },
    decrementSavedCount: (state) => {
      state.count = Math.max(0, state.count - 1);
    },
  },
});

export const { setSavedCount, incrementSavedCount, decrementSavedCount } = savedSnippetsSlice.actions;
export default savedSnippetsSlice.reducer;
