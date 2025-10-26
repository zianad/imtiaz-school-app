
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './apps/web/App.tsx';
import { LanguageProvider } from './packages/core/i18n.ts';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
