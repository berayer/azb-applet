<script setup lang="ts">
import type { ConfigProviderThemeVars } from 'vant'

const themeVars: ConfigProviderThemeVars = reactive({
  floatingPanelBackground: '#f7f8fa',
  navBarBackground: '#f0f0f0'
})
</script>

<template>
  <van-config-provider :theme-vars="themeVars">
    <router-view />
    <van-toast />
    <van-dialog />
  </van-config-provider>
</template>
