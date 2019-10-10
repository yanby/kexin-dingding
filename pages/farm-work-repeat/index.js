import request from '/request/request'
import api from '/request/api'

Page({
  data: {
    active: 0,
    farmingId: 10
  },
  onLoad(query) {
    // 页面加载
    this.setData({
      query
    })
    console.log(query)
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
  choseActive(e) {
    this.setData({
      active: e.target.dataset.active,
      farmingId: e.target.dataset.farmingId
    })
  },
  addRepeatWork() {
    if (this.data.active !== 1 && this.data.active !== 0) {
      dd.showToast({
        content: '请选择一项反复性事件'
      })
      return
    }
    request(api.recordAppended, 'post', {
      recordId: Number(this.data.query.recordId),
      farmingId: this.data.farmingId
    }).then(res => {
      if (res.status === 200) {
        console.log('repeatId:',res.data.recordId)
        dd.navigateTo({
          url: '/pages/index/index?recordId=' + res.data.recordId + '&catagory=' + this.data.active + '&repeat=true'
        })
      }
    })
    // dd.navigateBack({
    //   delta: 1
    // })
  }
});
