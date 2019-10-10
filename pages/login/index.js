import request from '/request/request'
import api from '/request/api'

const app = getApp()

Page({
  data: {
    username: '',
    password: '',
    query: {},
    authCode: "",
  },
  onLoad(query) {
    this.setData({
      query
    })

     const userInfo = dd.getStorageSync({key: 'userInfo'}).data
     
this.loginDD()
    // if (!userInfo) {
      
    //   return
    // }
    // if (userInfo.answerScore === -1) {
    //   dd.redirectTo({
    //     url: '/pages/welcome/index'
    //   })
    // } else if (!userInfo.farm) {
    
    //   dd.redirectTo({
    //     url: '/pages/create-farm/index?score=' + userInfo.answerScore + '&type=create'
    //   })
    // } else {
    //   dd.redirectTo({
    //     url: '/pages/index/index'
    //   })
    // }
  },
  onBlur(e) {
    if (e.target.dataset.type === 'username') {
      this.setData({
        username: e.detail.value
      })
    } else if (e.target.dataset.type === 'password') {
      this.setData({
        password: e.detail.value
      })
    }
  },
  login() {
    request(api.login, 'post', {username: this.data.username, password: this.data.password}).then((res) => {
      console.log(res)
      if (res.status === 200) {
        dd.setStorageSync({
          key: 'token',
          data: res.data.token
        })

        // 获取用户信息
        this.getUerInfo()
      }
    })
  },
  loginDD() {
    var that = this;
    dd.getAuthCode({
      success: res => {
        request(api.ddLogin, 'post', {
          corpId: app.globalData.corpId,
          requestAuthCode: res.authCode
        }).then(response => {
          if (response.status === 200) {
            dd.setStorageSync({
              key: 'token',
              data: response.data.token
            })

            // 获取用户信息
            this.getUerInfo()
          }
        })
      },
      fail: err => {
        dd.alert({
          title: 'err',
          content: JSON.stringify(err)
        })
        this.setData({
          authCode: err
        })
        dd.showToast({content: err})
      }
    });
  },
  // 获取用户信息
  getUerInfo() {
    request(api.getUserInfo, 'get').then(res => {
      console.log(res)
      dd.setStorageSync({
        key: 'userInfo',
        data: res.data
      })
      dd.setStorageSync({
        key: 'plotCropInfo',
        data: res.data.plotCrop ? {
          status: res.data.plotCrop.status,
          plotCropId: res.data.plotCrop.id,
          name: res.data.plotCrop.plotName + res.data.plotCrop.cropName + res.data.plotCrop.cropVariety
        } : {}
      })
      dd.setStorageSync({
        key: 'farmInfo',
        data: res.data.farm ? {
          ...res.data.farm,
          farmId: res.data.farm.id
        } : {}
      })
      const { answerScore } = res.data
      if (this.data.query.redirect === 'true') {
        dd.navigateBack({
          delta: 1
        })
      } else if (answerScore === -1) {
        dd.redirectTo({
          url: '/pages/welcome/index'
        })
      } else if (!res.data.farm) {
        dd.redirectTo({
          url: '/pages/question-end/index'
        })
        // dd.redirectTo({
        //   url: '/pages/create-farm/index?score=' + res.data.answerScore + '&type=create'
        // })
      } else {
        dd.redirectTo({
          url: '/pages/index/index'
        })
      }
    })
  }
})