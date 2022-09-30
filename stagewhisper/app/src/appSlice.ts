import { createSlice } from '@reduxjs/toolkit';

import { RootState } from './redux/store';

// app Slice
// This slice is used to store the state of the app shell

export interface appState {
  burgerOpen: boolean;
}

const initialState: appState = {
  // currentView: appView.DASHBOARD,
  burgerOpen: false
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setBurgerOpen: (state, action) => {
      state.burgerOpen = action.payload;
    }
  }
});

export const { setBurgerOpen } = appSlice.actions;

export const selectBurgerOpen = (state: RootState) => state.app.burgerOpen;

export default appSlice.reducer;
