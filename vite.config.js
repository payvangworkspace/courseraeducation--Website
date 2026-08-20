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
      // Live Swagger API — used when VITE_BASE_URL is empty (same-origin)
      '/apiauth': { target: 'https://api.courseraeducation.com', changeOrigin: true, secure: false },
      '/generate-token': { target: 'https://api.courseraeducation.com', changeOrigin: true, secure: false },
      '/logoutuser': { target: 'https://api.courseraeducation.com', changeOrigin: true, secure: false },
      '/user': { target: 'https://api.courseraeducation.com', changeOrigin: true, secure: false },
      '/payins': { target: 'https://api.courseraeducation.com', changeOrigin: true, secure: false },
      '/transaction': { target: 'https://api.courseraeducation.com', changeOrigin: true, secure: false },
      '/checkout/params': { target: 'https://api.courseraeducation.com', changeOrigin: true, secure: false },
      '/acquirer': { target: 'https://api.courseraeducation.com', changeOrigin: true, secure: false },
      '/apimasters': { target: 'https://api.courseraeducation.com', changeOrigin: true, secure: false },
      '/FeeLimitRule': { target: 'https://api.courseraeducation.com', changeOrigin: true, secure: false },
      '/CryptoConfig': { target: 'https://api.courseraeducation.com', changeOrigin: true, secure: false },
      '/wallet': { target: 'https://api.courseraeducation.com', changeOrigin: true, secure: false },
      '/currency': { target: 'https://api.courseraeducation.com', changeOrigin: true, secure: false },
      '/country': { target: 'https://api.courseraeducation.com', changeOrigin: true, secure: false },
      '/admin': { target: 'https://api.courseraeducation.com', changeOrigin: true, secure: false },
      '/GetEmailMasterList': { target: 'https://api.courseraeducation.com', changeOrigin: true, secure: false },
      '/SaveEmailMaster': { target: 'https://api.courseraeducation.com', changeOrigin: true, secure: false },
      '/UpdateEmailMaster': { target: 'https://api.courseraeducation.com', changeOrigin: true, secure: false },
      '/send-email': { target: 'https://api.courseraeducation.com', changeOrigin: true, secure: false },
      '/payout': { target: 'https://api.courseraeducation.com', changeOrigin: true, secure: false },
      '/api': { target: 'https://api.courseraeducation.com', changeOrigin: true, secure: false },
    },
  },
})