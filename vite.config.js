import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      // Only proxy the API path — NOT /checkout/:orderId (that is the React page)
      '/checkout/params': {
        target: 'https://api.courseraeducation.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})