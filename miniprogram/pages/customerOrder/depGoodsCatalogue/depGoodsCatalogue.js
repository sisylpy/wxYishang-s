// pagesOrder/depGoodsCatalogue/depGoodsCatalogue.js

// import {depGetFatherGoods, } from  '../../lib/apiRestraunt'
import {depGetFatherGoods} from '../../../lib/apiRestruant'

import apiUrl from '../../../config.js'
const globalData = getApp().globalData;
var app = getApp()
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
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#1e82b4',
      animation: {
        duration: 200,
        timingFunc: 'easeIn'
      }
    })

    wx.setNavigationBarTitle({
      "title": "前厅商品",
    })
   
    this.setData({
      depId: options.id,
      depId: 2,

      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      url: apiUrl.server,
    })

    depGetFatherGoods(this.data.depId).then(res => {
      if(res) {
        console.log(res);
        this.setData({
          goodsList: res.result.data,
        })
      }
    })

  },

  toDepGoods(e){
    console.log(e)
    wx.navigateTo({
      url: '../depGoods/depGoods?fatherGoodsId=' + e.currentTarget.dataset.id,
    })
  }

})