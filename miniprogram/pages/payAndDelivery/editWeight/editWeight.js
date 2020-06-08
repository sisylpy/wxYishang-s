// miniprogram/pages/order/inputWeight/inputWeight.js
const app = getApp()
const globalData = getApp().globalData;
//getOrderDetail

import apiUrl from '../../../config.js'
import { getOrderDetail } from '../../../lib/apiOrders.js'


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
      nxOrdersId: options.nxOrdersId
    })


    getOrderDetail(this.data.nxOrdersId)
      .then(res => {
        if (res) {
          console.log(res.result.data.nxOrdersCommunityRoom);
          this.setData({
            applyArr: res.result.data.nxOrdersSubEntities,
            customer: res.result.data
          })
        }
        wx.setNavigationBarTitle({
          title: this.data.customer.nxOrdersCommunityRoom,
        })
      })
  },

})