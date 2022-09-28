import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Routes } from 'react-router-dom';
import './index.css';

import App from './App';
import Input from './views/input/Input';
import Dashboard from './views/dashboard/Dashboard';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="/transcribe" element={<Input />}>
            <Route index element={<Input />} />
            {/* TODO: Replace this with a redux state */}
          </Route>
          <Route path="*" element={<div>404</div>} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
