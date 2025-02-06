import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../screens/App';
import { ElectronWindowContext } from '../screens/WindowRootTypes';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// <ElectronWindowContext.Provider
//   value={window.electron.platform.appPlatform()}
// >
//   <App />
// </ElectronWindowContext.Provider>,
