import request from '/request/request'
import api from '/request/api'

Component({
  props: {
    plotType: 0,
    farmName: '',
    title: '',
    treeData: [],
    firstTree: [],
    secondTree: [],
    thirdTree: [],
    onChoseBoxType: () => {},
    onChangePlotCrop: () => {}
  },
  data: {
    value: [0,0,0],
    hidden: true,
    animMaskData: [],
    animContentData: []
  },
  didMount() {
  },
  methods: {
    tapHome() {
      dd.navigateTo({
        url: '/pages/home/index'
      })
    },
    choseBox() {
      this.setData({
        hidden: false
      })
      this.createMaskShowAnim();
      this.createContentShowAnim();
    },
    choseBoxType(e) {
      this.setData({
        plotType: e.target.dataset.active
      })
      this.props.onChoseBoxType(this.data.plotType)
    },
    onChange(val) {
      const value = val.detail.value
      this.setData({
        value
      })
      this.props.onChangePlotCrop(value)
    },
    tapConfirm() {
      if (!this.props.thirdTree) {
        dd.showToast({
          content: '请选择一个批次'
        })
        return
      }
      request(api.changePlotCrop, 'get', { plotCropId: this.props.thirdTree[this.data.value[2]].id.toString() }).then(res => {
        if (res.status === 200) {
          dd.reLaunch({
            url: '/pages/index/index'
          })
        }
      })
    },
    // 开始种植
    linkPlantStartCrop() {
      dd.navigateTo({
        url: '/pages/plant-start/index?farmId=' + dd.getStorageSync({key: 'farmInfo'}).data.farmId + '&farmName=' + this.props.farmName
      })
    },
    // 管理农场
    linkHomeFarmList() {
      dd.navigateTo({
        url: '/pages/home-farm-lists/index?type=manage'
      })
    },
    createMaskShowAnim() {
      const animation = dd.createAnimation({
        duration: 200,
        timingFunction: 'cubic-bezier(.55, 0, .55, .2)',
      });

      this.maskAnimTitle = animation;
  
      animation.opacity(1).step();
      this.setData({
        animMaskData: animation.export(),
      });
    },
    createMaskHideAnim() {
      this.maskAnimTitle.opacity(0).step();
      this.setData({
        animMaskData: this.maskAnimTitle.export(),
      });
    },
    createContentShowAnim() {
      const animation = dd.createAnimation({
        duration: 200,
        timingFunction: 'cubic-bezier(.55, 0, .55, .2)',
      });  
      this.contentAnimTitle = animation;  
      animation.translateY(0).step();
      this.setData({
        animContentData: animation.export(),
      });
    },
    createContentHideAnim() {
      this.contentAnimTitle.translateY('-100%').step();
      this.setData({
        animContentData: this.contentAnimTitle.export(),
      });
    },
    onModalCloseTap() {
      this.createMaskHideAnim();
      this.createContentHideAnim();
      setTimeout(() => {
        this.setData({
          hidden: true,
        });
      }, 210);
    }
  }
})