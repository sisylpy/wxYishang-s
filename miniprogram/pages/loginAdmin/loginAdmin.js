import {
  loginAdmin,
} from '../../lib/apiDistributer'

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





  getDisId: function (e) {
    console.log(e)
    this.setData({
      disId: e.detail.value
    })
  },

 

  loginAdmin(){
    
    loginAdmin(this.data.disId)
    .then((res) => {
      wx.hideLoading()
      console.log(res.result)   
      if (res.result.code !== -1) {
        wx.setStorageSync('userInfo', res.result.data)
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
  }




})