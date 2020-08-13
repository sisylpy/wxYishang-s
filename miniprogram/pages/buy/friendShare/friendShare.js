// pages/storeApplys/storeApplys.js

const globalData = getApp().globalData;
import {
  getPurchaseGoodsBatch,
} from '../../../lib/apiDepOrder'

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
      batchId: 13,
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
    })
    
    getPurchaseGoodsBatch(13)
      .then(res => {
        if (res) {
          console.log(res);
          this.setData({
            goodsArr: res.result.data

          })
        }
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#49174a',
        animation: {
          duration: 200,
          timingFunc: 'easeIn'
        }
      })

  },

  toFill(){
     wx.navigateTo({
       url: '../friendFill/friendFill?id=' + this.data.batchId,
     })
  },



})