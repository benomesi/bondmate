import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { OnboardingProvider } from './components/onboarding/OnboardingContext';
import { AuthProvider } from './components/AuthProvider';
import { setupGlobalErrorHandling } from './lib/errorHandling';
import App from './App';
import './index.css';

// Set up global error handling
setupGlobalErrorHandling();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find root element');
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <OnboardingProvider>
            <App />
          </OnboardingProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);