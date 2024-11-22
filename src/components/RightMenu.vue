<script setup lang="ts">
import { useAppStore } from '@/store'
import { IS_ORDER_BARCODE } from '@/util'
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
function submit() {
  if (IS_ORDER_BARCODE.test(value.value)) {
    appStore.scanInput(value.value)
  }
  else {
    window.$message.error('请输入正确的订单号或条码')
  }
  value.value = ''
}
</script>

<template>
  <div class="w-[400px]">
    <NCard title="扫描输入">
      <NFlex vertical>
        <NInput v-model:value="value" placeholder="请输入订单号或条码" :disabled="appStore.loading" @keyup.enter="submit" />
        <NButton ghost type="info" :disabled="appStore.loading" @click="submit">
          提交
        </NButton>
      </NFlex>
    </NCard>
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
          </NFlex>
        </NFormItem>
      </NForm>
    </NCard>
  </div>
</template>
