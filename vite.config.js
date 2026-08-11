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
      '/apiauth': {
        target: 'https://api.courseraeducation.com',
        changeOrigin: true,
        secure: false,
      },
      '/generate-token': {
        target: 'https://api.courseraeducation.com',
        changeOrigin: true,
        secure: false,
      },
      '/payins': {
        target: 'https://api.courseraeducation.com',
        changeOrigin: true,
        secure: false,
      },
      '/transaction': {
        target: 'https://api.courseraeducation.com',
        changeOrigin: true,
        secure: false,
      },
      '/checkout/params': {
        target: 'https://api.courseraeducation.com',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'https://api.courseraeducation.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})