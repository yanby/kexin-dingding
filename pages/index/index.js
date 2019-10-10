import animModal from '/utils/items'
import { formatDate } from '/utils/utils'
import indexFirst from '/utils/index-first/index'
import indexNoComplete from '/utils/index-nocomplete/index'
import { getUserInfo } from '/utils/utils'

import api from '/request/api'
import request from '/request/request'

// 标题组件所需数据
const keXinTitle = {
  data: {
    plotType: 0,
    farmName: '',
    title: '',
    treeData: [],
    firstTree: [],
    secondTree: [],
    thirdTree: [],
    num: ""
  },
  methods: {
    choseBoxType(type) {
      // 接口-获取三级联动菜单接口
      request(api.getFarmMenu, 'get', {
        farmId: dd.getStorageSync({key: 'farmInfo'}).data.farmId,
        plotType: type,
        switchFlag: 1
      }).then(res => {
        console.log(res)
        if (res.status === 200) {
          if(res.data.length){
            this.setData({
              'keXinTitle.treeData': res.data,
              'keXinTitle.firstTree': res.data,
              'keXinTitle.secondTree': res.data[0].list,
              'keXinTitle.thirdTree': res.data[0].list[0].list
            })
          }
        }
      })
    },
    changePlotCrop(val) {
      const firstDataIndex = val[0]
      const secondDataIndex = val[1]
      this.setData({
        'keXinTitle.firstTree': this.data.keXinTitle.treeData,
        'keXinTitle.secondTree': this.data.keXinTitle.treeData[firstDataIndex].list,
        'keXinTitle.thirdTree': this.data.keXinTitle.treeData[firstDataIndex].list[secondDataIndex].list
      })
    },
    // 初始化标题栏数据
    initTitle() {
      this.setData({
        'keXinTitle.title': dd.getStorageSync({key: 'plotCropInfo'}).data.name,
        'keXinTitle.farmName': dd.getStorageSync({key: 'farmInfo'}).data.name
      })
      // 接口-获取三级联动菜单接口
      request(api.getFarmMenu, 'get', {
        farmId: dd.getStorageSync({key: 'farmInfo'}).data.farmId,
        plotType: this.data.keXinTitle.plotType,
        switchFlag: 1
      }).then(res => {
        if (res.status === 200) {
           if(res.data.length){
              this.setData({
              'keXinTitle.treeData': res.data,
              'keXinTitle.firstTree': res.data,
              'keXinTitle.secondTree': res.data[0].list,
              'keXinTitle.thirdTree': res.data[0].list[0].list
            })
           }
        }
      })
    },
  }
}

// 农事环节组件所需数据
const farmWork = {
  data: {
    activeTab: 0,
    tabs: [],
  },
  methods: {
    // 获取农事环节tabs
    httpGetList() {
      if (!dd.getStorageSync({key: 'plotCropInfo'}).data.plotCropId) {
        dd.alert({
          title: '提示',
          content: '您当前暂无正在种植的作物，请前往个人中心开始种植作物',
          success: () => {
            dd.navigateTo({
              url: '/pages/home/index'
            })
          }
        })
        return
      }
      request(api.getListRecordMenu + dd.getStorageSync({key: 'plotCropInfo'}).data.plotCropId, 'get').then(res => {
        if (res.status === 200) {
          this.setData({
            'farmWork.tabs': res.data
          })
          if(!res.data.length){
            return;
          }
          // this.setData({
          //   'farmWork.activeTab': this.data.farmWork.tabs[0].recordId
          // })
          this.choseFarmWorkItem(res.data[0].recordId, res.data[0].category)
        }
      })
    },
    // 切换农事环节的回调函数
    choseFarmWorkItem(recordId, category, farmingId) {
      this.setData({
        'farmWork.activeTab': recordId
      })
      this.setData({
        tabs: {
          recordId,
          category
        }
      })
      request(api.getParams, 'get', {
        recordId,
        category
      }).then(res => {
        console.log(res)
        console.log(category)
        this.setData({
          'pollination.farmingId': farmingId
        })
        // 判断当前农事环节类型，0 直接拍摄；1 前置任务；2 细分子任务
        this.setData({
          type: category
        })
        if (res.status === 200) {
          const list = res.data
          let index = 0; // 默认显示数据索引
          // 判断当前农事环节开始状态
          if ((list.length > 1 && category !== 2) || (list.length === 1 && list[0].status === 0)) {
            // 未开始
            this.setData({
              status: 0
            })
          }else if (list.length === 1 && list[0].status === 1) {
            // 未完成
            this.setData({
              status: 1
            })
          } else if (list.length === 1 && list[0].status === 2) {
            // 已完成
            this.setData({
              status: 2
            })
          } else if (category === 2) {
            const isAllComplete = list.every(item => item.status === 2) // 遍历细分子任务，是否全部完成
            const isNotStart = list.some(item => item.status === 0) // 遍历细分子任务，是否存在未开始
            const isNotComplete = list.some(item => item.status === 1) // 遍历细分子任务，是否存在未完成数据
            // 全部未开始，显示未开始页面，且默认第一条
            // 存在未完成，显示未完成页面，数据为当前未完成页面
            // 没有未完成，有未开始，显示未开始页面，数据为未开始数据
            // 全部完成, 显示完成页面
            if (isAllComplete) {
              this.setData({
                status: 2
              })
              index = list.length - 1
            } else if (isNotComplete) {
              list.some((item, itemIndex) => {
                if (item.status === 1) {
                  index = itemIndex
                  return true
                }
              })
              this.setData({
                status: 1
              })
            } else if (isNotStart) {
              list.some((item, itemIndex) => {
                if (item.status === 0) {
                  index = itemIndex
                  return true
                }
              })
              this.setData({
                status: 0
              })
            }
          }
          // 存放农事环节下的所有数据
          this.setData({
            imgArr: res.data
          })
          this.initIndex()
          // 初始化activeNeedImg数据
          this.initModalStatus(this.data.imgArr[index].recordId, index, {category, status: this.data.status})
        }
        if (this.data.query.repeat === 'true') {
          this.setData({
            'query.repeat': false
          })
          this.choseFarmWorkItem(Number(this.data.query.recordId), Number(this.data.query.catagory))
        }
      })
    }
  }
}

Page({
  data: {
    keXinTitle: keXinTitle.data,
    farmWork: farmWork.data,
    imgIndex: 0,
    imgArr: [],
    activeNeedImg: {},
    modalData: {
      hidden: true,
      time: formatDate(new Date()),
      value: [],     // 基本图片
      content: [],
      name: '土壤消毒闭棚前地表整体'
    },
    status: 0,
    childrenData: [],
    ...animModal.data,
    ...indexFirst.data,
    ...indexNoComplete.data,
    authCode: '',
    tabs: {},
    allCompleteData: [],
    query: {}
  },
  initIndex() {
    const typeArr2 = this.data.imgArr[0].content.filter(item => item.type === '2')
    this.setData({
      childrenData: typeArr2
    })
    if (this.data.status === 1) {
      this.init()
    }
  },
  onLoad(query) {

    this.setStorageBanInit(false)
    getUserInfo().then(() => {
      if (!dd.getStorageSync({key: 'userInfo'}).data.farm) {
        dd.redirectTo({
          url: '/pages/create-farm/index?score=' + this.data.userInfo.answerScore + '&type=create'
        })
        return
      }
      this.setData({
        query
      })
      if (!dd.getStorageSync({key: 'banInit'}).data) {
        this.initTitle()
        this.httpGetList()
      }
    })
  },
  onShow() {
    // 页面显示
    getUserInfo().then(() => {
      if (!dd.getStorageSync({key: 'userInfo'}).data.farm) {
        dd.redirectTo({
          url: '/pages/create-farm/index?score=' + this.data.userInfo.answerScore + '&type=create'
        })
        return
      }
      if (!dd.getStorageSync({key: 'banInit'}).data) {
        this.initTitle()
        this.httpGetList()
      }
      // 更新modalData数据
      if (dd.getStorageSync({key: 'modalData'}).data && dd.getStorageSync({key: 'modalData'}).data.length > 0) {
        this.setData({
          'modalData.content': dd.getStorageSync({key: 'modalData'}).data
        })
      }
    })
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
  // 设置banInit存储，true: 禁止初始化， false：允许初始化
  setStorageBanInit(bol) {
    dd.setStorageSync({
      key: 'banInit',
      data: bol
    })
  },
  // 下拉框逻辑
  ...animModal.animOp,
  // index-first 的操作逻辑
  ...indexFirst.methods,
  ...indexNoComplete.methods,
  // 标题组件methods
  ...keXinTitle.methods,
  // 农事环节组件methods
  ...farmWork.methods
});
