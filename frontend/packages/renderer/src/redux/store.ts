import {combineReducers, configureStore} from '@reduxjs/toolkit';
import type {PreloadedState} from '@reduxjs/toolkit';
// Redux reducers
import inputReducer from '../features/input/inputSlice';
import settingsReducer from '../features/settings/settingsSlice';
import appReducer from '../appSlice';
import entriesReducer from '../features/entries/entrySlice';
import whisperReducer from '../features/whisper/whisperSlice';

// Combine reducers to create a root reducer
const rootReducer = combineReducers({
  settings: settingsReducer,
  input: inputReducer,
  app: appReducer,
  entries: entriesReducer,
  whisper: whisperReducer,
});

// Use the root reducer to create a store
export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

// Export a typed version of the store
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
