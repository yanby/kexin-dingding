import request from '/request/request'
import api from '/request/api'

export const formatDate = function (date) {  
    var y = date.getFullYear();  
    var m = date.getMonth() + 1;  
    m = m < 10 ? '0' + m : m;  
    var d = date.getDate();  
    d = d < 10 ? ('0' + d) : d;  
    return y + '-' + m + '-' + d;  
};

export const getUserInfo = function () {
  return new Promise(resolve => {
    request(api.getUserInfo, 'get').then(res => {
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
      resolve(true)
    })
  })
}