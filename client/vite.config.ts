import path from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Только для локальной разработки; в production запросы идут на /api через nginx
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
