import { createSlice } from '@reduxjs/toolkit';
import { WhisperLanguages } from '../../components/input/language/languages';
import { RootState } from '../../redux/store';

// Settings Slice
// This slice is used to store the state of the settings

// enum SettingsView {
//   DASHBOARD = 'DASHBOARD',
//   INPUT = 'INPUT',
//   TRANSCRIBE = 'TRANSCRIBE',
//   RESULTS = 'RESULTS',
//   SETTINGS = 'SETTINGS',
//   ABOUT = 'ABOUT',
//   HELP = 'HELP',
//   ERROR = 'ERROR',
//   LOADING = 'LOADING'
// }

export interface settingsState {
  // currentView: SettingsView;
  darkMode: boolean;
  displayLanguage: keyof typeof WhisperLanguages;
  burgerOpen: boolean;
}

const initialState: settingsState = {
  // currentView: SettingsView.DASHBOARD,
  darkMode: false,
  displayLanguage: 'en', // TODO: Change to user's language
  burgerOpen: false
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // setCurrentView: (state, action) => {
    //   state.currentView = action.payload;
    // },
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

export const {
  //  setCurrentView,
  toggleDarkMode,
  setDisplayLanguage,
  toggleBurger
} = settingsSlice.actions;

// export const selectCurrentView = (state: RootState) => state.settings.currentView;
export const selectDarkMode = (state: RootState) => state.settings.darkMode;
export const selectDisplayLanguage = (state: RootState) => state.settings.displayLanguage;
export const selectBurgerOpen = (state: RootState) => state.settings.burgerOpen;

export default settingsSlice.reducer;
