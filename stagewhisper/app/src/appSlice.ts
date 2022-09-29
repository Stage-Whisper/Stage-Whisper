import { createSlice } from '@reduxjs/toolkit';

import { RootState } from './redux/store';

// app Slice
// This slice is used to store the state of the app

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
    toggleBurger: (state) => {
      state.burgerOpen = !state.burgerOpen;
    }
  }
});

export const { toggleBurger } = appSlice.actions;

export const selectBurgerOpen = (state: RootState) => state.app.burgerOpen;

export default appSlice.reducer;
