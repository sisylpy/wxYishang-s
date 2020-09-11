// pagesOrder/rIndex/rIndex.js

const globalData = getApp().globalData;
var app = getApp()

import apiUrl from '../../../config.js'
import {disGetDepTodayOrders, depGetWeeksApply} from '../../../lib/apiDepOrder'


Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onShow: function(){
    if(this.data.depId){
      this._getDepAppys();
      
    }


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(globalData)
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#1e82b4',
      animation: {
        duration: 200,
        timingFunc: 'easeIn'
      }
    })
    this.setData({
      depId: options.depId,
      depFatherId: options.depFatherId,
      disId:2,
      
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      url: apiUrl.server,
      
    })
    
    this._getDepAppys();


  },
  _getDepAppys(){
    var data = {
      disId: this.data.disId,
      depId: this.data.depFatherId,
    }

    disGetDepTodayOrders(data).then(res =>{
      if(res){ 
        console.log(res);
        this.setData({
          applyArr: res.result.data,
        })
      }
    })
  },

  toQuickOrder(){
    wx.navigateTo({
      url: '../searchGoods/searchGoods?depId=' + this.data.depId  +'&depFatherId=' + this.data.depFatherId ,
    })
  },
  
  






})