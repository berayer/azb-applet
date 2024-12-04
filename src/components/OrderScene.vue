<script setup lang="ts">
import { useAppStore } from '@/store'
import { NSpin } from 'naive-ui'
import { onMounted, watch } from 'vue'

const appStore = useAppStore()
watch(() => appStore.option.hideDoor, () => {
  appStore.hideDoorUpdate()
})

watch(() => appStore.option.showHouseType, () => {
  appStore.houseLayoutUpdate()
})

watch(() => appStore.option.bomValue, () => {
  appStore.bomValueUpdate()
})

watch(() => appStore.option.renderMode, () => {
  appStore.renderModeUpdate()
})
onMounted(() => {
  const el = document.querySelector<HTMLElement>('#viewer')!
  // 挂载viewer
  appStore.initScene(el)
})
</script>

<template>
  <NSpin class="flex-1" :show="appStore.state.loading" content-class="h-full w-full" description="加载中...">
    <div id="viewer" class="h-full w-full" />
  </NSpin>
</template>
