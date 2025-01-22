import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../screens/App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
