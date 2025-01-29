export function initPerformanceMonitoring() {
  // Monitor Core Web Vitals
  if ('web-vitals' in window) {
    import('web-vitals').then(({ getCLS, getFID, getLCP }) => {
      getCLS(console.log);
      getFID(console.log);
      getLCP(console.log);
    });
  }

  // Monitor React Performance
  if (process.env.NODE_ENV === 'development') {
    const reportPerformance = (metric: any) => {
      console.log(metric);
    };

    window.addEventListener('load', () => {
      setTimeout(() => {
        const { performance } = window;
        if (performance) {
          const paintMetrics = performance.getEntriesByType('paint');
          paintMetrics.forEach(reportPerformance);
        }
      }, 0);
    });
  }
}

// Monitor memory usage
export function monitorMemoryUsage() {
  if ('performance' in window && 'memory' in performance) {
    setInterval(() => {
      const { usedJSHeapSize, totalJSHeapSize } = (performance as any).memory;
      const usage = (usedJSHeapSize / totalJSHeapSize) * 100;
      
      if (usage > 90) {
        console.warn('High memory usage detected:', usage.toFixed(2) + '%');
      }
    }, 10000);
  }
}