import type { ViewType } from '@manycore/custom-ksg-viewer-sdk'
import { fetchDesignInfo, fetchInfo, fetchKjlId } from '@/api'
import { Application, ERenderMode } from '@manycore/custom-ksg-viewer-sdk'
import { defineStore } from 'pinia'

interface AppSotre {
  scene?: Application
  /** 场景是否已经加载 */
  load: boolean
  loading: boolean

  /** 是否隐藏门抽 */
  hideDoor: boolean
  /** 是否显示户型 */
  showHouseType: boolean
  /** 模型爆炸距离 */
  bomValue: number
  /** 场景的渲染模式 */
  renderMode: ERenderMode

  /** 当前加载的订单号 */
  orderNo: string
  /** 产品名称 */
  productName: string
}

export const useAppStore = defineStore('appStore', {
  state: (): AppSotre => ({
    load: false,
    hideDoor: false,
    showHouseType: false,
    bomValue: 0,
    renderMode: ERenderMode.OUTLINE_WITH_SHADING,
    orderNo: '',
    loading: false,
    productName: '还未加载订单',
  }),
  actions: {
    /** 挂载场景 */
    loadScene(el: HTMLElement) {
      if (this.scene)
        return
      this.scene = new Application(el)
      this.scene.sceneService.config.interaction.pan.enabled.set(false)
      this.scene.sceneService.config.interaction.zoom.enabled.set(false)
      this.scene.selectionService.on(async (ids) => {
        this.scene?.labelService.clearLabel()
        if (ids?.length === 1) {
          const id = ids[0]!.id
          const { name, length, width, height, color } = await fetchInfo(this.orderNo, id)
          if (!name) {
            console.log('未找到该板件信息', this.orderNo, id)
            return
          }
          this.scene?.labelService.addLabel(
            {
              modelId: id,
              text: `${name} ${length}*${width}*${height} ${color}`,
            },
            {
              style: {
                color: 'rgba(255, 255, 255, 0.8)',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: '2px',
              },
            },
          )
        }
      })
      // this.scene.sceneService.config.interaction.rotation.enabled.set(false);
    },
    async loadOrder(orderNo: string) {
      this.loading = true
      try {
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

        if (!this.scene) {
          window.$message.error('场景不存在')
          return
        }
        this.scene?.sceneService.clear()
        // 实际加载场景
        await this.scene?.sceneService.viewAsync({
          designId,
          modelId: topModels.map(v => v.topModelId),
          withFloorplan: true,
        })

        this.load = true
        this.matModeUpdate()
        this.hideDoorUpdate()
        this.bomValueUpdate()
        this.houseLayoutUpdate()
        this.resetPerspective()
        this.orderNo = orderNo
        this.productName = productName
        console.log('loadOrder done')
      }
      finally {
        this.loading = false
      }
    },
    async loadBarCode(barCode: string) {
      const { id } = await fetchKjlId(this.orderNo + barCode)
      if (!id) {
        window.$message.error('条码不存在')
        return
      }
      await this.scene?.selectionService.select([id])
      await this.scene?.highlightService.highlight([{ id, color: '#f8ff8c', opacity: 0.4 }], true)
    },
    async scanInput(val: string) {
      const no = val.slice(0, 19)
      const bar = val.slice(19)
      if (this.orderNo !== no) {
        await this.loadOrder(no)
      }

      // 选中板件
      if (this.orderNo === no && bar) {
        // todo
        await this.loadBarCode(bar)
      }
    },
    // 更新场景的爆炸范围
    bomValueUpdate() {
      if (this.scene && this.load) {
        this.scene.modelService.explode({ scale: this.bomValue })
      }
    },

    // 更新场景的门板隐藏
    hideDoorUpdate() {
      if (this.scene && this.load) {
        this.scene.visibilityService.setVisibility(
          it => it.prodCatId === 498 || it.prodCatId === 708,
          !this.hideDoor,
        )
      }
    },

    // 更新场景的户型显示
    houseLayoutUpdate() {
      if (this.scene && this.load) {
        this.scene.floorplanService.switchVisibility(this.showHouseType)
      }
    },

    // 更新场景的渲染模式
    matModeUpdate() {
      if (this.scene && this.load) {
        this.scene.sceneService.config.renderMode.set(this.renderMode)
      }
    },

    // 重置视角
    resetPerspective() {
      if (this.scene && this.load) {
        this.scene.sceneService.resetPerspective()
      }
    },
    // 视角切换
    switchView(type: ViewType) {
      if (this.scene && this.load) {
        this.scene.cameraService.switchView(type)
      }
    },
  },
})
