import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Routes } from 'react-router-dom';
import './index.css';

import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
