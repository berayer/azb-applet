import type { ViewType } from '@manycore/custom-ksg-viewer-sdk'
import { fetchDesignInfo, fetchInfo, fetchKjlId } from '@/api'
import { useWebSocket } from '@/hooks'
import { IS_ORDER_BARCODE } from '@/util'
import { Application, ERenderMode } from '@manycore/custom-ksg-viewer-sdk'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useAppStore = defineStore('appStore', () => {
  const sceneRef = ref<Application | undefined>()
  const scanQRCode = ref<() => void | undefined>()

  const state = {
    // 场景加载中
    loading: false,
    // 微信Id
    openId: '',
    // 场景是否初始化
    load: false,
  }

  const option = {
    // 是否隐藏门抽
    hideDoor: false,
    // 是否显示户型
    showHouseType: false,
    // 模型爆炸值
    bomValue: 0,
    // 渲染模式
    renderMode: ERenderMode.OUTLINE_WITH_SHADING,
  }

  const order = reactive({
    // 订单号
    orderNo: '',
    // 产品名称
    productName: '',
  })

  // 初始化场景
  async function initScene(el: HTMLElement) {
    // 场景已存在则跳过
    if (sceneRef.value)
      return
    sceneRef.value = new Application(el)
    // 场景禁止平移
    sceneRef.value.sceneService.config.interaction.pan.enabled.set(false)
    // 场景禁止缩放
    // sceneRef.value.sceneService.config.interaction.zoom.enabled.set(false)
    // 监听场景中板件选中事件
    sceneRef.value.selectionService.on(async (ids) => {
      // 清除场景中标签
      sceneRef.value?.labelService.clearLabel()
      if (ids.length === 1) {
        const id = ids[0]!.id
        // 通过酷家乐id获取板件信息
        const { name, length, width, height, color } = await fetchInfo(order.orderNo, id)
        if (!name) {
          console.log('未找到该板件信息', order.orderNo, id)
          return
        }
        // 场景中渲染标签
        sceneRef.value?.labelService.addLabel({
          modelId: id,
          text: `${name} ${length}*${width}*${height} ${color}`,
        }, {
          style: {
            color: 'rgba(255, 255, 255, 0.8)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: '2px',
          },
        })
      }
    })

    // 获取外部参数
    // 1. 空白则手动输入
    // 2. 微信id则通过扫描输入
    // 3. 条码号则通过页面跳转输入 ps: 大概率是ios
    const params = await Manycore.Miniapp.getUrlExtraParam() || ''
    if (!params)
      return
    if (IS_ORDER_BARCODE.test(params)) {
      // todo 加载这个条码
    }
    else {
      const { scanQRCode: sc } = useWebSocket(`${params}:KJL`, (code) => {
        if (code)
          handleInput(code.replace(/["']/g, ''))
      })
      scanQRCode.value = sc
    }
  }

  // 处理订单号及条码的扫描
  async function handleInput(val: string) {
    if (IS_ORDER_BARCODE.test(val)) {
      const no = val.slice(0, 19)
      const bar = val.slice(19)
      // 订单号不一样, 先加载场景
      if (order.orderNo !== no) {
        await loadOrderNo(no)
      }
      // 订单号一样, 高亮板件
      if (order.orderNo === no && bar) {
        await loadBarCode(order.orderNo + bar)
      }
    }
    else {
      window.$message.error(`请输入正确的订单号或条码: ${val}`)
    }
  }

  async function loadOrderNo(orderNo: string) {
    // 场景加载loading
    state.loading = true
    try {
      // 判断场景
      if (sceneRef.value) {
        window.$message.error('场景不存在')
        return
      }
      // 获取订单信息
      const { designId, designNo, orderNo: newOrderNo, productName } = await fetchDesignInfo(orderNo)
      if (!newOrderNo) {
        window.$message.error('订单号不存在')
        return
      }
      // 获取场景topModesId
      const topModels = await Manycore.Custom.Order.findTopModelAsync({
        orderId: Number(designNo),
      })
      // 实际加载场景
      sceneRef.value!.sceneService.clear()
      await sceneRef.value!.sceneService.viewAsync({
        designId,
        modelId: topModels.map(v => v.topModelId),
        withFloorplan: true,
      })
      // 订单加载后, 初始化各种参数
      state.load = true
      renderModeUpdate()
      hideDoorUpdate()
      bomValueUpdate()
      houseLayoutUpdate()
      resetPerspective()
      order.orderNo = orderNo
      order.productName = productName
      console.log('场景加载完成', orderNo)
    }
    finally {
      state.loading = false
    }
  }

  async function loadBarCode(barCode: string) {
    // 查询板件的酷家乐Id
    const { id } = await fetchKjlId(barCode)
    if (!id) {
      window.$message.error('条码不存在')
      return
    }
    // 选中板件
    await sceneRef.value?.selectionService.select([id])
    // 高亮板件
    await sceneRef.value?.highlightService.highlight([{ id, color: '#f8ff8c', opacity: 0.4 }], true)
  }

  // 更新场景的爆炸范围
  function bomValueUpdate() {
    if (state.load) {
      sceneRef.value?.modelService.explode({ scale: option.bomValue })
    }
  }

  // 更新场景的门板隐藏
  function hideDoorUpdate() {
    if (state.load) {
      sceneRef.value?.visibilityService.setVisibility(
        it => it.prodCatId === 498 || it.prodCatId === 708,
        !option.hideDoor,
      )
    }
  }

  // 更新场景的户型显示
  function houseLayoutUpdate() {
    if (state.load) {
      sceneRef.value?.floorplanService.switchVisibility(option.showHouseType)
    }
  }

  // 更新场景的渲染模式
  function renderModeUpdate() {
    if (state.load) {
      sceneRef.value?.sceneService.config.renderMode.set(option.renderMode)
    }
  }

  // 重置视角
  function resetPerspective() {
    if (state.load) {
      sceneRef.value?.sceneService.resetPerspective()
    }
  }
  // 视角切换
  function switchView(type: ViewType) {
    if (state.load) {
      sceneRef.value?.cameraService.switchView(type)
    }
  }

  return {
    initScene,
    switchView,
    resetPerspective,
    option,
    renderModeUpdate,
    houseLayoutUpdate,
    hideDoorUpdate,
    bomValueUpdate,
    handleInput,
    state,
    order,
    scanQRCode,
  }
})
