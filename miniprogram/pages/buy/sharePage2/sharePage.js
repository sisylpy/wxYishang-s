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
      batchId: options.batchId,
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


  },


  /**
   * 用户点击右上角分享
   */
  
  onShareAppMessage: function (res) {
    return {
      title: '李沛谊订货',    
      path: '/pages/buy/friendShare/friendShare?uuid=' + this.data.uuid,     // 当前页面 path ，必须是以 / 开头的完整路径
      imageUrl: '../../../images/logo.jpg',
       success: function (res) {
         console.log(res)

       },
    }
  },
})