// pages/weight/ordersGoodsCate/ordersGoodsCate.js

const app = getApp()
const globalData = getApp().globalData;
//getOrderDetail

import apiUrl from '../../../config.js'
import { getOrderCate } from '../../../lib/apiOrders.js'

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
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      distributerId: globalData.distributerId,
      nxOrdersId: options.nxOrdersId,
      url: apiUrl.server,

    })


    getOrderCate(this.data.nxOrdersId)
      .then(res => {
        if (res) {
          console.log(res.result.data);
          this.setData({
            cateArr: res.result.data,
          })
        }
        
      })

  },

  clickCate(e){
    var fatherId = e.currentTarget.dataset.id;
    console.log(fatherId);
    wx.navigateTo({
      url: '../commGoodsOfSubOrder/commGoodsOfSubOrder?fatherId=' + fatherId,
    })



  }






})