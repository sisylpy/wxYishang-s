// pages/order/store/store.js
var load = require('../../../lib/load.js');

const globalData = getApp().globalData;
var app = getApp()

import { getDisOrderDepartments } from '../../../lib/apiDepOrder.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pickOrderAmount: 0,
   
   
  },

  onShow:function(){

    // this._getApplyByPageNumber();

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      // beyondKeyHeight: globalData.beyondKeyHeight,
      disId: options.disId

    })
    this._getDisOrderDepartment();
  
  },

  _getDisOrderDepartment: function (e) {


    getDisOrderDepartments(1)
      .then(res => {
        if (res) {
          console.log(res.result.data)
          this.setData({
            depArr: res.result.data
          })
        }
      })

  },


  toOrderDetail(e){
    console.log(e)
   
 wx.navigateTo({
      url: '../issuePage/issuePage?nxDepId=' + e.currentTarget.dataset.id,
    })

  },






  
})