import type { ViewType } from '@manycore/custom-ksg-viewer-sdk'
import { fetchDesignInfo } from '@/api'
import { Application, ERenderMode } from '@manycore/custom-ksg-viewer-sdk'
import { defineStore } from 'pinia'

interface AppSotre {
  scene?: Application
  load: boolean

  /** 是否隐藏门抽 */
  hideDoor: boolean
  /** 是否显示户型 */
  showHouseType: boolean
  /** 模型爆炸距离 */
  bomValue: number
  /** 场景的渲染模式 */
  renderMode: ERenderMode
}

export const useAppStore = defineStore('appStore', {
  state: (): AppSotre => ({
    load: false,
    hideDoor: false,
    showHouseType: false,
    bomValue: 0,
    renderMode: ERenderMode.OUTLINE_WITH_SHADING,
  }),
  actions: {
    /** 挂载场景 */
    loadScene(el: HTMLElement) {
      if (this.scene)
        return
      this.scene = new Application(el)
      this.scene.sceneService.config.interaction.pan.enabled.set(false)
      this.scene.sceneService.config.interaction.zoom.enabled.set(false)
      // this.scene.sceneService.config.interaction.rotation.enabled.set(false);
    },
    async loadOrder(orderNo: string) {
      // 获取订单信息
      const { designId, designNo, orderNo: newOrderNo } = await fetchDesignInfo(orderNo)
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
