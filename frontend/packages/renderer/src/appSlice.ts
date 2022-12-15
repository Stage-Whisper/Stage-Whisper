import {createSlice} from '@reduxjs/toolkit';

import type {RootState} from './redux/store';

// app Slice
// This slice is used to store the state of the app shell

export interface appState {
  burgerOpen: boolean;
  debugMenu: boolean;
}

const initialState: appState = {
  // currentView: appView.DASHBOARD,
  burgerOpen: false,
  debugMenu: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setBurgerOpen: (state, action) => {
      state.burgerOpen = action.payload;
    },
    toggleDebugMenu: state => {
      state.debugMenu = !state.debugMenu;
    },
  },
});

export const {setBurgerOpen, toggleDebugMenu} = appSlice.actions;

export const selectBurgerOpen = (state: RootState) => state.app.burgerOpen;
export const selectDebugMenu = (state: RootState) => state.app.debugMenu;

export default appSlice.reducer;
