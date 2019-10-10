import request from '/request/request'
import api from '/request/api'

Page({
  data: {
    title: '创建农场',
    farmName: '',
    aera: '',
    brooderCount: 0,
    coolCount: 0,
    query: {},
    farmId: ''
  },
  onLoad(query) {
    this.setData({
      query
    })
    // 页面加载
    if (query.type === 'create') {
      this.setData({
        title: '创建农场'
      })
    } else if (query.type === 'edit') {
      this.setData({
        title: '编辑农场',
        farmName: query.farmName,
        area: query.area,
        brooderCount: query.brooderCount,
        coolCount: query.coolCount,
        farmId: query.farmId
      })
    }
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
  // 失去焦点时更新数据
  onBlur(e) {
    const param = e.target.dataset.param
    if (param === 'farmName') {
      this.setData({
        farmName: e.detail.value
      })
    } else if (param === 'area') {
      this.setData({
        area: e.detail.value
      })
    } else if (param === 'brooderCount') {
      this.setData({
        brooderCount: e.detail.value || 0
      })
      console.log(this.data.brooderCount)
    } else if (param === 'coolCount') {
      this.setData({
        coolCount: e.detail.value || 0
      })
    }
  },
  // 点击加号
  tapJia(e) {
    const param = e.target.dataset.param
    if (this.data.query.type === 'edit') return
    if (param === 'brooderCount') {
      this.setData({
        brooderCount: this.data.brooderCount + 1
      })
    } else if (param === 'coolCount') {
      this.setData({
        coolCount: this.data.coolCount + 1
      })
    }
  },
  // 点击减号
  tapJian(e) {
    const param = e.target.dataset.param
    if (this.data.query.type === 'edit') return
    if (param === 'brooderCount') {
      if (this.data.brooderCount === 0) return
      this.setData({
        brooderCount: this.data.brooderCount - 1
      })
    } else if (param === 'coolCount') {
      if (this.data.coolCount === 0) return
      this.setData({
        coolCount: this.data.coolCount - 1
      })
    }
  },
  linkPlantStart() {
    const { farmName, area, brooderCount, coolCount} = this.data
    const answerScore = this.data.query.score ? Number(this.data.query.score) : (dd.getStorageSync({key: 'userInfo'}).data.answerScore || 0)
    const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
    if (!farmName) {
      dd.showToast({
        content: '请填写农场名称'
      })
      return
    } else if (!area) {
      dd.showToast({
        content: '请填写农场面积'
      })
      return
    } else if (!reg.test(area)) {
      dd.showToast({
        content: '农场面积必须是保留两位小数以内'
      })
      return
    }

    if (this.data.query.type === 'create') {
      request(api.createFarm, 'post', {
        farmName,
        area: Number(area) * 100,
        brooderCount,
        coolCount,
        // answerScore
      }).then(res => {
        if (res.status === 200) {
          const { farmId } = res.data
          dd.setStorageSync({
            key: 'farmInfo',
            data: {
              farmId,
              name: farmName,
              area
            }
          })
          dd.navigateTo({
            url: '/pages/plant-start/index?farmId=' + farmId + '&farmName=' + farmName
          })
        }
      })
    } else if (this.data.query.type === 'edit') {
      request(api.updateFarmInfo, 'post', {
        farmId: Number(this.data.farmId),
        farmName: this.data.farmName,
        area: Number(this.data.area)
      }).then(res => {
        if (res.status === 200) {
          dd.navigateBack({
            delta: 1
          })
        }
      })
    }
  }
});
