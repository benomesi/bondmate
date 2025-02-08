import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { OnboardingProvider } from './components/onboarding/OnboardingContext';
import { AuthProvider } from './components/AuthProvider';
import { setupGlobalErrorHandling } from './lib/errorHandling';
import TagManager from 'react-gtm-module';
import { PostHogProvider} from 'posthog-js/react'
import ReactPixel from 'react-facebook-pixel'
import App from './App';
import './index.css';

// Set up global error handling
setupGlobalErrorHandling();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find root element');
}

// Initialize Google Tag Manager
const tagManagerArgs = {
  gtmId: import.meta.env.VITE_GOOGLE_TAG
};
const ph_options = {
    api_host: import.meta.env.VITE_POSTHOG_HOST,
}

const fb_pixel_options = {
    autoConfig: true,
    debug: true
    };

const root = createRoot(rootElement);
TagManager.initialize(tagManagerArgs);
ReactPixel.init(import.meta.env.VITE_META_PIXEL_ID, undefined, fb_pixel_options);
ReactPixel.pageView()

root.render(
  <React.StrictMode>
  <PostHogProvider 
      apiKey={import.meta.env.VITE_POSTHOG_KEY}
      options={ph_options}
    >
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <OnboardingProvider>
            <App />
          </OnboardingProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
    </PostHogProvider>
  </React.StrictMode>
);
