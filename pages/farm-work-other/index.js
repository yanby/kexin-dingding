import api from '/request/api'

Page({
  data: {
    modalData: {},
    valueType0: [],
    valueType1: [],
    valueType2: [],
    query: {}
  },
  onLoad(query) {
    this.setData({
      query
    })
    const value = dd.getStorageSync({key: 'modalData'}).data[query.index].value
    console.log(value)
    const valueType0 = value.filter(item => item.type === '0')
    const valueType1 = value.filter(item => item.type === '1')
    const valueType2 = value.filter(item => item.type === '2')
    // 页面加载
    this.setData({
      modalData: {...dd.getStorageSync({key: 'modalData'}).data[query.index]},
      valueType0,
      valueType1,
      valueType2
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
  // 点击添加照片
  choseModalImage(e) {
    const index = e.target.dataset.index
    dd.chooseImage({
      count: 1, 
      success: (res) => {
        dd.uploadFile({
          url: api.uploadFile,
          filePath: res.filePaths[0],
          fileType: "image",
          fileName: 'file',
          success: (response) => {
            const resData = JSON.parse(response.data)
            const value = this.data.valueType0[index].value
            value.push(resData.data.url)
            // 更新activeNeedImg的值
            const obj = [...this.data.valueType0]
            obj[index].value = value
            obj[index].flag = '1'
            this.setData({
              valueType0: obj
            })
          },
          fail: (err) => {
            console.log(err)
          }
        })
      },
    });
  },
  // 添加文字信息
  changeTxtInfo(e) {
    const index = e.target.dataset.index
    const obj = [...this.data.valueType1]
    obj[index].value = e.detail.value
    if (e.detail.value !== '') {
      obj[index].flag = '1'
    } else {
      obj[index].flag = '0'
    }
    this.setData({
      valueType1: obj
    })
  },
  // 点击确定
  tapConfirm() {
    const value = [...this.data.valueType0, ...this.data.valueType1, ...this.data.valueType2]
    let flag = ''
    if (this.data.valueType0.every(item => item.flag === '0') && this.data.valueType1.every(item => item.flag === '0')) {
      flag = '0'
    } else if (this.data.valueType0.every(item => item.flag === '1') && this.data.valueType1.every(item => item.flag === '1')) {
      flag = '1'
    } else {
      flag = '2'
    }
    // let flag = this.data.valueType0.some(item => item.flag === '0') || this.data.valueType1.some(item => item.flag === '0') ? '0' : '1'
    const obj = [...dd.getStorageSync({'key': 'modalData'}).data]
    console.log(obj)
    obj[this.data.query.index].value = value
    obj[this.data.query.index].flag = flag 
    dd.setStorageSync({
      key: 'modalData',
      data: obj
    })
    dd.navigateBack({
      delta: 1
    })
  }
});
