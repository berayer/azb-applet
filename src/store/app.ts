import { defineStore } from 'pinia'
import { Application, ERenderMode } from '@manycore/custom-ksg-viewer-sdk'
import { fetchDesignInfo, fetchKjlId, fetchInfo } from '@/api'
import { showLoadingToast, closeToast, showDialog, showToast } from 'vant'
import { useWebSocket } from '@/hooks/useWebSocket'
import { IS_ORDER_BARCODE } from '@/util'
import { useRoute } from 'vue-router'
import { router } from '@/router'

export const useAppStore = defineStore('AppStore', () => {
  // 当前的订单号
  const orderNo = ref('')
  // 当前的产品名称
  const productName = ref('')


  // 当前是否隐藏门板
  const isHideDoor = ref(false)
  // 当前是否显示户型
  const isShowHouseLayout = ref(false)
  // 当前渲染模式
  const matMode = ref<ERenderMode>(ERenderMode.OUTLINE_WITH_SHADING)
  // 当前爆炸范围
  const bomValue = ref(0)


  // 场景实例
  const sceneApp = ref<Application | null>(null)
  // 相机状态
  const scanStatus = ref(false)
  // 启动扫描函数
  const scanFnc = ref(() => {
    showToast({
      message: "无法调用设备相机",
      position: 'bottom'
    })
  })

  const route = useRoute()

  // 初始化场景
  function initScene(el: HTMLElement) {
    if (!sceneApp.value) {
      sceneApp.value = new Application(el)
      sceneApp.value.selectionService.on(async (ids) => {
        sceneApp.value?.labelService.clearLabel()
        if (ids?.length === 1) {
          const id = ids[0]!.id
          const { name, length, width, height, color } = await fetchInfo(orderNo.value, id)
          if (!name) {
            console.log('未找到该板件信息', orderNo.value, id)
            return
          }
          sceneApp.value?.labelService.addLabel(
            {
              modelId: id,
              text: `${name} ${length}*${width}*${height} ${color}`
            },
            {
              style: {
                color: 'rgba(255, 255, 255, 0.8)',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: '2px'
              }
            }
          )
        }
      })
      window.addEventListener('resize', () => {
        sceneApp.value?.sceneService.resize()
      })
    }
  }

  // 更新场景的爆炸范围
  function bomValueUpdate() {
    sceneApp.value?.modelService.explode({ scale: bomValue.value })
  }

  // 更新场景的门板隐藏
  function hideDoorUpdate() {
    sceneApp.value?.visibilityService.setVisibility(
      (it) => it.prodCatId === 498 || it.prodCatId === 708,
      !isHideDoor.value
    )
  }

  // 更新场景的户型显示
  function houseLayoutUpdate() {
    sceneApp.value?.floorplanService.switchVisibility(isShowHouseLayout.value)
  }

  // 更新场景的渲染模式
  function matModeUpdate() {
    sceneApp.value?.sceneService.config.renderMode.set(matMode.value)
  }

  // 重置视角
  function resetPerspective() {
    sceneApp.value?.sceneService.resetPerspective()
  }

  async function handleValueInput(val: string) {
    if (!IS_ORDER_BARCODE.test(val)) {
      showToast('请输入正确的订单号或条码')
      return
    }
    if (route.fullPath != '/scene') {
      router.push({
        name: 'Scene',
        params: {
          orderNo: val
        }
      })
      return
    }
    const orderNo = val.slice(0, 19)
    const barCode = val.slice(19, 23)
    // 加载订单场景
    // 加载当前的条形码
    await loadByOrderNo(orderNo)
    await loadByBarCode(barCode)
  }

  async function loadByOrderNo(no: string) {
    if (orderNo.value == no) return

    showLoadingToast({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    })

    const { designId, designNo, productName: pName, orderNo: newOrderNo } = await fetchDesignInfo(no)

    if (!newOrderNo) {
      showDialog({
        message: '订单号不存在',
        theme: 'round-button'
      })
      closeToast()
      return
    }

    productName.value = pName
    orderNo.value = newOrderNo

    const topModels = await Manycore.Custom.Order.findTopModelAsync({
      orderId: Number(designNo)
    })

    if (!sceneApp.value) { return }

    sceneApp.value.sceneService.clear()

    await sceneApp.value.sceneService.viewAsync({
      designId: designId,
      modelId: topModels.map((v) => v.topModelId),
      withFloorplan: true
    })

    matModeUpdate()
    hideDoorUpdate()
    bomValueUpdate()
    houseLayoutUpdate()
    resetPerspective()
    closeToast()
  }

  async function loadByBarCode(code: string) {
    if (!code) return
    const { id } = await fetchKjlId(orderNo.value + code)
    if (!id) {
      throw new Error('条形码不存在')
    }
    sceneApp.value?.selectionService.clearSelect()
    sceneApp.value?.selectionService.select([id], true)
  }

  // 通过额外参数获取微信openid当做通信唯一标识, 创建信息中转通道
  Manycore.Miniapp.getUrlExtraParam().then(openid => {
    if (openid) {
      const { scanQRCode } = useWebSocket(openid, handleValueInput)
      scanStatus.value = true
      scanFnc.value = scanQRCode
    } else {
      showToast('请从微信打开小程序')
    }
  })

  return {
    scanStatus,
    scanFnc,
    orderNo,
    productName,
    initScene,
    matModeUpdate,
    matMode,
    isShowHouseLayout,
    houseLayoutUpdate,
    isHideDoor,
    hideDoorUpdate,
    bomValue,
    bomValueUpdate,
    resetPerspective,
    handleValueInput
  }
})
