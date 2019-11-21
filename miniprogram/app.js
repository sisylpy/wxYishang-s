//app.js
App({

  globalData: {
    currentMonthData: [],
    nickname: null,
    avatarUrl: null,
    windowWidth: null,
    widowHeight: null,
  },

  onLaunch: function (ops) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.globalData = {
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName
              }
              // console.log(this.globalData);
            }
          })
        }
      }
    })


    wx.getSystemInfo({
      success: (res) => {
        let width = res.windowWidth,
          height = res.windowHeight,
          rpxR = 750 / width,
          screenHeight = res.screenHeight,
          statusBarHeight = res.statusBarHeight,
          pixelRatio = res.pixelRatio
        this.globalData = {
          windowWidth: width,
          windowHeight: height,
          screenHeight: screenHeight,
          statusBarHeight: statusBarHeight,
          scale: width / 375,
          pixelRatio: pixelRatio,
          rpxR: rpxR,
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



  }



})

