import {
  disAndUserSave,
  disLogin,
} from '../../lib/apiBasic'

const globalData = getApp().globalData;
var load = require('../../lib/load.js');

Page({

  data: {
    canLogin: false,
    accept: false


  },

  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
    })

  },





  kaiqi(e) {
    console.log(e);
    var that = this;

    if (e.detail.value == 1) {
      wx.requestSubscribeMessage({
        tmplIds: ['-iBBaNT5xYhTafwt6WHjlYuKCcU9-PkpfPAvEv5g91Y'],
        success(res) {
          console.log(res)
          if(res['-iBBaNT5xYhTafwt6WHjlYuKCcU9-PkpfPAvEv5g91Y'] == "accept"){
            that.setData({
              canLogin: true
            })
          }
          else{
            that.setData({
              accept: false
            })
          }
        
        },
        fail(res) {

          console.log('fail  失败')

          console.log(res)
        },
      })
    }else{
      that.setData({
        canLogin: false
      })
    }



  },


  getName: function (e) {
    console.log(e)
    this.setData({
      name: e.detail.value
    })

  },



  //微信授权点击“允许”
  getUserInfo: function (e) {

    if (e.currentTarget.dataset.type == "register") {
      
      this._register(e);
    }
    if (e.currentTarget.dataset.type == "login") {
      this._login(e);
    }
  },


  _login() {

    wx.getUserInfo({
      success: res => {
        load.showLoading("用户登录中")
        wx.login({
          success: (res) => {
            var disUser = {
              nxDiuCode: res.code,
            }


            disLogin(disUser)
              .then((res) => {
                wx.hideLoading()
                console.log(res.result)
                if (typeof cb === 'function') {
                  cb()
                }
                if (res.result.code !== -1) {
                  wx.setStorageSync("userInfo", res.result.data);
                  wx.switchTab({
                    url: '../order/order',
                  })

                } else {
                  load.hideLoading();
                  wx.showToast({
                    title: res.result.msg,

                  })
                }
              })
          },
          fail: (res => {
            load.hideLoading();
            wx.showToast({
              title: res,

            })

            console.log(res)
          })
        })
      },
      fail: res => {
        console.log("quxiaole userinfo......")
        // 获取失败的去引导用户授权 

      }
    })





  },


  _register(e) {
    //用户点击“确认”
    var that = this;
    wx.getUserInfo({
      success: res => {
        wx.login({
          success: (res) => {
            load.showLoading("用户登录中")

            var dep = {
              nxDistributerName: this.data.name,
              nxDistributerUserEntity: {
                nxDiuWxNickName: e.detail.userInfo.nickName,
                nxDiuWxAvartraUrl: e.detail.userInfo.avatarUrl,
                nxDiuCode: res.code,
                roleEntities: [{
                  nxDurRoleId: 0
                }]
              }
            }
            disAndUserSave(dep)
              .then((res) => {
                wx.hideLoading()
                if (typeof cb === 'function') {
                  cb()
                }
                if (res.result.code !== -1) {

                  wx.setStorageSync("userInfo", res.result.data);
                  wx.switchTab({
                    url: '../order/order',
                  })


                } else {
                  wx.showToast({
                    title: res.result.msg,
                  })
                  load.hideLoading();
                }
              })
          },
          fail: (res => {
            load.hideLoading();

            console.log(res)
          })
        })
      },
      fail: res => {
        console.log("quxiaole userinfo......")
        // 获取失败的去引导用户授权 

      }
    })
   
  },





})