import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    /** api自动导入 */
    AutoImport({
      imports: ['vue'],
      dts: 'src/types/auto-import.d.ts',
      resolvers: [VantResolver()]
    }),
    /** 组件自动导入 */
    Components({
      dts: 'src/types/components.d.ts',
      resolvers: [VantResolver()]
    }),
    UnoCSS()
  ],
  base: './',
  server: {
    host: '172.16.60.83',
    port: 8888
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./', import.meta.url))
    }
  }
})
