import type { App } from 'vue'
import { createPinia } from 'pinia'

/** [安装vue状态管理插件：pinia] */
export function setupStore(app: App) {
  const pinia = createPinia()
  app.use(pinia)
}

export * from './app'
