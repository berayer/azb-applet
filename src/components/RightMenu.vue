<script setup lang="ts">
import { useAppStore } from '@/store'
import { ERenderMode, ViewType } from '@manycore/custom-ksg-viewer-sdk'
import { NButton, NCard, NFlex, NForm, NFormItem, NInput, NSelect, NSlider, NSwitch } from 'naive-ui'
import { ref } from 'vue'

const appStore = useAppStore()
const renderModelOptions = [
  { label: '材质模式', value: ERenderMode.SHADING },
  { label: '线框模式', value: ERenderMode.OUTLINE_ONLY },
  { label: '材质线框模式', value: ERenderMode.OUTLINE_WITH_SHADING },
  { label: '透明线框模式', value: ERenderMode.TRANSPARENT_LINE },
]

// test
const value = ref('')
function test() {
  appStore.loadOrder(value.value)
}
</script>

<template>
  <div class="w-[400px]">
    <NCard title="场景配置">
      <NForm label-placement="left" label-width="auto">
        <NFormItem label="是否隐藏门抽">
          <NSwitch v-model:value="appStore.hideDoor" />
        </NFormItem>

        <NFormItem label="是否显示户型">
          <NSwitch v-model:value="appStore.showHouseType" />
        </NFormItem>

        <NFormItem label="模型爆炸距离">
          <NSlider v-model:value="appStore.bomValue" />
        </NFormItem>

        <NFormItem label="场景渲染模式">
          <NSelect v-model:value="appStore.renderMode" :options="renderModelOptions" />
        </NFormItem>

        <NFormItem label="相机视角切换">
          <NFlex>
            <NButton :focusable="false" @click="appStore.switchView(ViewType.Left)">
              左视图
            </NButton>
            <NButton :focusable="false" @click="appStore.switchView(ViewType.Front)">
              前视图
            </NButton>
            <NButton :focusable="false" @click="appStore.switchView(ViewType.Top)">
              顶视图
            </NButton>
            <NButton :focusable="false" @click="appStore.switchView(ViewType.Right)">
              右视图
            </NButton>
            <NButton :focusable="false" @click="appStore.switchView(ViewType.Back)">
              后视图
            </NButton>
            <NButton :focusable="false" @click="appStore.switchView(ViewType.Bottom)">
              底视图
            </NButton>
          </NFlex>Python?33578
        </NFormItem>

        <NFormItem label="模型快捷操作">
          <NFlex>
            <NButton :focusable="false">
              重置视角
            </NButton>
            <NButton :focusable="false">
              隐藏选中模型
            </NButton>
            <NButton :focusable="false">
              显示所有模型
            </NButton>
          </NFlex>
        </NFormItem>

        <NFormItem label="action">
          <NInput v-model:value="value" />
          <NButton @click="test">
            测试
          </NButton>
        </NFormItem>
      </NForm>
    </NCard>
  </div>
</template>
