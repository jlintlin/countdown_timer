/**
 * Countdown Timer Application - Vite Configuration
 * Author: Jie Lin, Ph.D.
 * Copyright © 2025 TLIN INVESTMENTS LLC
 * All Rights Reserved.
 */

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost', // Restrict to localhost only (no network exposure)
    port: Number.parseInt(process.env.VITE_PORT || '5173'), // Use dynamic port from environment
    strictPort: false, // Allow Vite to use a different port if the specified port is taken
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: 'dist',
  },
  test: {
    globals: false,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'json-summary'],
    },
  },
})
