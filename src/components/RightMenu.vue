<script setup lang="ts">
import { useAppStore } from '@/store'
import { ERenderMode, ViewType } from '@manycore/custom-ksg-viewer-sdk'
import { NButton, NCard, NFlex, NForm, NFormItem, NInput, NSelect, NSlider, NSwitch } from 'naive-ui'
import { ref } from 'vue'

const appStore = useAppStore()
// 输入框的值
const inputValue = ref('')
// 渲染模式选项
const renderModelOptions = [
  { label: '材质模式', value: ERenderMode.SHADING },
  { label: '线框模式', value: ERenderMode.OUTLINE_ONLY },
  { label: '材质线框模式', value: ERenderMode.OUTLINE_WITH_SHADING },
  { label: '透明线框模式', value: ERenderMode.TRANSPARENT_LINE },
]
// 输入提交
function submit() {
  appStore.handleInput(inputValue.value)
  inputValue.value = ''
}
</script>

<template>
  <div class="w-[400px]">
    <NCard title="扫描输入">
      <NFlex vertical>
        <NInput v-model:value="inputValue" placeholder="请输入订单号或条码" :disabled="appStore.state.loading" @keyup.enter="submit" />
        <NButton ghost type="info" :disabled="appStore.state.loading" @click="submit">
          提交
        </NButton>
      </NFlex>
    </NCard>
    <NCard title="场景配置">
      <NForm label-placement="left" label-width="auto">
        <NFormItem label="是否隐藏门抽">
          <NSwitch v-model:value="appStore.option.hideDoor" />
        </NFormItem>

        <NFormItem label="是否显示户型">
          <NSwitch v-model:value="appStore.option.showHouseType" />
        </NFormItem>

        <NFormItem label="模型爆炸距离">
          <NSlider v-model:value="appStore.option.bomValue" />
        </NFormItem>

        <NFormItem label="场景渲染模式">
          <NSelect v-model:value="appStore.option.renderMode" :options="renderModelOptions" />
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
          </NFlex>
        </NFormItem>
      </NForm>
    </NCard>
  </div>
</template>
