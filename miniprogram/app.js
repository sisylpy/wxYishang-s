//app.js

App({

  globalData: {
    currentMonthData: [],
    nickname: null,
    avatarUrl: null,
    windowWidth: null,
    widowHeight: null,
    platform: "",
    model: "",
    version: "",
    system: "",
    SDKVersion: "",
    tab1Index: null,
  },

  onLaunch: function (ops) {

    wx.getSystemInfo({
      success: (res) => {
        console.log(res);
        let width = res.windowWidth,
          height = res.windowHeight,
          rpxR = 750 / width,
          screenHeight = res.screenHeight,
          statusBarHeight = res.statusBarHeight,
          pixelRatio = res.pixelRatio,
          platform = res.platform,
          model = res.model,
          version = res.version,
          system = res.system,
          SDKVersion = res.SDKVersion
        this.globalData = {
          windowWidth: width,
          windowHeight: height,
          screenHeight: screenHeight,
          statusBarHeight: statusBarHeight,
          scale: width / 375,
          pixelRatio: pixelRatio,
          rpxR: rpxR,
          platform: platform,
          model: model,
          version: version,
          system: system,
          SDKVersion: SDKVersion,
        }
      }
    })



     //update
     if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // console.log('onCheckForUpdate====', res)
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          // console.log('res.hasUpdate====')
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                console.log('success====', res)
                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    }
    //.update

   



  },

  getModel: function () { //获取手机型号
    return this.globalData["model"]
  },
  getVersion: function () { //获取微信版本号
    return this.globalData["version"]
  },
  getSystem: function () { //获取操作系统版本
    return this.globalData["system"]
  },
  getPlatform: function () { //获取客户端平台
    return this.globalData["platform"]
  },
  getSDKVersion: function () { //获取客户端基础库版本
    return this.globalData["SDKVersion"]
  },

  getPlatform: function () { //获取客户端平台

    return this.globalData["platform"]
  },


  BLEInformation: {
    platform: "",
    deviceId: null,
    writeCharaterId: "",
    writeServiceId: "",
    notifyCharaterId: "",
    notifyServiceId: "",
    readCharaterId: "",
    readServiceId: "",
  }

   



})