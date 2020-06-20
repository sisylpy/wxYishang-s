// pages/restaurant/restaurantList/restaurantList.js

import {getMyRestaruants, } from  '../../../lib/apiRestruant'

var load = require('../../../lib/load.js');


const globalData = getApp().globalData;
var app = getApp()

var type = ""

import apiUrl from '../../../config.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemIndex: 0,
    todayWeightOrderAmount: 0,
    tomorrowWeightOrderAmount: 0,


  },

  onShow: function () {
    var itemIndex = this.data.itemIndex;
    // if (itemIndex == 0) { this._getUnWeightOrderData(0) }
    // if (itemIndex == 1) { this._getUnWeightOrderData(1) }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    wx.setNavigationBarColor ({
      frontColor: '#ffffff', 
      backgroundColor: '#466496', 
      animation: { 
        duration: 200,
        timingFunc: 'easeIn'
      }
    })
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      // distributerId: globalData.distributerId,
      distributerId: options.id,
      
    })

    this._getData();

  },

  _getData(){

    if(this.data.itemIndex == 0){
      type = "unFixed"
    }
    if(this.data.itemIndex == 1){
      type = "fixed"
    }

    var data  = {
      disId: this.data.distributerId,
      type:  type
    }
    getMyRestaruants(data).then(res => {
      if(res) {
        console.log(res.result.data);
        if(type == "unFixed"){
          this.setData({
            unFixedArr: res.result.data
          }) 
        }
        if(type == "fixed"){
          this.setData({
            fixedArr: res.result.data
          }) 
        }
       

      }
    })

  },



// 点击切换标签
swichNav:function(e){
  
  var that = this;
  this.setData({
    itemIndex: e.currentTarget.dataset.current
  });
  this._getData();

},

  // 滚动切换标签样式
  switchTab: function (e) {
   
    this.setData({
      itemIndex: e.detail.current,
      todayWeightOrderAmount: 0,
      tomorrowWeightOrderAmount: 0,
    });
    this._getData();

  },





})