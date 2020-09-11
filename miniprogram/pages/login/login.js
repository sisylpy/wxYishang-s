import {
  disAndUserSave,
  disLogin,
} from '../../lib/apiDistributer'

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




/**
 * 通知，因为只能收到一条信息，所以暂时不用！！！
 * @param {*} e 
 */
  kaiqi(e) {
    console.log(e);
    var that = this;

    if (e.detail.value == 1) {
      wx.requestSubscribeMessage({
        tmplIds: ['-iBBaNT5xYhTafwt6WHjlYuKCcU9-PkpfPAvEv5g91Y'],
        success(res) {
          console.log(res)
          if (res['-iBBaNT5xYhTafwt6WHjlYuKCcU9-PkpfPAvEv5g91Y'] == "accept") {
            that.setData({
              canLogin: true
            })
          } else {
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
    } else {
      that.setData({
        canLogin: false
      })
    }
  },


  getName: function (e) {
    console.log(e)
    if (e.detail.value.length > 0) {
      this.setData({
        name: e.detail.value,
        canLogin: true
      })
    }


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
        load.showLoading("用户登陆中")
        wx.login({
          success: (res) => {
            var disUser = {
              nxDiuCode: res.code,
            }
            disLogin(disUser)
              .then((res) => {
                wx.hideLoading()
                if (res.result.code !== -1) { //登陆成功
                  wx.setStorageSync('userInfo', res.result.data)
                  wx.switchTab({
                    url: '../order/index/index',
                  })
                } else { //登陆失败
                  load.hideLoading();
                  wx.showToast({
                    title: res.result.msg,
                    icon: 'none'
                  })
                }
              })
          },
          fail: (res => {
            load.hideLoading();
            wx.showToast({
              title: res,
              icon: 'none'
            })
          })
        })
      },
      fail: res => {
        wx.showToast({
          title: "请检查网络",
          icon: 'none'
        })
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
            load.showLoading("注册新用户")

            var dep = {
              nxDistributerName: this.data.name,
              nxDistributerPhone: "13910825707",
              nxDistributerManager: "李树国",
              nxDistributerAddress: "京贸物联批发市场D-102",
              nxDistributerImg: "uploadImage/r.jpg",
              nxDistributerUserEntity: {
                nxDiuWxNickName: e.detail.userInfo.nickName,
                nxDiuWxAvartraUrl: e.detail.userInfo.avatarUrl,
                nxDiuCode: res.code,
                nxDiuAdmin: 1,
                roleEntities: [{
                  nxDurRoleId: 0
                }]
              }
            }
            disAndUserSave(dep)
              .then((res) => {
                wx.hideLoading()
                if (res.result.code !== -1) { //注册成功
                  wx.setStorageSync('userInfo', res.result.data)
                  wx.switchTab({
                    url: '../order/index/index',
                  })
                } else { //注册失败
                  wx.showToast({
                    title: res.result.msg,
                    icon: 'none'
                  })
                  load.hideLoading();
                }
              })
          },
          fail: (res => {
            load.hideLoading();
            wx.showToast({
              title: res,
              icon: 'none'
            })
          })
        })
      },
      fail: res => {
        wx.showToast({
          title: "请检查网络",
          icon: 'none'
        })

      }
    })

  },





})