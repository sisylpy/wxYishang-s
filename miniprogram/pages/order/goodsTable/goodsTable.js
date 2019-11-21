// pages/storeApplys/storeApplys.js

const app = getApp()
const globalData = getApp().globalData;

import {
  getGoodsList
} from '../../../lib/apiOrder.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    limit: 20,
    page: 1,



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      fatherId: options.fatherId
    })
    var data = {
      limit: this.data.limit,
      page: this.data.page,
      fatherId: this.data.fatherId
    }
    getGoodsList(data)
      .then(res => {
        if (res) {
          console.log(res);
          this.setData({
            goodsArr: res.result.page.list

          })
        }
      })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})