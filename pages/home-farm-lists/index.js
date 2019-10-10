import request from '/request/request'
import api from '/request/api'

Page({
  data: {
    list: [],
    query: {},
    selectFarm: ''
  },
  onLoad(query) {
    // 页面加载
    this.setData({
      query
    })
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    this.getFarmList()
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
  // 开始种植
  linkPlantStart(e) {
    // dd.navigateTo({
    //   url: '/pages/plant-start/index'
    // })
    dd.navigateTo({
        url: '/pages/plant-start/index?farmId=' + e.target.dataset.farmId + '&farmName=' + e.target.dataset.farmName
      })
  },
  // 新增农场
  linkCreateFarm(e) {
    const type = e.target.dataset.type
    let url = '';
    if (type === 'create') {
      url = '/pages/create-farm/index?type=create'
    } else if (type === 'edit') {
      const obj = e.target.dataset.obj
      url = `/pages/create-farm/index?type=edit&farmId=${e.target.dataset.farmId}&farmName=${obj.name}&area=${obj.area}&brooderCount=${obj.brooderCount}&coolCount=${obj.coolCount}`
    }
    dd.navigateTo({
      url
    })
  },
  // 切换农场
  changDefaultFarm(e) {
    const farmId = e.target.dataset.farmId
    if (this.data.query.type === 'default') {
      request(api.changeDefaultFarm, 'post', { farmId }).then(res => {
        if (res.status === 200) {
          dd.navigateBack({
            delta: 1
          })
        }
      })
    } else if (this.data.query.type === 'manage') {
      const selectFarm = this.data.selectFarm
      if (selectFarm === farmId) {
        this.setData({
          selectFarm: ''
        })
      } else {
        this.setData({
          selectFarm: farmId
        })
      }
    }
  },
  deleteFarm(e) {
    dd.confirm({
      title: '警告',
      content: '删除农场会丢失数据，是否确认',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      success: () => {
        const farmId = e.target.dataset.farmId
        request(api.deleteFarm + farmId, 'post').then(res => {
          if (res.status === 200) {
            this.getFarmList()
          }
        })
      },
    });
  },
  // 获取农场列表接口
  getFarmList() {
    request(api.getFarmList, 'get').then(res => {
      if (res.status === 200) {
        this.setData({
          list: res.data
        })
      }
    })
  }
});
