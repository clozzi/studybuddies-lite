import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    cors: true,
    proxy: {
      "/api": "http://localhost:5555/"
    },
    '/socket.io': {
      target: 'ws://localhost:5555',
      ws: true,
    }
  },
})
