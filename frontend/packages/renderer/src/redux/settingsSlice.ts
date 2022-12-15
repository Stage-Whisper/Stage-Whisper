import type {WhisperArgs} from './../../../electron/types/whisperTypes';
import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from './store';

// Settings Slice
// This slice is used to store the state of the settings

export interface settingsState {
  // currentView: SettingsView;
  darkMode: boolean;
  theme: string;
  displayLanguage: WhisperArgs['language'];
  burgerOpen: boolean;
  allowLargeModels: boolean;
  audio_padding_level: number;
}

const initialState: settingsState = {
  // currentView: SettingsView.DASHBOARD,
  theme: 'default',

  darkMode: true,
  displayLanguage: 'English', // TODO: Change to user's language
  burgerOpen: false,
  allowLargeModels: false,
  audio_padding_level: 0.5,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleDarkMode: state => {
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
    },
    setAudioPadding: (state, action) => {
      state.audio_padding_level = action.payload;
    },
  },
});

export const {
  //  setCurrentView,
  setTheme,
  toggleDarkMode,
  setDisplayLanguage,
  setAllowLargeModel,
  setAudioPadding,
} = settingsSlice.actions;

// export const selectCurrentView = (state: RootState) => state.settings.currentView;
export const selectTheme = (state: RootState) => state.settings.theme;
export const selectDarkMode = (state: RootState) => state.settings.darkMode;
export const selectDisplayLanguage = (state: RootState) => state.settings.displayLanguage;
export const selectAllowLargeModels = (state: RootState) => state.settings.allowLargeModels;
export const selectAudioPadding = (state: RootState) => state.settings.audio_padding_level;

export default settingsSlice.reducer;
