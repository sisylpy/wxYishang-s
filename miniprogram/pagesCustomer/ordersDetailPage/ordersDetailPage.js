

import apiUrl from '../../config.js'
import userTime from '../../lib/userTime.js'
const globalData = getApp().globalData;
import {
  getOrderDetail,
  deleteOrder
} from '../../lib/apiOrders.js'

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
      nxOrdersId: options.nxOrdersId,
      
    })

    this._initData();

  },

  _initData:function(e){
    getOrderDetail(this.data.nxOrdersId)
    .then(res => {
      if(res) {
        console.log(res.result.data);
         this.setData({
           order: res.result.data
         })
      }
    })
  },

  cancleOrder:function(e){
    var id = this.data.nxOrdersId;
    console.log()

   deleteOrder(id)
   .then(res => {
     if(res){
       console.log(res)
       wx.navigateBack({
         delta: 1
       })
     }
   })
  },

})