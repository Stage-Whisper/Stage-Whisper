// Redux
import {Provider} from 'react-redux';
import {setupStore} from './redux/store';

// Packages
import * as ReactDOM from 'react-dom/client';
import {ModalsProvider} from '@mantine/modals';

export const store = setupStore();

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
