import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LayoutState {
  searchTerm: string;
}

const initialState: LayoutState = {
  searchTerm: '',
};

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { setSearchTerm } = layoutSlice.actions;
export default layoutSlice.reducer;
