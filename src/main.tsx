import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';

// Ignore Vite's WebSocket errors which are expected in this environment
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  const message = (typeof reason === 'string' ? reason : reason?.message) || '';
  if (message.toLowerCase().includes('websocket')) {
    event.preventDefault();
    event.stopPropagation();
  }
});

window.addEventListener('error', (event) => {
  const message = event.message || '';
  if (message.toLowerCase().includes('websocket')) {
    event.preventDefault();
    event.stopPropagation();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);
