// import questionList from '../../utils/question';
import request from '/request/request'
import api from '/request/api'

Page({
  data: {
    order: 1,
    questionList: "",
    radioValue: "",
    newQuestionList: ""
  },
  onLoad(query) {
    this.setData({
      order: Number(query.order)
    })
     this.getQuestionList();
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
  getQuestionList(){
    var that = this;
    request(api.getQuestionList, 'get',{
      lineNo: that.data.order-1
    }).then(res => {
      console.log(res)
      if (res.status === 200) {
         this.setData({
          questionList: res.data,
          newQuestionList: res.data[0].answersList
        })
      }
    })
  },
  radioChange(e) {
    console.log(e)
    this.setData({
      radioValue: e.detail.value
    })
    // const score = {
    //   A: 10,
    //   B: 6,
    //   C: 2
    // }
    // const scoreStorage = dd.getStorageSync({ key: 'score' }).data || []
    // scoreStorage[this.data.order - 1] = score[e.detail.value]
    // dd.setStorageSync({
    //   key: 'score',
    //   data: scoreStorage
    // })
  },
  //点击下一题的时候如果
  nextQuestion() {
    var that = this;
    
    if(that.data.radioValue==""){
      dd.showToast({
        type: 'fail ',
        content: '请先选择您的答案'
      })
      return
    }else{ 
      this.data.newQuestionList.forEach(function(item,index){
        if(item.options == that.data.radioValue){
          request(api.commitQuestion, 'post',{
            answerId: item.answerId,
            questionId: item.questionId
          }).then(res => {
            console.log(res)
            if (res.status === 200) {
              
              request(api.getQuestionList, 'get',{
                lineNo: that.data.order
              }).then(res1 => {
                console.log(res1)
                if (res1.status === 200) {
                  if(res1.data.length == 0){ 
                    request(api.updataUserInfo, 'get').then(res => {
                      console.log(res)
                      if (res.status === 200) {
                        console.log("答完题了")
                      }
                    })   
                    dd.redirectTo({
                      url: '/pages/question-end/index'
                    })
                  }else{
                    dd.redirectTo({
                      url: `/pages/question/index?order=${ that.data.order + 1 }`
                    })
                  }
                }
              })
            }
          })
        }
      })
    }
   
   
  //   const scoreStorage = dd.getStorageSync({ key: 'score' })
  //   if (!scoreStorage.data || !scoreStorage.data[this.data.order - 1]) {
  //     dd.showToast({
  //       type: 'fail ',
  //       content: '请先选择您的答案'
  //     })
  //     return
  //   }
  //   if (this.data.order === 10) {
  //     dd.redirectTo({
  //       url: '/pages/question-end/index'
  //     })
  //   } else {
  //     dd.redirectTo({
  //       url: `/pages/question/index?order=${ this.data.order + 1 }`
  //     })
  //   }
  }
});
