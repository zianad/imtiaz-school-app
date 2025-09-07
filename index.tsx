
import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Added .tsx extension to ensure module is resolved correctly.
import App from './apps/web/App.tsx';
import { I18nextProvider } from 'react-i18next';
import i18n from './packages/core/i18n';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);
