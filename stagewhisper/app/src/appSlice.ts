import { createSlice } from '@reduxjs/toolkit';
import { WhisperLanguages } from './components/input/language/languages';
import { RootState } from './redux/store';

// App Slice
// This slice is used to store the state of the app

enum AppView {
  DASHBOARD = 'DASHBOARD',
  INPUT = 'INPUT',
  TRANSCRIBE = 'TRANSCRIBE',
  RESULTS = 'RESULTS',
  SETTINGS = 'SETTINGS',
  ABOUT = 'ABOUT',
  HELP = 'HELP',
  ERROR = 'ERROR',
  LOADING = 'LOADING'
}

export interface appState {
  currentView: AppView;
  darkMode: boolean;
  displayLanguage: keyof typeof WhisperLanguages;
  burgerOpen: boolean;
}

const initialState: appState = {
  currentView: AppView.DASHBOARD,
  darkMode: false,
  displayLanguage: 'en', // TODO: Change to user's language
  burgerOpen: false
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDisplayLanguage: (state, action) => {
      state.displayLanguage = action.payload;
    },
    toggleBurger: (state) => {
      state.burgerOpen = !state.burgerOpen;
    }
  }
});

export const { setCurrentView, toggleDarkMode, setDisplayLanguage, toggleBurger } = appSlice.actions;

export const selectCurrentView = (state: RootState) => state.app.currentView;
export const selectDarkMode = (state: RootState) => state.app.darkMode;
export const selectDisplayLanguage = (state: RootState) => state.app.displayLanguage;
export const selectBurgerOpen = (state: RootState) => state.app.burgerOpen;

export default appSlice.reducer;
