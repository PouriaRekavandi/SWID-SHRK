import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ThemeProvider } from './context/ThemeContext';
import { CelestialProvider } from './context/CelestialContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <CelestialProvider>
        <App />
      </CelestialProvider>
    </ThemeProvider>
  </React.StrictMode>
);
