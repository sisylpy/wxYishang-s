//index.js
//获取应用实例
const app = getApp()
const APP_ID = 'wxbc686226ccc443f1 ';//输入小程序appid  
const APP_SECRET = '94973a07634b11e98c03ade8aeb4c213 ';//输入小程序app_secret  
var OPEN_ID = ''//储存获取到openid  
var SESSION_KEY = ''//储存获取到session_k
var FORM_ID = ''//储存获取到的formId

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../list/list'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  
  getOpenIdTap: function (e) {
    var that = this;
    FORM_ID = e.detail.formId;//获取到formId 
    console.log("formId1:" + FORM_ID)
    that.setData({
      formId: FORM_ID
    })
    wx.login({
      success: function (res) {
        wx.request({
          //获取openid接口  
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data: {
            appid: APP_ID,
            secret: APP_SECRET,
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          method: 'GET',
          success: function (res) {
            OPEN_ID = res.data.openid;//获取到的openid  
            SESSION_KEY = res.data.session_key;//获取到session_key 
            console.log("openid:" + OPEN_ID)
            console.log("session_key:" + SESSION_KEY)
            that.setData({
              openid: OPEN_ID,
              session_key: SESSION_KEY
            })
          }
        })
      }
    })
  },
  testSubmit: function (e) {
    var that = this;
    wx.request({
      url: 'http://127.0.0.1:80/pushMsg',
      method: 'POST',
      data: {
        access_token: null,
        openid: OPEN_ID,
        formid: FORM_ID
      },
      success: function (res) {
        that.setData({
          errcode: res.data.errcode,
          errmsg: res.data.errmsg
        })
        console.log(res)
      },
      fail: function (err) {
        console.log('request fail ', err);
      },
      complete: function (res) {
        console.log("request completed!");
      }

    })
  }
})

