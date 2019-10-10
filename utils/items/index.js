import api from '/request/api'
import request from '/request/request'

export default {
  data: {
    animMaskData: [],
    animContentData: []
  },
  animOp: {
    createMaskShowAnim() {
      const animation = dd.createAnimation({
        duration: 200,
        timingFunction: 'cubic-bezier(.55, 0, .55, .2)',
      });

      this.maskAnim = animation;
  
      animation.opacity(1).step();
      this.setData({
        animMaskData: animation.export(),
      });
    },
    createMaskHideAnim() {
      this.maskAnim.opacity(0).step();
      this.setData({
        animMaskData: this.maskAnim.export(),
      });
    },
    createContentShowAnim() {
      const animation = dd.createAnimation({
        duration: 200,
        timingFunction: 'cubic-bezier(.55, 0, .55, .2)',
      });  
      this.contentAnim = animation;  
      animation.translateY(0).step();
      this.setData({
        animContentData: animation.export(),
      });
    },
    createContentHideAnim() {
      this.contentAnim.translateY('100%').step();
      this.setData({
        animContentData: this.contentAnim.export(),
      });
    },
    onModalCloseTap() {
      this.createMaskHideAnim();
      this.createContentHideAnim();
      setTimeout(() => {
        this.setData({
          'modalData.hidden': true,
        });
      }, 210);
    },
    
    // 点击更多环节
    linkFarmWorkOther(e) {
      const modalData = e.target.dataset.modalData
      const index = e.target.dataset.index
      dd.setStorageSync({
        key: 'modalData',
        data: modalData
      })
      this.setStorageBanInit(true)
      dd.navigateTo({
        url: '/pages/farm-work-other/index?index=' + index
      })
    },
    // 更改时间
    changeTime() {
      
      dd.datePicker({
        format: 'yyyy-MM-dd',
        success: (res) => {
          this.setData({
            'modalData.time': res.date
          })
        },
      });
    },
    // 点击添加照片
    choseModalImage(e) {
      const index = e.target.dataset.index
      this.setStorageBanInit(true)
      dd.chooseImage({
        count: 1, 
        success: (res) => {
          console.log(res)
          dd.uploadFile({
            url: api.uploadFile,
            filePath: res.filePaths[0],
            fileType: "image",
            fileName: 'file',
            success: (response) => {
              const resData = JSON.parse(response.data)
              const value = this.data.activeNeedImg.content[index].value
              value.push(resData.data.url)
              // 更新activeNeedImg的值
              const obj = {...this.data.activeNeedImg}
              obj.content[index].value = value
              obj.content[index].flag = '1'
              this.setData({
                activeNeedImg: obj
              })
              this.setData({
                modalData: {
                  ...this.data.activeNeedImg,
                  hidden: false
                }
              })
              this.createMaskShowAnim()
              this.createContentShowAnim()
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
      const obj = {...this.data.activeNeedImg}
      obj.content[index].value = e.detail.value
      if (e.detail.value !== '') {
        obj.content[index].flag = '1'
      } else {
        obj.content[index].flag = '0'
      }
      this.setData({
        activeNeedImg: obj
      })
    },
    // 保存农事环节记录
    saveRecord() {
      console.log(this.data.num)
      if (dd.getStorageSync({key: 'modalData'}).data && dd.getStorageSync({key: 'modalData'}).data.length > 0) {
        const content = [...this.data.activeNeedImg.content]
        dd.getStorageSync({key: 'modalData'}).data.forEach((item, index) => {
          if (item.type === '2') {
            content.splice(index, 1, item)
          }
        })
        this.setData({
          'activeNeedImg.content': content
        })
      }
      if(this.data.num == 1){
         request(api.recordAppended, 'post', {
          recordId: this.data.activeNeedImg.recordId,
          farmingId:  9
        }).then(res => {
          if (res.status === 200) {
            this.choseFarmWorkItem(this.data.tabs.recordId, this.data.tabs.category)
            this.onModalCloseTap()
          }
          this.setStorageBanInit(false)
          dd.removeStorageSync({key: 'modalData'})
        })
      }else{
        request(api.saveRecord, 'post', {
          recordId: this.data.activeNeedImg.recordId,
          date: this.data.modalData.time,
          content: JSON.stringify(this.arrToStr(this.data.activeNeedImg).content)
        }).then(res => {
          if (res.status === 200) {
            this.choseFarmWorkItem(this.data.tabs.recordId, this.data.tabs.category)
            this.onModalCloseTap()
          }
          this.setStorageBanInit(false)
          dd.removeStorageSync({key: 'modalData'})
        })
      }
    },
    // 处理activeNeedImg中的value数组为字符串
    arrToStr(arr) {
      arr.content.forEach(item => {
        if (item.type === '0') {
          const value = item.value
          item.value = value.join(',')
        } else if (item.type === '2') {
          item.value.forEach(itemValue => {
            if (itemValue.type === '0') {
              const value = itemValue.value
              itemValue.value = value.join(',')
            }
          })
        }
      })
      return arr
    }
  }
};
