<script setup lang="ts">
import { useAppStore } from '@/store'
import { todo } from '@/util'
import { Icon } from '@iconify/vue'
import { ERenderMode, ViewType } from '@manycore/custom-ksg-viewer-sdk'
import { NFlex, NInput, NScrollbar, NSlider } from 'naive-ui'
import { Button, CellGroup, Dialog, Field, Form, Picker, Popup, Switch, Tabbar, TabbarItem } from 'vant'
import { ref } from 'vue'

const appStore = useAppStore()
// 底部菜单是否显示
const show = ref(false)
// 材质选择器是否显示
const showPicker = ref(false)
// 输入框值
const inputValue = ref('')
// 是否显示输入框
const showInput = ref(false)
// 渲染模式选项
const renderModelOptions = [
  { text: '材质模式', value: ERenderMode.SHADING },
  { text: '线框模式', value: ERenderMode.OUTLINE_ONLY },
  { text: '材质线框模式', value: ERenderMode.OUTLINE_WITH_SHADING },
  { text: '透明线框模式', value: ERenderMode.TRANSPARENT_LINE },
]
// 渲染模式显示的文本
const renderModeText = ref<string>(renderModelOptions.find(item => item.value === appStore.option.renderMode)?.text || '')
// 渲染模式更新
function onConfirm(event: any) {
  const { selectedOptions } = event
  appStore.option.renderMode = selectedOptions[0]?.value
  renderModeText.value = selectedOptions[0]?.text
  showPicker.value = false
}
// 输入框提交事件
function handleInput(confirm: boolean) {
  // 取消
  if (!inputValue.value)
    return
  if (confirm) {
    appStore.handleInput(inputValue.value)
  }
  inputValue.value = ''
}
// 扫一扫图标点击事件
function clickSR() {
  // 如果有扫描函数则调用
  if (appStore.scanQRCode) {
    appStore.scanQRCode()
  }
  // 否则打开输入框
  else {
    showInput.value = true
  }
}
</script>

<template>
  <!-- 底部菜单栏 -->
  <div class="w-full h-12">
    <Tabbar active-color="#000" inactive-color="#000">
      <TabbarItem @click="todo">
        <template #icon>
          <Icon icon="carbon:renew" />
        </template>
      </TabbarItem>
      <TabbarItem @click="clickSR">
        <template #icon>
          <Icon icon="carbon:scan-alt" />
        </template>
      </TabbarItem>
      <TabbarItem @click="show = true">
        <template #icon>
          <Icon icon="carbon:menu" />
        </template>
      </TabbarItem>
    </Tabbar>
    <!-- 弹出菜单 -->
    <Popup v-model:show="show" round position="bottom" teleport="body">
      <div class="flex w-full flex-col items-center bg-gray-100" @click="show = false">
        <div class="bg-gray-300 h-1 w-12 rounded-md my-3" />
        <Form class="w-full" input-align="right">
          <NScrollbar class="h-[300px]" :size="0">
            <CellGroup inset title="场景配置">
              <Field label="是否隐藏门抽">
                <template #input>
                  <Switch v-model="appStore.option.hideDoor" />
                </template>
              </Field>
              <Field label="是否显示户型">
                <template #input>
                  <Switch v-model="appStore.option.showHouseType" />
                </template>
              </Field>
              <Field label="模型爆炸距离">
                <template #input>
                  <NSlider v-model:value="appStore.option.bomValue" />
                </template>
              </Field>
              <Field
                v-model="renderModeText"
                is-link
                readonly
                name="picker"
                label="场景渲染模式"
                @click="showPicker = true"
              />
              <Field label="相机视角切换">
                <template #input>
                  <NFlex>
                    <Button plain @click="appStore.switchView(ViewType.Left)">
                      左
                    </Button>
                    <Button plain @click="appStore.switchView(ViewType.Front)">
                      前
                    </Button>
                    <Button plain @click="appStore.switchView(ViewType.Top)">
                      顶
                    </Button>
                    <Button plain @click="appStore.switchView(ViewType.Right)">
                      右
                    </Button>
                    <Button plain @click="appStore.switchView(ViewType.Back)">
                      后
                    </Button>
                    <Button plain @click="appStore.switchView(ViewType.Bottom)">
                      底
                    </Button>
                  </NFlex>
                </template>
              </Field>
            </CellGroup>
          </NScrollbar>
        </Form>
      </div>
    </Popup>
    <!-- 材质选择器 -->
    <Popup v-model:show="showPicker" position="bottom">
      <Picker
        :columns="renderModelOptions"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </Popup>
    <!-- 弹出输入框 -->
    <Dialog v-model:show="showInput" title="请输入条码" show-cancel-button @confirm="handleInput(true)" @cancel="handleInput(false)">
      <div class="p-4">
        <NInput v-model:value="inputValue" :bordered="false" size="large" />
      </div>
    </Dialog>
  </div>
</template>
