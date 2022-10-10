import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// Views
import Dashboard from './features/dashboard/Dashboard';
import Input from './features/input/Input';

// React Router
import { HashRouter, Route, Routes } from 'react-router-dom';

// Redux
import { Provider } from 'react-redux';
import { setupStore } from './redux/store';

import About from './features/about/About';
import Entries from './features/entries/Entries';
import EntryEditor from './features/entries/EntryEditor';
import Settings from './features/settings/Settings';
import { ModalsProvider } from '@mantine/modals';

export const store = setupStore();

// Convert from ReactDOM.render to createRoot

const rootElement = document.getElementById('root') as Element;
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ModalsProvider>
        <HashRouter>
          <Routes>
            <Route element={<App />}>
              <Route index element={<Dashboard />} />
              <Route path="/transcribe" element={<Input />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
              <Route path="/entries" element={<Entries />} />
              <Route path="/entries/:entryId" element={<EntryEditor />} />

              <Route path="*" element={<div>404</div>} />
            </Route>
          </Routes>
        </HashRouter>
      </ModalsProvider>
    </Provider>
  </React.StrictMode>
);
