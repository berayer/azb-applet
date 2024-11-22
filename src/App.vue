<script setup lang="ts">
import type { GlobalThemeOverrides } from 'naive-ui'
import { useWindowSize } from '@vueuse/core'
import { dateZhCN, NConfigProvider, zhCN } from 'naive-ui'
import { computed } from 'vue'
import BottomMenu from './components/BottomMenu.vue'
import NaiveProvider from './components/NaiveProvider.vue'
import OrderScene from './components/OrderScene.vue'
import RightMenu from './components/RightMenu.vue'
import { useAppStore } from './store'

const appStore = useAppStore()
const themeOverrides: GlobalThemeOverrides = {
  Scrollbar: {
    color: '#fff00',
  },
}
const { width, height } = useWindowSize()
const aspect_ratio = computed(() => width.value / height.value)
</script>

<template>
  <NConfigProvider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="themeOverrides">
    <NaiveProvider>
      <div class="h-screen w-screen flex" :class="{ 'flex-col': aspect_ratio < 1 }">
        <div class="flex-1 flex flex-col">
          <div class="h-12 bg-[#f0f0f0] w-full flex justify-between items-center px-4 text-lg font-600 color-blueGray-8">
            <span>{{ appStore.productName }}</span>
            <span>{{ appStore.orderNo }}</span>
          </div>
          <OrderScene />
        </div>
        <RightMenu v-if="aspect_ratio > 1" />
        <BottomMenu v-else />
      </div>
    </NaiveProvider>
  </NConfigProvider>
</template>
