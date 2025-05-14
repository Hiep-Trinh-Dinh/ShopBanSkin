import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Lấy thư mục gốc
const __dirname = path.resolve(); // Cách này sẽ hoạt động trong Node.js

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Thiết lập alias @ cho thư mục src
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://be-bookingskin.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});