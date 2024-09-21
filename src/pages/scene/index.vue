<script setup lang="ts">
import { useAppStore } from '@/store'
import type { ActionSheetAction } from 'vant'
import { ERenderMode } from '@manycore/custom-ksg-viewer-sdk'
import { useRoute } from 'vue-router'

const route = useRoute()
const appStore = useAppStore()
onMounted(() => {
  appStore.initScene(document.getElementById('core-scene')!)
  const no = route.params.orderNo as string | ''
  if (no) {
    appStore.handleValueInput(no)
  }
})

// 底部菜单属性设置
const floating_panel_anchors = [50, Math.round(0.4 * window.innerHeight)]
const floating_panel_height = ref(floating_panel_anchors[0])

// 材质模式选择
const matModeName = ref('材质线框模式')
const showPicker = ref(false)
const popup_columns: ActionSheetAction[] = [
  { name: '材质模式', callback: (it) => popup_onConfirm(ERenderMode.SHADING, it.name) },
  { name: '线框模式', callback: (it) => popup_onConfirm(ERenderMode.OUTLINE_ONLY, it.name) },
  { name: '材质线框模式', callback: (it) => popup_onConfirm(ERenderMode.OUTLINE_WITH_SHADING, it.name) },
  { name: '透明线框模式', callback: (it) => popup_onConfirm(ERenderMode.TRANSPARENT_LINE, it.name) }
]
function popup_onConfirm(mode: ERenderMode, name: string = '') {
  matModeName.value = name
  appStore.matMode = mode
  appStore.matModeUpdate()
  showPicker.value = false
}
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center">
    <!--  顶部标题栏目  -->
    <van-nav-bar :title="appStore.productName"></van-nav-bar>
    <!--  场景渲染容器  -->
    <div class="flex-1" id="core-scene"></div>
    <!--  扫一扫浮动按钮  -->
    <van-floating-bubble icon="scan" axis="xy" magnetic="x" @click="appStore.scanFnc" />
    <!--  底部功能菜单  -->
    <van-floating-panel v-model:height="floating_panel_height" :anchors="floating_panel_anchors">
      <van-form class="p-t-[15px]">
        <van-cell-group inset>
          <van-field label="爆炸范围">
            <template #input>
              <van-slider v-model="appStore.bomValue" @update:model-value="appStore.bomValueUpdate" />
            </template>
          </van-field>
          <van-field label="隐藏门抽" input-align="right">
            <template #input>
              <van-switch v-model="appStore.isHideDoor" @update:model-value="appStore.hideDoorUpdate" />
            </template>
          </van-field>
          <van-field label="显示户型" input-align="right">
            <template #input>
              <van-switch v-model="appStore.isShowHouseLayout" @update:model-value="appStore.houseLayoutUpdate" />
            </template>
          </van-field>
          <van-field
            v-model="matModeName"
            is-link
            readonly
            name="picker"
            label="渲染模式"
            @click="showPicker = true"
            input-align="right"
          />
        </van-cell-group>
      </van-form>
    </van-floating-panel>
    <!--  材质选择弹出  -->
    <van-action-sheet v-model:show="showPicker" :actions="popup_columns" />
  </div>
</template>
