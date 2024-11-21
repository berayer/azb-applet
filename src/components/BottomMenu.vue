<script setup lang="ts">
import { useAppStore } from '@/store'
import { Icon } from '@iconify/vue'
import { ERenderMode, ViewType } from '@manycore/custom-ksg-viewer-sdk'
import { NFlex, NInput, NScrollbar, NSlider } from 'naive-ui'
import { Button, CellGroup, Dialog, Field, Form, Picker, Popup, Switch, Tabbar, TabbarItem } from 'vant'
import { ref } from 'vue'

const appStore = useAppStore()
const show = ref(false)
const showPicker = ref(false)
const inputValue = ref('')
const renderModelOptions = [
  { text: '材质模式', value: ERenderMode.SHADING },
  { text: '线框模式', value: ERenderMode.OUTLINE_ONLY },
  { text: '材质线框模式', value: ERenderMode.OUTLINE_WITH_SHADING },
  { text: '透明线框模式', value: ERenderMode.TRANSPARENT_LINE },
]
const renderModeText = ref<string>(renderModelOptions.find(item => item.value === appStore.renderMode)?.text || '')
function onConfirm(event: any) {
  const { selectedOptions } = event
  appStore.renderMode = selectedOptions[0]?.value
  renderModeText.value = selectedOptions[0]?.text
  showPicker.value = false
}
const showInput = ref(false)
function todo() {
  window.$message.info('功能开发中，敬请期待')
}
function handleInput(confirm: boolean) {
  if (!inputValue.value)
    return
  if (confirm) {
    appStore.loadOrder(inputValue.value)
  }
  inputValue.value = ''
}
function closeMenu() {
  show.value = false
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
      <TabbarItem @click="showInput = true">
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
    <Popup v-model:show="show" round position="bottom" teleport="body">
      <div class="flex w-full flex-col items-center bg-gray-100" @click="closeMenu">
        <div class="bg-gray-300 h-1 w-12 rounded-md my-3" />
        <Form class="w-full" input-align="right">
          <NScrollbar class="h-[300px]" :size="0">
            <CellGroup inset title="场景配置">
              <Field label="是否隐藏门抽">
                <template #input>
                  <Switch v-model="appStore.hideDoor" />
                </template>
              </Field>
              <Field label="是否显示户型">
                <template #input>
                  <Switch v-model="appStore.showHouseType" />
                </template>
              </Field>
              <Field label="模型爆炸距离">
                <template #input>
                  <NSlider v-model:value="appStore.bomValue" />
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
    <Popup v-model:show="showPicker" position="bottom">
      <Picker
        :columns="renderModelOptions"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </Popup>
    <Dialog v-model:show="showInput" title="请输入条码" show-cancel-button @confirm="handleInput(true)" @cancel="handleInput(false)">
      <div class="p-4">
        <NInput v-model:value="inputValue" :bordered="false" size="large" />
      </div>
    </Dialog>
  </div>
</template>
