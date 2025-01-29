import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'framer-motion', '@reduxjs/toolkit', 'react-redux'],
          'chat-vendor': ['marked'],
          'utils': ['dompurify', 'openai']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: true,
    modulePreload: {
      polyfill: true
    },
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react', 'framer-motion', 'marked'],
    force: true
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    hmr: {
      clientPort: 443
    }
  },
  preview: {
    port: 5173,
    strictPort: true,
    host: true
  },
  assetsInclude: ['**/*.{png,jpg,gif,svg,webp}']
});