import { getUserInfo } from '/utils/utils'

Page({
  data: {
    userInfo: {}
  },
  onLoad(query) {
    // 页面加载
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    getUserInfo().then(res => {
      this.setData({
        userInfo: dd.getStorageSync({
          key: 'userInfo'
        }).data
      })
      if (!this.data.userInfo.farm) {
        dd.redirectTo({
          url: '/pages/create-farm/index?score=' + this.data.userInfo.answerScore + '&type=create'
        })
      }
    })
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
  // 农场管理 / 切换农场
  changeFarm(e) {
    const type = e.target.dataset.type
    dd.navigateTo({
      url: '/pages/home-farm-lists/index?type=' + type
    })
  },
  // 完善资料
  linkHomeFarmer() {
    dd.navigateTo({
      url: '/pages/home-farmer/index'
    })
  },
  // 农场详情
  linkHomeFarm() {
    dd.navigateTo({
      url: '/pages/home-farm/index?farmId=' + dd.getStorageSync({key: 'farmInfo'}).data.farmId
    })
  }
});
