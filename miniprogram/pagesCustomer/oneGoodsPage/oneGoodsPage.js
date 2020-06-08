// pagesCustomer/oneGoodsPage/oneGoodsPage.js

import apiUrl from '../../config.js'
import {getDisGoodsDetail } from '../../lib/apiCustomer.js'
const globalData = getApp().globalData;


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
      digitBoardHeight: globalData.digitBoardHeight * globalData.rpxR,
      disGoodsId: options.disGoodsId,
      url: apiUrl.server
    })
    
    
    wx.setNavigationBarTitle({
      title: options.name,
    })

    getDisGoodsDetail(this.data.disGoodsId)
      .then(res =>{
        if(res){
          console.log(res.result.data);
          this.setData({
            goods: res.result.data,
          }) 

          var goods = this.data.goods;

          var price = Number(goods.dgGoodsPrice + goods.dgGoodsPriceDecimal);
          var scale = Number(goods.dgGoodsSellStandardScale);

          this.setData({
            sub: (price * scale).toFixed(1),
            price: price,
            standardPrice: (price * scale).toFixed(1),
            amount: 1,

          })

        }
      })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },



  addOne: function (e) {
    var amount = Number(this.data.amount) + 1;
    var scale = Number(this.data.goods.dgGoodsSellStandardScale);
    var sub = (Number(this.data.price) * amount * scale).toFixed(1);
    this.setData({
      amount: amount,
      sub: sub,

    })
  },
  reduceOne: function (e) {
    if (this.data.amount > 1) {
      var amount = this.data.amount - 1;
      var scale = Number(this.data.goods.dgGoodsSellStandardScale);
      var sub = (this.data.price * amount * scale).toFixed(1);
      this.setData({
        amount: amount,
        sub: sub,
      })
    }
  },


  confirm: function (e) {
    var goods = this.data.goods;
    var price = Number(goods.dgGoodsPrice) + Number(goods.dgGoodsPriceDecimal);
    var standard = goods.dgGoodsSellStandardName;
    var weight = 
      (Number(goods.dgGoodsSellStandardScale) * Number(this.data.amount)).toFixed(1); 
   console.log("funk")
    console.log(goods.dgGoodsSellStandardScale);
    console.log(Number(goods.dgGoodsSellStandardScale));
    console.log(this.data.amount);
    console.log("made")


    var apply = {
      nxOsGoodsId: goods.dgGoodsId,
      nxOsQuantity: this.data.amount,
      nxOsStandard: standard,
      nxOsPrice: price,
      nxOsGoodsFatherId: goods.dgGoodsFatherId,
      nxOsDisGoodsId: goods.disGoodsId,
      nxOsSubtotal: this.data.sub,
      nxOsGoodsSellType: goods.dgGoodsSellType,
      nxOsGoodsSellStandardScale: goods.dgGoodsSellStandardScale,
      nxOsSubWeight: weight,

      nxGoodsEntity: {
        nxGoodsName: goods.nxGoodsEntity.nxGoodsName,
        nxGoodsStandardName: goods.nxGoodsEntity.nxGoodsStandardname
      }
    }
    var applyArr = wx.getStorageSync("applyArr");
    if (applyArr) {
      applyArr.push(apply);
      wx.setStorageSync("applyArr", applyArr);
      this.setData({
        applyArr: applyArr,
        applyNumber: applyArr.length,
      })
    }else{
      var temp = [];
      temp.push(apply);
    }

    wx.navigateBack({
      delta: 1,
      selectAmount: this.data.amount
    })
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      state: 1,
      })
  },

})