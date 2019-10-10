import request from '/request/request'
import api from '/request/api'

Page({
  data: {
    list: [],
    query: {},
    farmInfo: {},
    plotList: [],
    boxList: [{ id: 0, name: '暖棚' }, { id: 1, name: '冷棚' }],
    cropList: [{ id: '1', name: '大番茄' }, { id: '2', name: '小番茄' }, { id: '3', name: '辣椒' }, { id: '4', name: '茄子' }, { id: '5', name: '黄瓜' }],
    statusList: [{ id:'0', name: '种植中' }, { id: '1', name: '未开始' }, { id: '2', name: '已结束' }],
    param: {
      farmId: '',
      cropId: '',
      status: '',
      plotId: ''
    },
    value: [0, 0, 0, 0],
    valueTitle: ['棚类', '棚号', '品类', '状态']
  },
  onLoad(query) {
    this.setData({
      query,
      'param.farmId': query.farmId
    })
    // 获取农场详情
    request(api.getFarmInfo + query.farmId, 'get').then(res => {
      if (res.status === 200) {
        this.setData({
          farmInfo: {...res.data, updateTime: res.data.updateTime.split(' ')[0]}
        })
      }
    })
    this.getPlotList({
      farmId: query.farmId,
      plotType: this.data.value[0]
    })
    this.getCropList(this.data.param)
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
  // 切换棚类
  bindObjPickerChange0(e) {
    this.setData({
      'value[0]': e.detail.value,
      'valueTitle[0]': this.data.boxList[e.detail.value].name
    })
    this.getPlotList({
      farmId: this.data.query.farmId,
      plotType: this.data.boxList[e.detail.value].id
    }).then(() => {
      this.setData({
        'valueTitle[1]': this.data.plotList[0].name,
        'valueTitle[2]': this.data.cropList[0].name,
        'valueTitle[3]': this.data.statusList[0].name
      })
      this.bindObjPickerChange1({detail: {value: 0}})
    })
  },
  // 切换棚号
  bindObjPickerChange1(e) {
    this.setData({
      'param.cropId': '',
      'param.status': '',
      'param.plotId': this.data.plotList[e.detail.value].id.toString(),
      'value[1]': e.detail.value,
      'valueTitle[1]': this.data.plotList[e.detail.value].name
    })
    this.setData({
      'valueTitle[2]': this.data.cropList[0].name,
      'valueTitle[3]': this.data.statusList[0].name
    })
    this.getCropList(this.data.param)
  },
  // 切换作物 
  bindObjPickerChange2(e) {
    this.setData({
      'param.cropId': this.data.cropList[e.detail.value].id,
      'param.status': '',
      'param.plotId': this.data.plotList[this.data.value[1]].id.toString(),
      'value[2]': e.detail.value,
      'valueTitle[2]': this.data.cropList[e.detail.value].name
    })
    this.setData({
      'valueTitle[3]': this.data.statusList[0].name
    })
    this.getCropList(this.data.param)
  },
  // 切换状态
  bindObjPickerChange3(e) {
    this.setData({
      'param.cropId': this.data.cropList[this.data.value[2]].id,
      'param.status': this.data.statusList[e.detail.value].id,
      'param.plotId': this.data.plotList[this.data.value[1]].id.toString(),
      'value[3]': e.detail.value,
      'valueTitle[3]': this.data.statusList[e.detail.value].name
    })
    this.getCropList(this.data.param)
  },
  linkHomeCropDetail(e) {
    dd.navigateTo({
      url: '/pages/home-crop-detail/index?plotCropId=' + e.target.dataset.cropId
    })
  },
  linkHomeCredit() {
    dd.navigateTo({
      url: '/pages/home-credit/index'
    })
  },
  // 获取地块列表
  getPlotList(data) {
    return new Promise(resolve => {
      request(api.getPlot, 'get', data).then(res => {
        if (res.status === 200) {
          this.setData({
            plotList: res.data,
            'param.cropId': '',
            'param.status': '',
            'param.plotId': '',
          })
          resolve(res)
        }
      })
    })
  },
  // 获取作物列表
  getCropList(data) {
    request(api.getCropList, 'get', data).then(res => {
      if (res.status === 200) {
        this.setData({
          list: res.data
        })
      }
    })
  }
});
