import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://api.dev.schoolmoney.gratify.com.pl',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'https://api.dev.schoolmoney.gratify.com.pl',
        changeOrigin: true,
        secure: false,
      },
      '/csrf': {
        target: 'https://api.dev.schoolmoney.gratify.com.pl',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
