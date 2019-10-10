import request from '/request/request'
import api from '/request/api'

Page({
  data: {
    formData: {
      cropVariety: '',
      batchTime: '',
      area: '',
      plotId: '',
      cropId: '',
      btnHide: true
    },
    query: {}
  },
  onLoad(query) {
    // 页面加载
    this.setData({
      query
    })
    this.setData({
      'formData.plotId': this.data.query.plotId,
      'formData.cropId': this.data.query.cropId
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
  onFocus() {
    dd.datePicker({
      format: 'yyyy-MM-dd',
      success: (res) => {
        this.setData({
          'formData.batchTime': res.date
        })
      },
    });
  },
  onBlur(e) {
    const key = e.target.dataset.type
    switch (key) {
      case 'cropVariety':
        this.setData({
          'formData.cropVariety': e.detail.value
        })
        break
      case 'area':
        this.setData({
          'formData.area': e.detail.value
        })
        break
    }
  },
  linkIndex() {
    dd.showLoading();
    const formData = this.data.formData
    const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
    if (!formData.cropVariety || !formData.batchTime || !formData.area) {
      dd.showToast({
        content: '请将信息填写完整之后再点击确认'
      })
      return
    } else if (!reg.test(formData.area)) {
      dd.showToast({
        content: '种植面积必须是两位小数以内'
      })
      return
    }
    const param = {...this.data.formData, area: Number(formData.area) * 100,farmId:this.data.query.farmId}
    request(api.recordStart, 'post', param).then(res => {
      console.log(res)
      if (res.status === 200) {
          dd.hideLoading();
          dd.reLaunch({
          url: '/pages/index/index'
        })
      
        // dd.navigateTo({
        //   url: '/pages/plant-start-crop/index?farmId=' + this.data.query.farmId + '&farmName=' + this.data.query.farmName + '&value=' + this.data.query.value
        // })
      }
    })
  }
});
