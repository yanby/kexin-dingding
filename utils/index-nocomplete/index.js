import { formatDate } from '/utils/utils'

export default {
  data: {
    hasTextContent: false,
    hasCompleteTextContent: false,
    hasChildrenCompleteTextContent: []
  },
  methods: {
    init() {
      const arr = []
      this.data.childrenData.forEach(itemEach => {
        arr.push({
          hasShowText: itemEach.value.some(item => item.type === '1'),
          hasShowCompleteText: !itemEach.value.some(item => item.type === '1' && item.flag === '0')
        })
      })
      this.setData({
        hasTextContent: this.data.imgArr[0].content.some(item => item.type === '1'),
        hasCompleteTextContent: !this.data.imgArr[0].content.some(item => !(item.type === '1' && item.flag === '0')),
        hasChildrenCompleteTextContent: arr
      })
    },
    linkModal(e) {
      const hasClick = e.target.dataset.disableClick
      if (hasClick) return
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
    }
  }
}