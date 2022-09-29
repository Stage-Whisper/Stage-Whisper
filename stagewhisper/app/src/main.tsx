import React from 'react';
import App from './App';
import ReactDOM from 'react-dom';

// Views
import Dashboard from './views/dashboard/Dashboard';
import Input from './views/input/Input';

// React Router
import { HashRouter, Route, Routes } from 'react-router-dom';

// Redux
import { Provider } from 'react-redux';
import { setupStore } from './redux/store';
import Settings from './views/settings/Settings';
export const store = setupStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <Routes>
          <Route element={<App />}>
            <Route index element={<Dashboard />} />
            <Route path="/transcribe" element={<Input />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<div>404</div>} />
          </Route>
        </Routes>
      </HashRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
