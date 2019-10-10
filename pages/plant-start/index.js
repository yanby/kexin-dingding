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
    query: {},
    name: '',
    farmName: ''
  },
  onLoad(query) {
    // 页面加载
    this.setData({
      query
    })
    this.setData({
      farmName: query.farmName
    })
    this.httpGetFarmMenu({
      farmId: this.data.query.farmId,
      plotType: this.data.plotType
    })
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
  // 修改农场编号名称
  onInput(e) {
    this.setData({
      name: e.detail.value
    })
  },
  linkSupplementInfo() {
    const firstDataIndex = this.data.value[0]
    const secondDataIndex = this.data.value[1]
    const plotId = this.data.firstTree[firstDataIndex].id
    const cropId = this.data.secondTree[secondDataIndex].id
    if (!this.data.name) {

      // const plotCropId = this.data.thirdTree[this.data.value[2]].id
      dd.navigateTo({
        url: `/pages/supplement-info/index?plotType=${this.data.plotType}&plotId=${plotId}&cropId=${cropId}&farmId=${this.data.query.farmId}&farmName=${this.data.query.farmName}&value=${this.data.value.join('-')}`
      })
    } else {
      request(api.updatePlot, 'post', {
        plotId,
        name: this.data.name
      }).then(res => {
        if (res.status === 200) {
          dd.showToast({
            content: '修改农场编号名称成功'
          })
          this.httpGetFarmMenu({
            farmId: this.data.query.farmId,
            plotType: this.data.plotType
          }, this.data.value)

          this.setData({
            name: ''
          })
        }
      })
    }
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
  httpGetFarmMenu(param, value) {
    request(api.getFarmMenu, 'get', param).then(res => {
      if (res.status === 200) {
        if (res.data.length === 0) {
          this.setData({
            treeData: [],
            firstTree: [],
            secondTree: [],
            thirdTree: []
          })
        } else {
          if (value) {
            this.setData({
              value
            })
            const firstDataIndex = value[0]
            const secondDataIndex = value[1]
            this.setData({
              treeData:res.data,
              firstTree: res.data,
              secondTree: res.data[firstDataIndex].list,
              thirdTree: res.data[firstDataIndex].list[secondDataIndex].list
            })
          } else {
            this.setData({
              treeData: res.data,
              firstTree: res.data,
              secondTree: res.data[0].list,
              thirdTree: res.data[0].list[0].list,
            })
          }
        }
      }
    })
  }
});
