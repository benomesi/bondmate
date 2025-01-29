// Global error handler setup
export function setupGlobalErrorHandling() {
  // Track errors with Meta Pixel
  function trackError(type: string, error: any) {
    try {
      if ((window as any).fbq) {
        (window as any).fbq('trackCustom', 'ErrorOccurred', {
          error_type: type,
          error_message: error?.message || 'Unknown error',
          location: window.location.pathname,
          stack: error?.stack,
          timestamp: new Date().toISOString()
        });
      }
    } catch (e) {
      console.error('Error tracking failed:', e);
    }
  }

  // Handle uncaught promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    // Ignore certain errors
    if (shouldIgnoreError(event.reason)) {
      event.preventDefault();
      return;
    }

    console.error('Unhandled promise rejection:', event.reason);
    trackError('UnhandledRejection', event.reason);
  });

  // Handle runtime errors
  window.addEventListener('error', (event) => {
    // Ignore certain errors
    if (shouldIgnoreError(event.error)) {
      event.preventDefault();
      return;
    }

    console.error('Runtime error:', event.error);
    trackError('RuntimeError', event.error);
  });

  // Helper to determine if an error should be ignored
  function shouldIgnoreError(error: any): boolean {
    const ignoredPatterns = [
      'WebSocket connection',
      'Script error',
      'ResizeObserver loop',
      'Network request failed',
      'Failed to fetch',
      'Invalid API key',
      'fbq is not defined',
      'FB is not defined',
      'gtag is not defined'
    ];

    const errorString = String(error?.message || error);
    return ignoredPatterns.some(pattern => errorString.includes(pattern));
  }
}