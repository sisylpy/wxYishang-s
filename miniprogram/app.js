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
    disId: null,
    tab1Index: null
  },

  onLaunch: function (ops) {

    // 获取用户信息
    // wx.getSetting({
    //   withSubscriptions: true,
    //   success: res => {
    //     console.log(res)
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           console.log("000-------00000000")
    //           console.log(res);
    //           this.globalData = {
    //             avatarUrl: res.userInfo.avatarUrl,
    //             nickName: res.userInfo.nickName
    //           }
    //           // console.log(this.globalData);
    //         }
    //       })
    //     }
    //   }
    // })


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



    if (ops.scene == 1044) {
      console.log(ops.shareTicket);
      wx.getShareInfo({
        shareTicket: opt.shareTicket,
        success: function (res) {
          var encryptedData = res.encryptedData;
          var iv = res.iv;
          console.log(iv);
          console.log("ivivvivi");


        }
      })
    }

   



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