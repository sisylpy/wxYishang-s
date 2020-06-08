// pages/order/store/store.js
var load = require('../../../lib/load.js');

const globalData = getApp().globalData;
var app = getApp()

import { getOrdersToWeigh } from '../../../lib/apiOrders.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

   
   
  },

  onShow:function(){

    this._getApplyByPageNumber();

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      // beyondKeyHeight: globalData.beyondKeyHeight,
      pickerUserId: options.pickerUserId

    })
    this._getApplyByPageNumber();
  
  },

  _getApplyByPageNumber: function (e) {


    var data = {
      pickerUserId: this.data.pickerUserId,
      status: 1,
    }
    getOrdersToWeigh(data)
      .then(res => {
        if (res) {
          console.log(res.result.data)
          this.setData({
            orderArr: res.result.data
          })
        }
      })

  },

  customerApplys:function(e) {
    console.log(e);
    var nxOrdersId = e.currentTarget.id;
    wx.navigateTo({
      url: '../ordersDetail/ordersDetail?nxOrdersId=' + nxOrdersId,
    })
  },








  
})