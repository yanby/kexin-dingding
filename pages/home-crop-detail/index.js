import request from '/request/request'
import api from '/request/api'

Page({
  data: {
    cropInfo: {},
    timerShaft: [],
    query: {}
  },
  onLoad(query) {
    this.setData({
      query
    })
    this.getCropDetail({plotCropId: query.plotCropId})
    // this.getCropDetail({plotCropId: 4})
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
  // 获取作物详情
  getCropDetail(data) {
    request(api.getCropDetail, 'get', data).then(res => {
      if (res.status === 200) {
        const { cropInfo, timerShaft } = res.data
        timerShaft.forEach(item => {
          const date = item.createTime.split(' ')[0]
          const date1 = date.split('-')
          item.year = item.createTime.split('-')[0],
          item.date = [date1[1], date1[2]].join('-')
        })
        this.setData({
          cropInfo,
          timerShaft
        })
      }
    })
  }
});
