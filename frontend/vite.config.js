import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000, // 👈 теперь фронт слушает на 3000
    open: true, // опционально: автоматически открывает браузер
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // 👈 прокси для запросов к backend
        changeOrigin: true,
      },
    },
  },
});
