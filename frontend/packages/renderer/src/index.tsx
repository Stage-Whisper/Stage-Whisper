import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
// import App from './App';
// // Views
// import Dashboard from './features/dashboard/Dashboard';
// import Input from './features/input/Input';

// // React Router
// import {HashRouter, Route, Routes} from 'react-router-dom';

// // Redux
import {Provider} from 'react-redux';
import {setupStore} from './redux/store';

// import About from './features/about/About';
// import Entries from './features/entries/EntryList';
// import EntryEditor from './features/entries/editor/EntryEditor';
// import Settings from './features/settings/Settings';
import {ModalsProvider} from '@mantine/modals';

export const store = setupStore();
import type {api} from '../../preload/src/api';

import type {ipcRenderer} from 'electron/renderer';
declare global {
  interface Window {
    Main: typeof api;
    ipcRenderer: typeof ipcRenderer;
  }
}

// Convert from ReactDOM.render to createRoot
import {AppRoutes} from './routes';
// const rootElement = document.getElementById('root') as Element;
const root = ReactDOM.createRoot(document.getElementById('app') as Element);
root.render(
  <Provider store={store}>
    <ModalsProvider>
      <AppRoutes />
    </ModalsProvider>
  </Provider>,
);
// <Provider store={store}>
//   <ModalsProvider>
//     <HashRouter>
//       <Routes>
//         <Route element={<App />}>
//           <Route
//             index
//             element={<Dashboard />}
//           />
//           <Route
//             path="/transcribe"
//             element={<Input />}
//           />
//           <Route
//             path="/settings"
//             element={<Settings />}
//           />
//           <Route
//             path="/about"
//             element={<About />}
//           />
//           <Route
//             path="/entries"
//             element={<Entries />}
//           />
//           <Route
//             path="/entries/:entryUUID"
//             element={<EntryEditor />}
//           />

//           <Route
//             path="*"
//             element={<div>404</div>}
//           />
//         </Route>
//       </Routes>
//     </HashRouter>
//   </ModalsProvider>
// </Provider>,

// ReactDOM.createRoot(document.querySelector('app') as HTMLElement).render(
//   <Provider store={store}>
//     <ModalsProvider>
//       <AppRoutes />
//     </ModalsProvider>
//   </Provider>,
// );
