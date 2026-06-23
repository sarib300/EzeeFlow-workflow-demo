import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'motion-vendor'
            if (id.includes('react') || id.includes('scheduler')) return 'react-vendor'
            return 'vendor'
          }
        }
      }
    },
    chunkSizeWarningLimit: 1500,
    assetsInlineLimit: 0  // never inline videos as base64
  }
})