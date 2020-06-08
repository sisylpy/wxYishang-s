// pages/order/ordersPage/ordersList/ordersList.js

var load = require('../../../lib/load.js');


const globalData = getApp().globalData;
var app = getApp()

import apiUrl from '../../../config.js';

import { getUnWeightOrder, saveAssignUnweightOrder} from '../../../lib/apiOrders.js'



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
    if (itemIndex == 0) { this._getUnWeightOrderData(0) }
    if (itemIndex == 1) { this._getUnWeightOrderData(1) }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      "title": "分派拣货单",
    }),
    

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
      distributerId: 1
    })

  },



// 点击切换标签
  swichNav:function(e){
  
    var that = this;
    this.setData({
      itemIndex: e.currentTarget.dataset.current
    });
  },

  // 滚动切换标签样式
  switchTab: function (e) {
   
    this.setData({
      itemIndex: e.detail.current,
      todayWeightOrderAmount: 0,
      tomorrowWeightOrderAmount: 0,
    });

    this._getUnWeightOrderData(e.detail.current)
  },


// 未称重接口
  _getUnWeightOrderData: function (what) {

    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    if (month < 10) month = "0" + month;
    var serviceDate = month + '-' + day;

    if (what == 0){
      var data = {
        disId: this.data.distributerId,
        serviceDate:  serviceDate
      } 
    } if (what == 1){
      var date1 = new Date();
      var date2 = new Date(date1);
      date2.setDate(date1.getDate()+1);
      var date3 = date2.getDate();
      console.log(date3);
      var serviceDate = month + '-' + date3;
      var data = {
        disId: this.data.distributerId,
        serviceDate: serviceDate,
      }
    }
    
    getUnWeightOrder(data)
      .then(res => {
        if (res) {
          console.log(res.result)
          if (what == 0){
            this.setData({
              todayArr: res.result.data,

            })
          } if (what == 1){
            this.setData({
              tomorrowArr: res.result.data,
            })
          }    
        }
      })
  },


  choiceisPayingOrder: function(e){
    
    var index = e.currentTarget.dataset.index;
    var what = e.currentTarget.dataset.what;
    if(what == 0){
      var todayArrSel = "todayArr[" + index + "].isSelected";
      var isSelected = this.data.todayArr[index].isSelected;
      var todayWeightOrderAmount = this.data.todayWeightOrderAmount;
      if (isSelected) {
        this.setData({
          [todayArrSel]: false,
          todayWeightOrderAmount: todayWeightOrderAmount - 1,

        })
      } else {
        this.setData({
          [todayArrSel]: true,
          todayWeightOrderAmount: todayWeightOrderAmount + 1,

        })
      }
      wx.setStorageSync("unWeightOrders", this.data.todayArr);

    }
    if (what == 1) {
      var tomorrowArrSel = "tomorrowArr[" + index + "].isSelected";
      var isSelected = this.data.tomorrowArr[index].isSelected;
      var tomorrowWeightOrderAmount = this.data.tomorrowWeightOrderAmount;
      if (isSelected) {
        this.setData({
          [tomorrowArrSel]: false,
          tomorrowWeightOrderAmount: tomorrowWeightOrderAmount - 1,
        })
      } else {
        this.setData({
          [tomorrowArrSel]: true,
          tomorrowWeightOrderAmount: tomorrowWeightOrderAmount + 1,
        })
      }
      wx.setStorageSync("unWeightOrders", this.data.tomorrowArr);

    }
  },

  assignUnWeightOrder: function(e) {

    wx.navigateTo({
      url: '../picker/picker',
    })
  }







})