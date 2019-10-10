export default {
  data: {
    childrenData: []
  },
  methods: {
    init() {
      const typeArr2 = this.data.imgArr[0].content.filter(item => item.type === '2')
      const arr = []
      typeArr2.forEach(itemEach => {
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
    }
  }
}