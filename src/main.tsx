import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ThemeProvider } from './context/ThemeContext';
import { AudioProvider } from './context/AudioContext';
import { CelestialProvider } from './context/CelestialContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <AudioProvider>
          <CelestialProvider>
            <App />
          </CelestialProvider>
        </AudioProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
