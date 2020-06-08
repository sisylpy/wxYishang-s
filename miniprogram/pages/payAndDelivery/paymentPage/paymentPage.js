// miniprogram/pages/order/ordersPage/paymentPage/paymentPage.js


var load = require('../../../lib/load.js');

const globalData = getApp().globalData;
var app = getApp()

import apiUrl from '../../../config.js';

import {
  getOrderDetail, sendCrl
} from '../../../lib/apiOrders.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    wx.setNavigationBarTitle({
      "title": "通知客户付款",
    }),


      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#2d5a5f',
        animation: {
          duration: 200,
          timingFunc: 'easeIn'
        }
      })


    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      distributerId: globalData.distributerId,
      nxOrdersId: options.nxOrdersId
    })


    getOrderDetail(this.data.nxOrdersId)
      .then(res => {
        if (res) {
          console.log(res.result.data);
          this.setData({
            applyArr: res.result.data.nxOrdersSubEntities,
            order: res.result.data
          })
        }

      })

  },

  toPaymentInfo:function(e){

      console.log("send")
      sendCrl(e.currentTarget.dataset.id).
        then(res => {
          if (res.result.code == 0) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
  },

 








})