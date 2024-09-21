import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from '@/store'
import { setupRouter } from './router'

import 'virtual:uno.css'
import '@manycore/miniapp-sdk' // 酷家乐SDK
import '@vant/touch-emulator';

async function setupApp() {
  const app = createApp(App)
  setupStore(app)
  await setupRouter(app)
  app.mount('#app')
}

setupApp()
