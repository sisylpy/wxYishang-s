
import apiUrl from '../../config.js'
import { getDisGoodsDetail } from '../../lib/apiCustomer.js'
const globalData = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // digitBoardHeight: 512,
    amount: '',


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
      .then(res => {
        if (res) {
          console.log(res.result.data);
          this.setData({
            goods: res.result.data,
          })

          var goods = this.data.goods;

          var price = Number(goods.dgGoodsPrice + goods.dgGoodsPriceDecimal);
          this.setData({
            sub: 0,
            price: price,
          })

        }
      })


  },

  getAmount: function (e) {
    console.log(e);
    var value = e.detail.value;
    var price = this.data.price;
    var sub = (price * value).toFixed(1);
    this.setData({
      sub: sub,
      amount: value,

    })
  },

  confirm: function (e) {
    console.log(e);
    var goods = this.data.goods;
    var price = Number(goods.dgGoodsPrice) + Number(goods.dgGoodsPriceDecimal);
    var standard = goods.nxGoodsEntity.nxGoodsStandardname;
   ; 

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
      nxOsSubWeight: this.data.amount,

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
    } else {
      var temp = [];
      temp.push(apply);
    }

    wx.navigateBack({
      delta: 1
    })
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      state: 1,
    })


  },



})