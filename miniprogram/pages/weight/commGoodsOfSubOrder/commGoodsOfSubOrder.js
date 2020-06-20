// pages/weight/commGoodsOfSubOrder/commGoodsOfSubOrder.js


const app = getApp()
const globalData = getApp().globalData;
//getOrderDetail

import apiUrl from '../../../config.js'
import { getCommGoodsOfSubs, } from '../../../lib/apiOrders.js'


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
      fatherId: options.fatherId
    })

    getCommGoodsOfSubs(this.data.fatherId).then(res => {
      if(res) {
        console.log(res.result.data)
        this.setData({
          commGoodsArr: res.result.data,
          
        })
      }
    })

  },




})