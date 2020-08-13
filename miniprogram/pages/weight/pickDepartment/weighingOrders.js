// pages/order/store/store.js
var load = require('../../../lib/load.js');

const globalData = getApp().globalData;
var app = getApp()

import {
  getOrdersToWeigh
} from '../../../lib/apiOrders.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pickOrderAmount: 0,


  },

  onShow: function () {

    this._getApplyByPageNumber();

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      // beyondKeyHeight: globalData.beyondKeyHeight,
      pickerUserId: options.pickerUserId

    })
    this._getApplyByPageNumber();

  },

  _getApplyByPageNumber: function (e) {
    var data = {
      pickerUserId: this.data.pickerUserId,
      status: 1,
    }
    getOrdersToWeigh(data)
      .then(res => {
        if (res) {
          console.log(res.result.data)
          this.setData({
            orderArr: res.result.data
          })
        }
      })

  },

  customerApplys: function (e) {
    console.log(e);
    var nxOrdersId = e.currentTarget.id;
    var index = e.currentTarget.dataset.index;
    var todayArrSel = "orderArr[" + index + "].isSelected";
    var isSelected = this.data.orderArr[index].isSelected;
    var pickOrderAmount = this.data.pickOrderAmount;
    if (isSelected) {
      this.setData({
        [todayArrSel]: false,
        pickOrderAmount: pickOrderAmount - 1,

      })
    } else {
      this.setData({
        [todayArrSel]: true,
        pickOrderAmount: pickOrderAmount + 1,
      })
    }



  },

  toOrderDetail() {
    var arr = this.data.orderArr;
    console.log(this.data.orderArr)
    console.log(arr.length)
    var ids = "";

    for (var i = 0; i < this.data.orderArr.length; i++) {
      console.log(i)
      var sel = arr[i].isSelected;
      if (sel) {
        var id = arr[i].nxOrdersId;
        console.log(id)
        ids = id + "," + ids

      }
    }
    this.setData({
      ids: ids,
    })

    console.log(this.data.ids)

    wx.navigateTo({
      url: '../ordersGoodsCate/ordersGoodsCate?nxOrdersId=' + this.data.ids,
    })

  },







})