App({
  data: {
    isGetAnswer: false
  },
  globalData: {
    corpId:''
  },
  onLaunch(options) {
    // 调取接口获取用户是否答过题，并且更改isGetAnswer参数
    // if (this.data.isGetAnswer) {
    //   dd.navigateTo({
    //     url: '/pages/index/index'
    //   })
    // } else {
    //   dd.navigateTo({
    //     url: '/pages/welcome/index'
    //   })
    // }
    this.globalData.corpId = options.query.corpId;
  }
});
