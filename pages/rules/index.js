Page({
  data: {
    value: 0,
    val: 0,
    value2: 0,
    styles: [{
      line: '#dbdbdb',
      bginner: '#fbfbfb',
      bgoutside: '#dbdbdb',
      lineSelect: '#52b8f5',
      font: '#333333'
    }, {
      line: '#dbdbdb',
      bginner: '#fbfbfb',
      bgoutside: '#dbdbdb',
      lineSelect: '#52b8f5',
      font: '#333333'
    }]
  },
  bindvalue: function(e) {
    console.log(e.detail.value)
    this.setData({
      value: e.detail.value
    })
  },
  bindvalue2: function(e) {
    this.setData({
      value2: e
    })
  },
  assignment() {
    this.setData({
      val: 50
    })
  }
})