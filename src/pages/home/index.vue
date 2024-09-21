<script setup lang="ts">
import { useAppStore } from '@/store'

const version = import.meta.env.VITE_APP_VERSION
const appStore = useAppStore()
</script>

<template>
  <div class="h-screen w-screen flex flex-col justify-center items-center bg-gray-2">
    <div class="py-4">
      <span class="text-[24px] font-600">模型展示小程序</span>
      <van-tag type="success">v{{ version }}</van-tag>
    </div>
    <van-button round icon="scan" type="primary" class="w-[85vw]" @click="appStore.scanFnc">扫一扫</van-button>
  </div>
</template>
