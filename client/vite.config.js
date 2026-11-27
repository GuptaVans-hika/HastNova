import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development the browser calls /api on the Vite server, which forwards to Express.
// Same origin -> no CORS issues, and the API keys never leave the server.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://localhost:5000',
        changeOrigin: true,
        xfwd: true, // pass the real client IP so server rate limits are per user
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // keep the big charting library in its own file so pages load faster on phones
        manualChunks: { recharts: ['recharts'], react: ['react', 'react-dom', 'react-router-dom'] },
      },
    },
  },
});
