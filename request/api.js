// 生产
// const ApiRootUrl = 'http://kexinfarmsdingding.fpchy.com:8082/api/'

const ApiRootUrl = 'http://192.168.18.236:8443/api/'
// 测试
//  const ApiRootUrl = 'http://kexinfarmsdingding.fpchy.com:8083/api/'

const api = {
  // 普通登录
  login: ApiRootUrl + 'user/login',
  // 钉钉登录
  ddLogin: ApiRootUrl + 'dd/login',
  // 获取用户信息接口
  getUserInfo: ApiRootUrl + 'user/info',
  //获取题库
  getQuestionList: ApiRootUrl + "question/list",
  //提交选择的题
  commitQuestion: ApiRootUrl + "question/add",
    //答完题修改状态
  updataUserInfo: ApiRootUrl + "question/updateScore",
  // 创建农场接口
  createFarm: ApiRootUrl + 'farm/add',
  // 获取三级联动菜单接口
  getFarmMenu: ApiRootUrl + 'farm/menu',
  // 更新地块名称
  updatePlot: ApiRootUrl + 'farm/updatePlot',
    // 合并弄作物和种植接口
  recordStart: ApiRootUrl + 'farm/addCropVarietyCellRecord',
  // // 添加农作物接口
  // addCrop: ApiRootUrl + 'farm/addCropVariety',
  // // 开始种植接口
  // recordStart: ApiRootUrl + 'record/start/',
  // 查询所有父类农事环节接口
  getListRecordMenu: ApiRootUrl + 'record/listRecordMenu/',
  // 获取农事环节页面参数接口
  getParams: ApiRootUrl + 'record/getParams',
  // 上传单个文件
  uploadFile: ApiRootUrl + 'upload/single',
  // 保存农事环节记录
  saveRecord: ApiRootUrl + 'record/add',
  // 追加农事环节接口
  recordAppended: ApiRootUrl +'record/appended',
  // 获取单个农场详情
  getFarmInfo: ApiRootUrl + 'user/farm/',
  // 获取地块信息
  getPlot: ApiRootUrl + 'user/plot',
  // 获取作物列表
  getCropList: ApiRootUrl + 'user/cropVariety',
  // 获取作物详情
  getCropDetail: ApiRootUrl + 'user/varietyDetail',
  // 获取农场列表
  getFarmList: ApiRootUrl + 'user/farm',
  // 编辑农场接口
  updateFarmInfo: ApiRootUrl + 'farm/update',
  // 完善信息
  updateUser: ApiRootUrl + 'user/update',
  // 切换农场
  changeDefaultFarm: ApiRootUrl + 'user/defaultFarm',
  // 删除农场
  deleteFarm: ApiRootUrl + 'farm/delete/',
  // 切换作物
  changePlotCrop: ApiRootUrl + 'user/info'
}

export default api