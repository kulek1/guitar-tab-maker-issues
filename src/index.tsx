import React from 'react';
import { createRoot } from 'react-dom/client';
import { ToastProvider } from 'react-toast-notifications';
import './index.css';
import App from './App';

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>,
);
