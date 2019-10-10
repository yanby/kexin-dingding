import request from '/request/request'
import api from '/request/api'

Page({
  data: {
    plotType: 0,
    value: [0, 0, 0],
    treeData: [],
    firstTree: [],
    secondTree: [],
    thirdTree: [],
    farmName: '',
    query: {}
  },
  onLoad(query) {
    const value = query.value.split('-')
    const val = []
    value.forEach(item => {
      val.push(Number(item))
    })
    // 页面加载
    this.setData({
      query,
      plotType: Number(query.plotType) || 0,
      farmName: query.farmName,
      value: val
    })
    this.httpGetFarmMenu({
      farmId: this.data.query.farmId,
      plotType: this.data.plotType
    }, true)
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
  onChange(val) {
    const value = val.detail.value
    this.setData({
      value
    })
    const firstDataIndex = value[0]
    const secondDataIndex = value[1]
    this.setData({
      firstTree: this.data.treeData,
      secondTree: this.data.treeData[firstDataIndex].list,
      thirdTree: this.data.treeData[firstDataIndex].list[secondDataIndex].list
    })
  },
  linkIndex() {
    if (!this.data.thirdTree) {
      dd.showToast({
        content: '请选择一个批次'
      })
      return
    }
    dd.showLoading({
      content: '加载中...'
    })
    const plotCropId = this.data.thirdTree[this.data.value[2]].id
    request(api.recordStart + plotCropId + `/${this.data.query.farmId}`, 'post').then(res => {
      if (res.status === 200) {
        dd.setStorageSync({
          key: 'plotCropInfo',
          data: {
            plotCropId,
            name: this.data.firstTree[this.data.value[0]].name + this.data.secondTree[0].name + this.data.thirdTree[this.data.value[2]].name,
            status: 0
          }
        })
        dd.reLaunch({
          url: '/pages/index/index'
        })
      } else {
        dd.showToast({
          content: res.message
        })
      }
      dd.hideLoading()
    })
  },
  choseBoxType(e) {
    this.setData({
      plotType: e.target.dataset.active
    })
    this.httpGetFarmMenu({
      farmId: this.data.query.farmId,
      plotType: this.data.plotType
    })
  },
  // 接口-获取三级联动菜单接口
  httpGetFarmMenu(param, onLoadFlag) {
    console.log('val',this.data.value)
    request(api.getFarmMenu, 'get', param).then(res => {
      if (res.status === 200) {
        const firstDataIndex = this.data.value[0]
        const secondDataIndex = this.data.value[1]
        let thirdTreeList
        if(onLoadFlag){
          const len = res.data[firstDataIndex].list[0].list.length
          this.data.value[2] = len - 1;
          thirdTreeList = res.data[firstDataIndex].list[secondDataIndex] ? res.data[firstDataIndex].list[secondDataIndex].list : res.data[firstDataIndex].list[0].list
        }else{
          thirdTreeList = res.data[firstDataIndex].list[secondDataIndex].list || []
        }
        
        this.setData({
          treeData: res.data,
          firstTree: res.data,
          secondTree: res.data[firstDataIndex].list,
          thirdTree: thirdTreeList,
          value: this.data.value
        })
      }
    })
  }
});
