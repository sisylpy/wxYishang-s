
var load = require('../../lib/load.js');

const globalData = getApp().globalData;
var app = getApp()

import apiUrl from '../../config.js'
import { indexData, cgCataList } from '../../lib/apiBusiness.js'

Page({

  /**
   * 页面的初始数
   */
  data: {
    itemIndex: 0,
   



  },





  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.distributerId = "1"
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      distributerId: globalData.distributerId,
    })

  },




  // 滚动切换标签样式
  switchTab: function (e) {
    console.log(e)

    this.setData({
      itemIndex: e.detail.current
    });
    if (this.data.itemIndex == 0) {

    }
    if (this.data.itemIndex == 1) {

    }
    if (this.data.itemIndex == 2) {
      
    }

  },



  switchSubTab: function (e) {
    this.setData({
      purItemIndex: e.detail.current
    });
  },



})