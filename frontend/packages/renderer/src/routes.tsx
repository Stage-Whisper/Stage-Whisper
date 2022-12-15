import {HashRouter, Route, Routes} from 'react-router-dom';
import App from './App';
import About from './screens/about/About';
import Dashboard from './screens/dashboard/Dashboard';
import EntryEditor from './screens/transcription/EntryEditor';
import Entries from './screens/list/EntryList';
import Input from './screens/input/Input';
import Settings from './screens/settings/Settings';

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
