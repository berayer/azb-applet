<script setup lang="ts">
import { useAppStore } from '@/store'
import { debounce } from 'es-toolkit'
import { NSpin } from 'naive-ui'
import { onMounted, watch } from 'vue'

const appStore = useAppStore()
watch(() => appStore.hideDoor, () => {
  appStore.hideDoorUpdate()
})

watch(() => appStore.showHouseType, () => {
  appStore.houseLayoutUpdate()
})

watch(() => appStore.bomValue, () => {
  appStore.bomValueUpdate()
})

watch(() => appStore.renderMode, () => {
  appStore.matModeUpdate()
})
onMounted(() => {
  const el = document.querySelector<HTMLElement>('#viewer')!
  // 挂载viewer
  appStore.loadScene(el)
  window.onresize = debounce(() => {
    appStore.scene?.sceneService.resize()
  }, 500)
})
</script>

<template>
  <NSpin class="flex-1" :show="appStore.loading" content-class="h-full w-full" description="加载中...">
    <div id="viewer" class="h-full w-full" />
  </NSpin>
</template>
