import {
  disAndUserSave,
  disLogin,
} from '../../lib/apiBasic'

const globalData = getApp().globalData;
var load = require('../../lib/load.js');

Page({

  data: {

  },

  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
    })

  },







  getName: function (e) {
    console.log(e)
    this.setData({
      name: e.detail.value
    })

  },



  //微信授权点击“允许”
  getUserInfo: function (e) {
    console.log(e);

    console.log(e.currentTarget.dataset.type);
  if(e.currentTarget.dataset.type == "register"){
    this._register(e);
  }if(e.currentTarget.dataset.type == "login"){
    this._login(e);
  }

   


  },
  _login(){

    wx.getUserInfo({
      success: res => {
        wx.login({
          success: (res) => {
            var disUser = {
                nxDiuCode: res.code,
            }
    
    
            load.showLoading("用户登录中")
            disLogin(disUser)
              .then((res) => {
                wx.hideLoading()
                console.log(res.result)
                if (typeof cb === 'function') {
                  cb()
                }
                if (res.result.code !== -1) {
                  wx.setStorageSync("disInfo", res.result.data)
                  wx.redirectTo({
                    url: '../index/index',
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


  _register(e){
 //用户点击“确认”
 wx.getUserInfo({
  success: res => {
    wx.login({
      success: (res) => {
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


        load.showLoading("用户登录中")
        disAndUserSave(dep)
          .then((res) => {
            wx.hideLoading()
            if (typeof cb === 'function') {
              cb()
            }
            if (res.result.code !== -1) {
              wx.setStorageSync("disInfo", res.result.data)
              wx.redirectTo({
                url: '../index/index',
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