import { createApp } from 'vue'

import App from './App.vue'
import { setupStore } from './store'
import '@manycore/miniapp-sdk'
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'
import 'vant/lib/index.css'
// 桌面端适配
import '@vant/touch-emulator'
import 'vfonts/FiraCode.css'

async function setupApp() {
  const app = createApp(App)
  setupStore(app)
  app.mount('#app')
}

setupApp()
