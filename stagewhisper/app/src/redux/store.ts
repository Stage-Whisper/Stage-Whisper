import { combineReducers, configureStore, PreloadedState } from '@reduxjs/toolkit';

// Redux reducers
import inputReducer from '../views/input/inputSlice';
import settingsReducer from '../views/settings/settingsSlice';

// Combine reducers to create a root reducer
const rootReducer = combineReducers({
  settings: settingsReducer,
  input: inputReducer
  // group: groupReducer,
  // register: registerReducer,
  // dashboard: dashboardReducer
});

// Use the root reducer to create a store
export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState
  });
};

// Export a typed version of the store
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
