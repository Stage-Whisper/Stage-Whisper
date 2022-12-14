// import {MainScreen, AboutScreen, SearchScreen} from './screens';

import {Input} from '@mantine/core';
import {HashRouter, Route, Routes} from 'react-router-dom';
import App from './App';
import About from './features/about/About';
import Dashboard from './features/dashboard/Dashboard';
import EntryEditor from './features/entries/editor/EntryEditor';
import Entries from './features/entries/EntryList';
import Settings from './features/settings/Settings';
// import Entries from './features/entries/EntryList';
// import EntryEditor from './features/entries/editor/EntryEditor';
// import Settings from './features/settings/Settings';
// import Dashboard from './features/dashboard/Dashboard';

export function AppRoutes() {
  console.log('AppRoutes');
  console.log('Current route: ' + window.location.hash);
  return (
    <HashRouter>
      <Routes>
        <Route element={<App />}>
          <Route
            index
            element={<Dashboard />}
          />
          <Route
            path="/transcribe"
            element={<Input />}
          />
          <Route
            path="/settings"
            element={<Settings />}
          />
          <Route
            path="/about"
            element={<About />}
          />
          <Route
            path="/entries"
            element={<Entries />}
          />
          <Route
            path="/entries/:entryUUID"
            element={<EntryEditor />}
          />

          <Route
            path="*"
            element={<div>404</div>}
          />
        </Route>
      </Routes>
    </HashRouter>
  );
}
