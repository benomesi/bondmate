interface MemoryUsage {
  totalJSHeapSize: number;
  usedJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export class MemoryManager {
  private static instance: MemoryManager;
  private readonly MEMORY_THRESHOLD = 0.9; // 90% usage threshold
  private readonly CHECK_INTERVAL = 30000; // Check every 30 seconds

  private constructor() {
    this.startMonitoring();
  }

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  private startMonitoring(): void {
    setInterval(() => {
      const usage = this.getMemoryUsage();
      if (usage && this.isMemoryHigh(usage)) {
        this.handleHighMemory();
      }
    }, this.CHECK_INTERVAL);
  }

  private getMemoryUsage(): MemoryUsage | null {
    if ('performance' in window && 'memory' in performance) {
      return (performance as any).memory;
    }
    return null;
  }

  private isMemoryHigh(usage: MemoryUsage): boolean {
    return usage.usedJSHeapSize / usage.jsHeapSizeLimit > this.MEMORY_THRESHOLD;
  }

  private handleHighMemory(): void {
    // Clear old contexts
    const contextManager = (window as any).contextManager;
    if (contextManager) {
      Object.keys(contextManager.contexts).forEach(relationshipId => {
        const context = contextManager.getContext(relationshipId);
        if (context && Date.now() - context.lastInteractionTime > 3600000) { // 1 hour
          contextManager.clearContext(relationshipId);
        }
      });
    }

    // Clear message cache older than 1 hour
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          if (cacheName.startsWith('messages-')) {
            caches.delete(cacheName);
          }
        });
      });
    }

    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }
  }

  clearOldContexts(): void {
    const contextManager = (window as any).contextManager;
    if (contextManager) {
      Object.keys(contextManager.contexts).forEach(relationshipId => {
        contextManager.clearContext(relationshipId);
      });
    }
  }
}

export const memoryManager = MemoryManager.getInstance();