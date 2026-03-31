import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.tsx';

// Ignore Vite's WebSocket errors which are expected in this environment
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && (
    (typeof event.reason === 'string' && event.reason.includes('WebSocket')) ||
    (event.reason.message && event.reason.message.includes('WebSocket'))
  )) {
    event.preventDefault();
  }
});

window.addEventListener('error', (event) => {
  if (event.message && event.message.includes('WebSocket')) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
