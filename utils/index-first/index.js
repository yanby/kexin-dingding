import api from '/request/api'
import request from '/request/request'
import { formatDate } from '/utils/utils'

export default {
  data: {
    type: 0,
    activeType: 1,
    pollination: {
      farmingId: -1,
      type: 'bee',
      content: {
        bee: [
          {
            createTime: '',
            flag: '0',
            name: '蜂箱图',
            score: 0,
            type: '0',
            unit: '',
            value: []
          },
          {
            createTime: '',
            flag: '0',
            name: '授粉现场图',
            score: 0,
            type: '0',
            unit: '',
            value: []
          },
          {
            createTime: '',
            flag: '0',
            name: '开放的花朵近景图',
            score: 0,
            type: '0',
            unit: '',
            value: []
          }
        ],
        do: [
          {
            createTime: '',
            flag: '0',
            name: '授粉现场图',
            score: 0,
            type: '0',
            unit: '',
            value: []
          },
          {
            createTime: '',
            flag: '0',
            name: '开放的花朵近景图',
            score: 0,
            type: '0',
            unit: '',
            value: []
          }
        ],
        other: [
          {
            createTime: '',
            flag: '0',
            name: '授粉现场图',
            score: 0,
            type: '0',
            unit: '',
            value: []
          },
          {
            createTime: '',
            flag: '0',
            name: '开放的花朵近景图',
            score: 0,
            type: '0',
            unit: '',
            value: []
          }
        ]
      }
    }
  },
  methods: {
    // 点击照相机图标
    choseImage(e) {
      this.setData({
        num: e.target.dataset.num
      })
      // 不需要拍照（直接跳过环节）
      // if (this.data.activeNeedImg.content.length === 0) {
      //   dd.confirm({
      //     title: '警告',
      //     content: '您将直接结束当前农事环节，是否确定',
      //     success: () => {
      //       console.log('结束当前农事环节')
      //     }
      //   })
      //   return
      // }
      // 文字信息
      
      if (this.data.activeNeedImg.content[0].type !== '0') {
        this.setData({
          modalData: {
            ...this.data.activeNeedImg,
            hidden: false
          }
        })
        if (!this.data.activeNeedImg.time) {
          // 设置默认当前时间
          this.setData({
            'modalData.time': formatDate(new Date())
          })
        } else {
          // 设置默认当前时间
          this.setData({
            'modalData.time': this.data.activeNeedImg.time.split(' ')[0]
          })
        }
        this.createMaskShowAnim()
        this.createContentShowAnim()
        return
      }
      if(e.target.dataset.pai==1){
        this.setData({
          modalData: {
            ...this.data.activeNeedImg,
            hidden: false
          }
        })
        this.createMaskShowAnim()
        this.createContentShowAnim()
      }else{
        dd.chooseImage({
          count: 1, 
          success: (res) => {
          this.setStorageBanInit(true)
            dd.uploadFile({
              url: api.uploadFile,
              filePath: res.filePaths[0],
              fileType: "image",
              fileName: 'file',
              success: (response) => {
                console.log(response)
                const resData = JSON.parse(response.data)
                const value = this.data.activeNeedImg.content[0].value
                value.push(resData.data.url)
                // 更新activeNeedImg的value值
                this.setData({
                  'activeNeedImg.content[0].value': value,
                  'activeNeedImg.content[0].flag': '1'
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
          }
        })
      }
     
    },
    // 点击选择按钮
    choseType1(e) {
      console.log(111)
      var that = this;
      const activeType = e.target.dataset.recordId
      if (activeType === this.data.activeType) return
      let activeNeedImg = {}
      this.data.imgArr.some(item => {
        if (item.recordId === activeType) {
          activeNeedImg = item
          activeNeedImg.time = !item.time ? formatDate(new Date()) : item.time.split(' ')[0]
          if(item.name=="不消毒"){
            dd.confirm({
              title: '警告',
              content: '您将直接结束当前农事环节，是否确定',
              confirmButtonText: '是',
              cancelButtonText: '否',
              success: (result) => {
                console.log(result)
                if(result.confirm==true){
                 that.setData({
                    status: 2
                  })
                  request(api.saveRecord, 'post', {
                    recordId: that.data.activeNeedImg.recordId,
                    date: that.data.modalData.time,
                    content: JSON.stringify(that.arrToStr(that.data.activeNeedImg).content)
                  }).then(res => {
                    if (res.status === 200) {
                      that.choseFarmWorkItem(that.data.tabs.recordId, this.data.tabs.category)
                    
                    }
                    // that.setStorageBanInit(false)
                    // dd.removeStorageSync({key: 'modalData'})
                  })
                }else{
                  that.choseFarmWorkItem(that.data.tabs.recordId, that.data.tabs.category)
                }
              }
            })
          }else  if(item.name=="无底肥"){
            dd.confirm({
              title: '警告',
              content: '您将直接结束当前农事环节，是否确定',
              confirmButtonText: '是',
              cancelButtonText: '否',
              success: (result) => {
                console.log(result)
                if(result.confirm==true){
                 that.setData({
                    status: 2
                  })
                  request(api.saveRecord, 'post', {
                    recordId: that.data.activeNeedImg.recordId,
                    date: that.data.modalData.time,
                    content: JSON.stringify(that.arrToStr(that.data.activeNeedImg).content)
                  }).then(res => {
                    if (res.status === 200) {
                      that.choseFarmWorkItem(that.data.tabs.recordId, this.data.tabs.category)
                    
                    }
                    // that.setStorageBanInit(false)
                    // dd.removeStorageSync({key: 'modalData'})
                  })
                }else{
                  that.choseFarmWorkItem(that.data.tabs.recordId, that.data.tabs.category)
                }
              }
            })
          }
        }
        return item.recordId === activeType
      })
      this.setData({
        activeType,
        activeNeedImg: this.strToArr(activeNeedImg)
      })
      console.log(this.data.activeNeedImg)
    },
    // 点击选择流程
    choseType2(e) {
      const activeType = e.target.dataset.recordId
      if (activeType === this.data.activeType) return
      let activeNeedImg = {}
      this.data.imgArr.some(item => {
        if (item.recordId = activeType) {
          activeNeedImg = item
          activeNeedImg.time = !item.time ? formatDate(new Date()) : item.time.split(' ')[0]
        }
        return item.recordId === activeType
      })
      this.setData({
        activeType,
        activeNeedImg: this.strToArr(activeNeedImg)
      })
    },
    // 默认选中状态
    initModalStatus(id, index, param) {
      if (param.category === 2 && param.status === 2) {
        const obj = []
        this.data.imgArr.forEach(item => {
          const activeNeedImg = this.strToArr(item)
          obj.push({
            ...activeNeedImg
          })
        })
        this.setData({
          allCompleteData: obj
        })
        return
      } 
      const activeType = id
      // 存放选中的模块子项
      this.setData({
        activeType
      })
      // 存放选中的模块子项
      let activeNeedImg = this.strToArr(this.data.imgArr[index])
      activeNeedImg.time = !activeNeedImg.time ? formatDate(new Date()) : activeNeedImg.time.split(' ')[0]
      this.setData({
        activeNeedImg
      })
    },
    // 处理activeNeedImg中的value值为数组
    strToArr(arr) {
      arr.content.forEach(item => {
        if (item.type === '0') {
          const value = item.value
          if (value === '') {
            item.value = []
          } else {
            item.value = typeof value === 'object' ? value : value.split(',')
          }
        } else if (item.type === '2') {
          item.value.forEach(itemValue => {
            if (itemValue.type === '0') {
              const value = itemValue.value
              if (value === '') {
                itemValue.value = []
              } else {
                itemValue.value = typeof value === 'object' ? value : value.split(',')
              }
            }
          })
        }
      })
      return arr
    },
    chosePollination(e) {
      this.setData({
        'pollination.type': e.target.dataset.type,
        'activeNeedImg.content': this.data.pollination.content[e.target.dataset.type]
      })
    }
  }
}