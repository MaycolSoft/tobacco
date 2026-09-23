import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import seoPlugin from './plugins/seoPlugin.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), seoPlugin(loadEnv(mode, process.cwd(), 'VITE_').VITE_SITE_URL)],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@store': path.resolve(__dirname, './src/store'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@components': path.resolve(__dirname, './src/components'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@assets': path.resolve(__dirname, './src/assets')
    }
  },
  server: {
    open: true, // Esto abrirá el navegador predeterminado
    port: 3000,
  },
}))
