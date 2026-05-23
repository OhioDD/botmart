import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          solana: ['@solana/web3.js'],
          supabase: ['@supabase/supabase-js'],
          ui: ['lucide-react', 'qrcode.react'],
        },
      },
    },
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
  },
})
