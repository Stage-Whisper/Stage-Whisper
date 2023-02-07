// Packages
import {combineReducers, configureStore} from '@reduxjs/toolkit';

// Types
import type {PreloadedState} from '@reduxjs/toolkit';

// Redux
import inputReducer from './inputSlice';
import settingsReducer from './settingsSlice';
import appReducer from '../appSlice';
import entriesReducer from './entrySlice';
import whisperReducer from './whisperSlice';

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

console.debug('Loaded Store');
