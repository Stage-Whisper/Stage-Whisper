import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Routes } from 'react-router-dom';
import './index.css';

import App from './App';
import Input from './views/input/Input';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Input />} />
        </Route>
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
