Component({
  /**
   * 组件的属性列表
   */
  props: {
    // 最小值
    min: 0,
    //最大值
    max: 100,
    // 是否开启整数模式
    int: true,
    // 每个格子的长度（只能是 1 ，2 ，5 一个能被10整除的数字 ）
    step: 1,
    // 每个格子的实际行度 （单位px ，相对默认值）
    single: 10,
    // 卡尺左右的余量 ，最为60
    fiexNum: 60,
    // 高度
    h: 80,
    // 当前选中 
    active: {
      value: '0',
      observer(newVal, oldVal, changedPath) {
        let rul = this.data.rul
        rul.active = newVal
        console.log('a')
        let centerNum = this.assignValue(this, rul)
        this.setData({
          centerNum,
          rul
        })
      }
    },
    styles: {
      type: Object,
      value: {
        line: '#dbdbdb',
        bginner: '#fbfbfb',
        bgoutside: '#dbdbdb',
        lineSelect: '#52b8f5',
        font: '#404040'
      }
    },
    onValue: () => {}

  },

  /**
   * 组件的初始数据
   */
  data: {
    imageWidth: '',
    fiexNum: '',
    bgoutside: '#dbdbdb',
    lineSelect: '#52b8f5',
    scaleId: '',
    rul: {},
    assingOldVal: -1
  },
  didMount() {
    // 每次初始化 全局变量
    this._init()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 绘制
     * 生成卡尺
     */
    draw(num, total, {
      self,
      rul
    }) {
      let canvasHeight = 80;
      let ctx = dd.createCanvasContext('canvasid');
      //  绘制背景
      ctx.save()
      ctx.setFillStyle(rul.styles.bginner)
      ctx.fillRect(0, 0, total, canvasHeight)
      ctx.restore()
      ctx.beginPath()
      ctx.setLineWidth(1)
      ctx.setStrokeStyle(rul.styles.line)
      ctx.moveTo(rul.FIXED_NUM / 2, 0)
      ctx.lineTo(total - rul.FIXED_NUM / 2, 0)
      ctx.stroke()
      console.log(rul.unitNum)
      for (let i = 0; i < rul.unitNum + 1; i++) {
        // 绘制文字
        if (i % (rul.single / rul.step) === 0) {
          ctx.setFontSize(18)
          ctx.setFillStyle(rul.styles.font)
          ctx.setTextAlign('center')
          if (self.props.int) {
            const wenzi = i * rul.step + rul.minNum
            ctx.fillText(wenzi, rul.FIXED_NUM / 2 + (i * rul.spa), canvasHeight - 15)
          } else {
            const wenzi = i / (rul.single / rul.step) + rul.minNum
            console.log(wenzi, rul.FIXED_NUM / 2 + (i * rul.spa))
            ctx.fillText(wenzi, rul.FIXED_NUM / 2 + (i * rul.spa), canvasHeight - 15)
          }
        }
        // 绘制刻度
        if (i % 5 === 0) {
          ctx.beginPath()
          ctx.setLineWidth(2)
          ctx.setStrokeStyle(rul.styles.line)
          ctx.moveTo(rul.FIXED_NUM / 2 + (i * rul.spa), 0)
          ctx.lineTo(rul.FIXED_NUM / 2 + (i * rul.spa), canvasHeight / 2)
          ctx.stroke()
        } else {
          ctx.beginPath()
          ctx.setLineWidth(1)
          ctx.setStrokeStyle(rul.styles.line)
          ctx.moveTo(rul.FIXED_NUM / 2 + (i * rul.spa), 0)
          ctx.lineTo(rul.FIXED_NUM / 2 + (i * rul.spa), canvasHeight - 50)
          ctx.stroke()
        }
      }
      ctx.draw(true, setTimeout(() => {
        ctx.toTempFilePath({
          x: 0,
          y: 0,
          width: total,
          height: canvasHeight,
          // destWidth: total * 4,
          // destHeight: canvasHeight * 4,
          success(res) {
            console.log(res)
            // 改变高度重新计算
            rul.total = rul.total / 80 * rul.h
            rul.FIXED_NUM = rul.FIXED_NUM / 80 * rul.h
            // let centerNum = self.data.int ?
            //   ((rul.active - rul.minNum) / rul.step) *
            //   parseInt(rul.total - rul.FIXED_NUM) / rul.num * rul.step :
            //   ((rul.active - rul.minNum) * 10 / rul.step) *
            //   parseFloat((rul.total - rul.FIXED_NUM)) / rul.num / (rul.single / rul.step)
            let centerNum = self.assignValue(self, rul)
            self.setData({
              ruler: res.filePath,
              centerNum,
              width: rul.total,
              h: rul.h,
              fiexNum: rul.FIXED_NUM,
              round: self.props.int ? rul.minNum : rul.minNum.toFixed(1),
              bgoutside: rul.styles.bgoutside,
              lineSelect: rul.styles.lineSelect,
            })
            self.props.onValue(self.data.round)
          },
          fail(e) {
            console.log(e)
          }
        })
      }, 500));
    },
    /**
     * 获取滑动的值
     */
    bindscroll: function(e) {
      let rul = this.data.rul
      // 移动距离
      let left = e.detail.scrollLeft;
      // 单格的实际距离
      let spa;
      // 判断是否是整数
      if (this.props.int) {
        spa = parseInt(rul.total - rul.FIXED_NUM) / rul.num * rul.step;
      } else {
        spa = parseFloat(rul.total - rul.FIXED_NUM) / rul.num / (rul.single / rul.step);
      }
      // 当前显示值
      let resultNum = Math.round(left / spa);
      console.log('resultNum', resultNum)
      // 还原为实际数值
      let redNum = Math.round(resultNum * spa)
      console.log('redNum', redNum)
      // 小数位处理
      resultNum = this.props.int ? resultNum * rul.step + rul.minNum : ((resultNum * rul.step) / 10 + rul.minNum).toFixed(1)
      if (this.data.assingOldVal === resultNum) return
      this.setData({
        round: resultNum,
        assingOldVal: resultNum
      })
      this.props.onValue(resultNum)
      clearTimeout(rul.Timer);
      rul.Timer = setTimeout(() => {
        this.setData({
          round: resultNum,
          active: resultNum,
          assingOldVal: resultNum
        })
        this.props.onValue(resultNum)
      }, 200)
    },
    /** 
     * 初始化卡尺
     */
    _init() {
      let self = this
      let rul = {
        spa: '', // 单个格子的距离
        unitNum: '', // 格子总数
        minNum: this.props.min,
        maxNum: this.props.max,
        num: this.props.max - this.props.min, // 仿数据总数
        FIXED_NUM: this.props.fiexNum, // 标尺左右空余部分
        single: this.props.single,
        step: this.props.step,
        h: this.props.h,
        active: '',
        styles: this.props.styles
      }
      this._getErro(rul)
      //  获取节点信息，获取节点宽度
      var query = dd.createSelectorQuery()
      query.select('#scale-wrapper').boundingClientRect().exec((e) => {
        // 获节点宽度
        rul.windowWidth = e[0].width;
        // 判断是否使用整数类型
        if (self.props.int) {
          rul.unitNum = rul.num / rul.step;
        } else {
          rul.unitNum = rul.num * (rul.single / rul.step);
        }
        // 设置单个格子的长度
        rul.spa = rul.single * rul.step;
        rul.total = rul.spa * rul.unitNum + rul.FIXED_NUM
        self.setData({
          windowWidth: e[0].width,
          width: rul.total,
          fiexNum: rul.FIXED_NUM,
          rul
        })
        self.draw(rul.num, rul.total, {
          self,
          rul
        });
      })
    },
    /**
     * 输出错误信息
     */
    _getErro(rul) {
      // 判断 最大值 最小值 是否 正确
      if (rul.minNum >= rul.maxNum) {
        console.error("您输入的最大值 小于最小值，请检查 minNum ， maxNum")
        rul.minNum = 0;
        rul.maxNum = 100
        rul.num = rul.maxNum - rul.minNum
      }
      // 判断 是否开启整数类型
      // if (rul.step !== 1 && rul.step !== 2 && rul.step !== 5) {
      //   console.error("步长只能是 1 ，2  ，5  ,请检查 step")
      //   rul.step = 1
      // }
      if (rul.FIXED_NUM < 60) {
        console.warn('左右余量 输入小于 60 ，可能影响显示效果，请检查 fiexNum')
        if (!rul.FIXED_NUM) {
          rul.FIXED_NUM = 60
        }
        if (rul.FIXED_NUM < 0) {
          console.error('左右余量最小为0  ，请检查 fiexNum')
          rul.FIXED_NUM = 0;
        }
      }
      if (rul.single < 10) {
        console.warn('格子单位小于10 ，可能影响显示效果，请检查 single')
        if (!rul.single) {
          rul.single = 10
        }
      }
      if (rul.h < 50) {
        console.warn('格子单位小于50 ，可能影响显示效果，请检查 h')
        if (!rul.h) {
          rul.h = 80
        }
        if (rul.h < 20) {
          console.error('高度最小为20  ，请检查 h')
          rul.h = 20;
        }
      }
      // 当前选中位置设置
      if (this.props.active === 'min') {
        rul.active = rul.minNum
      } else if (this.props.active === 'max') {
        rul.active = rul.maxNum
      } else if (this.props.active === 'center') {
        rul.active = (rul.maxNum + rul.minNum) / 2
      } else {
        rul.active = this.props.active
      }
      if (this.props.active !== 'min' && this.props.active !== 'max' && this.props.active !== 'center') {
        // console.log("任意数值")
        if (rul.active < rul.minNum || rul.active > rul.maxNum) {
          console.error('您输入的数值（active）超入范围，请检查 active')
        }
        if (rul.active % rul.step !== 0 && rul.int) {
          console.warn("您输入的数值（active）不是合法数值，请检查，所以导致结果可能有错误")
        }
        if (rul.active * 10 % rul.step !== 0 && !rul.int) {
          console.warn("您输入的数值（active）不是合法数值，请检查，所以导致结果可能有错误")
        }
      }

      if (!rul.styles) {
        rul.styles = {}
        if (!rul.styles.line) {
          rul.styles.line = '#dbdbdb'
        }
        if (!rul.styles.lineSelect) {
          rul.styles.lineSelect = '#52b8f5'
        }
        if (!rul.styles.bginner) {
          rul.styles.bginner = '#fbfbfb'
        }
        if (!rul.styles.bgoutside) {
          rul.styles.bgoutside = '#dbdbdb'
        }
        if (!rul.styles.font) {
          rul.styles.font = '#404040'
        }
      } else {
        if (!rul.styles.line) {
          rul.styles.line = '#dbdbdb'
        }
        if (!rul.styles.lineSelect) {
          rul.styles.lineSelect = '#52b8f5'
        }
        if (!rul.styles.bginner) {
          rul.styles.bginner = '#fbfbfb'
        }
        if (!rul.styles.bgoutside) {
          rul.styles.bgoutside = '#dbdbdb'
        }
        if (!rul.styles.font) {
          rul.styles.font = '#404040'
        }
      }
    },
    assignValue(self, rul) {
      return self.props.int ?
        ((rul.active - rul.minNum) / rul.step) *
        parseInt(rul.total - rul.FIXED_NUM) / rul.num * rul.step :
        ((rul.active - rul.minNum) * 10 / rul.step) *
        parseFloat((rul.total - rul.FIXED_NUM)) / rul.num / (rul.single / rul.step)
    }
  }
})