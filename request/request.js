const sendRrquest = function (url, method, data = {}) {
	const promise = new Promise(function (resolve, reject) {
    // dd.alert({
    //   title: 'request',
    //   content: JSON.stringify(data)
    // })
		dd.httpRequest({
			url: url,
			data: data,
			method: method,
			headers: {
        // 'Content-Type': 'application/json',
        'token': dd.getStorageSync({key: 'token'}).data || ''
      },
			dataType: 'json',
			success: res => {
        // dd.alert({
        //   title: 'http-success',
        //   content: JSON.stringify(res)
        // })
        // status = 500 服务器错误
        if (res.data.status === 500) {
          dd.showToast({content: '服务器错误，请稍后重试！'})
          return
        }
        // status === 601 需要登录
        if (res.data.status === 601) {
          if (dd.getStorageSync({key: 'token'}).data) {
            dd.showToast({
              content: '登录过期，请重新登录'
            })
            setTimeout(() => {
              dd.navigateTo({
                url: '/pages/login/index?redirect=true'
              })
            }, 1500)
          } else {
            dd.showToast({
              content: '尚未登录，请前往登录'
            })
            setTimeout(() => {
              dd.navigateTo({
                url: '/pages/login/index'
              })
            }, 1500)
          }
          dd.removeStorageSync({
            key: 'userInfo'
          })
          dd.removeStorageSync({
            key: 'token'
          })
          return
        }
        resolve(res.data)
      },
			// fail: err => {
      //   dd.alert({
      //     title: 'http-fail',
      //     content: JSON.stringify(err)
      //   })
      //   reject
      // }
      fail: reject
		})
	});
	return promise;
};
 
export default sendRrquest
