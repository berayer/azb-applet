import { App } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/pages/home/index.vue')
    },
    {
      path: '/scene',
      name: 'Scene',
      component: () => import('@/pages/scene/index.vue')
    }
  ]
})

async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}

export { router, setupRouter }
