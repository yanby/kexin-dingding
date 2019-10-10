import api from '/request/api'
import request from '/request/request'
import { getUserInfo } from '/utils/utils'

Page({
  data: {
    hasImg: false,
    businessLicense: [],
    farmImage: [],
    idCardImage: [],
    qualification: []
  },
  onLoad() {
    // 页面加载
    let {businessLicense, farmImage, idCardImage, qualification} = dd.getStorageSync({key: 'userInfo'}).data
    businessLicense = businessLicense !== '' ? businessLicense.split(',') : []
    farmImage = farmImage !== '' ? farmImage.split(',') : []
    idCardImage = idCardImage !== '' ? idCardImage.split(',') : []
    qualification = qualification !== '' ? qualification.split(',') : []
    this.setData({
      businessLicense,
      farmImage,
      idCardImage,
      qualification
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
  // 点击添加图片
  choseImage(e) {
    const type = e.target.dataset.type
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
            console.log(resData)
            let param = { id: dd.getStorageSync({key: 'userInfo'}).data.id }
            const value = this.data[type]
            value.push(resData.data.url)
            param[type] = value.join(',')
            request(api.updateUser, 'post', param).then(res => {
              if (res.status === 200) {
                getUserInfo()
                if (type === 'businessLicense') {
                  this.setData({
                    businessLicense: param[type].split(',')
                  })
                } else if (type === 'farmImage') {
                  this.setData({
                    farmImage: param[type].split(',')
                  })
                } else if (type === 'idCardImage') {
                  this.setData({
                    idCardImage: param[type].split(',')
                  })
                } else if (type === 'qualification') {
                  this.setData({
                    qualification: param[type].split(',')
                  })
                }

              }
            })
          },
          fail: (err) => {
            console.log(err)
          }
        })
      },
    });
  },
});
