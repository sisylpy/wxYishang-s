// miniprogram/pages/order/goods/goods.js
const globalData = getApp().globalData;

import { getApplyGoodsStatusByDepId } from '../../../lib/apiOrder.js'
var load = require('../../../lib/load.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemIndex: 0,
    purItemIndex: 0,
    depId: 1,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,

    })
   this.getTodayApplys();

  },

  getTodayApplys:function(e){
    load.showLoading("获取数据中")   
    getApplyGoodsStatusByDepId(this.data.depId)
    .then(res => {
      load.hideLoading();
      if(res) {
        var newApplysL = res.result.data.newApplys.totalGoodsAmount;
        var marketApplysL =  res.result.data.marketApplys.length;
        var weixinApplysL = res.result.data.weixinApplys.length;
        var couldApplysL = res.result.data.couldApplys.length;
        
        this.setData({
          newApplys: res.result.data.newApplys.applys,
          newApplysLength: newApplysL,
          marketApplys: res.result.data.marketApplys,
          marketApplysLength: marketApplysL, 
          weixinApplys: res.result.data.weixinApplys,
          weixinApplysLength: weixinApplysL,
          couldApplys: res.result.data.couldApplys,
          couldApplysLength: couldApplysL,


        })
        

      }
    })
  },

  
updateNewApplys: function(e){
  console.log("updateNewApplys")
}







})