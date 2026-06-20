import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Growth-Tree-v1/',
  test: {
    environment: 'jsdom',
    globals: true
  }
})
