import { createSlice } from '@reduxjs/toolkit';
import { WhisperLanguages } from '../input/components/language/languages';
import { RootState } from '../../redux/store';

// Settings Slice
// This slice is used to store the state of the settings

export interface settingsState {
  // currentView: SettingsView;
  darkMode: boolean;
  theme: string;
  displayLanguage: keyof typeof WhisperLanguages;
  burgerOpen: boolean;
  allowLargeModels: boolean;
}

const initialState: settingsState = {
  // currentView: SettingsView.DASHBOARD,
  theme: 'default',

  darkMode: true,
  displayLanguage: 'en', // TODO: Change to user's language
  burgerOpen: false,
  allowLargeModels: false
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDisplayLanguage: (state, action) => {
      state.displayLanguage = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setAllowLargeModel: (state, action) => {
      state.allowLargeModels = action.payload;
    }
  }
});

export const {
  //  setCurrentView,
  setTheme,
  toggleDarkMode,
  setDisplayLanguage,
  setAllowLargeModel
} = settingsSlice.actions;

// export const selectCurrentView = (state: RootState) => state.settings.currentView;
export const selectTheme = (state: RootState) => state.settings.theme;
export const selectDarkMode = (state: RootState) => state.settings.darkMode;
export const selectDisplayLanguage = (state: RootState) => state.settings.displayLanguage;
export const selectAllowLargeModels = (state: RootState) => state.settings.allowLargeModels;

export default settingsSlice.reducer;
