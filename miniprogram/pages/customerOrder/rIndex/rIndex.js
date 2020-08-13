// pagesOrder/rIndex/rIndex.js

const globalData = getApp().globalData;
var app = getApp()

import apiUrl from '../../../config.js'
import {departmentGetTodayOrders, } from '../../../lib/apiDepOrder'


Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onShow: function(){
    // console.log(this.data.userId)
    // if(this.data.userId){
    //   this._getDepAppys();
    // }

    this._getDepAppys();

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
      hassubs: options.hassubs,
      
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      url: apiUrl.server,
    })
    
    this._getDepAppys();


  },
  _getDepAppys(){
    // var data = {
    //   fatherDepId: this.data.depId,
    //   disId: globalData.disId,
    // }
    departmentGetTodayOrders(this.data.depId).then(res =>{
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
      url: '../searchGoods/searchGoods?depId=' + this.data.depId  +'&hassubs=' + this.data.hassubs,
    })
  },
  toIbookCover(){
    wx.navigateTo({
      url: '../ibookCover/ibookCover',
    })

  },
  

  toDepGoods(){
    wx.navigateTo({
      url: '../depGoods/depGoods?depId=' + this.data.nxDgDepartmentId,
    })
 },





})