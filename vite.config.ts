import { readFileSync } from 'node:fs'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue(), UnoCSS()],
  server: {
    host: '0.0.0.0',
    https: {
      key: readFileSync('./key/172.16.60.83-key.pem'),
      cert: readFileSync('./key/172.16.60.83.pem'),
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
