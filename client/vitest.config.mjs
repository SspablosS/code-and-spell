import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  globals: true,
  environment: 'jsdom',
  setupFiles: [],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
