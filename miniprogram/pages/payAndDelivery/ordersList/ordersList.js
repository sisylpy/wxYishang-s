// pages/order/ordersPage/ordersList/ordersList.js

var load = require('../../../lib/load.js');


const globalData = getApp().globalData;
var app = getApp()

// import apiUrl from '../../../config.js'

import {
  getPaymentAndDeliveryOrder,
  
} from '../../../lib/apiOrders.js'




//触屏开始点坐标

var startDot = {

  X: 0,

  Y: 0

};

//触屏到点坐标

var touchDot = {

  X: 0,

  Y: 0

};

var time = 0; //触屏时间

var number; //定时器ID


Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemIndex: 0,
    subItemIndex: 0,
    deliveryOrderAmount: 0,


  },


  onAnswerRaidonChange(event) {

    this.setData({
      radio: event.detail
    });
    console.log(this.data);
  },







  /**
   * 触屏开始计时和获取坐标
   */
  touchstart: function(event) {
    console.log(event);
    console.log("touchstart")

    startDot.X = event.touches[0].pageX;

    startDot.Y = event.touches[0].pageY;

    number = setInterval(function() {
      time++;
    }, 100);

  },

  /**

   * 判断滑动距离和时间是否需要切换页面

   */

  touchmove: function(event) {
    console.log(event);
    console.log("move......")

    touchDot.X = event.touches[0].pageX;

    touchDot.Y = event.touches[0].pageY;

    //向左滑处理

    if ((startDot.X - touchDot.X) > 200 && (startDot.Y - touchDot.Y) < 150 && time < 5 && time > 0.1) {
      console.log("zuo")
      this.setData({
        itemIndex: 3,
        subItemIndex: -1,
      })
      clearInterval(number);
      time = 0;
    }

    //向右滑处理
    if ((touchDot.X - startDot.X) > 200 && (touchDot.Y - startDot.Y) < 150 && time < 5 && time > 0.1) {
      console.log("you")

      wx.showToast({

        title: '右',

        icon: 'success',

        duration: 2000

      })

      clearInterval(number);

      time = 0;

    }

  },

  /**

   * 结束触屏重置计时

   */

  touchend: function(event) {

    clearInterval(number);

    time = 0;

  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    wx.setNavigationBarTitle({
        "title": "付款与配送",
      }),


      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#2d5a5f',
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

  onShow: function() {
    var itemIndex = this.data.itemIndex;
    var subItemIndex = this.data.subItemIndex;
    this._getPaymentAndDeliveryOrder();
  },


  // 点击切换标签
  swichNav: function(e) {
    console.log("dkjfajd;")
    console.log(e.currentTarget.dataset.current)
    var that = this;
    this.setData({
      itemIndex: e.currentTarget.dataset.current
    });
  },

  // 滚动切换标签样式
  switchTab: function(e) {

    this.setData({
      itemIndex: e.detail.current
    });
    this._getPaymentAndDeliveryOrder()
  },

  // 点击切换子标签
  switchSubNav: function(e) {
    this.setData({
      subItemIndex: e.currentTarget.dataset.subcurrent
    })
  },




  // 完成称重-三个支付状态
  _getPaymentAndDeliveryOrder: function() {
    if (this.data.itemIndex == 0) {
      var data = {
        disId: this.data.distributerId,
        orderStatus: 2,
        paymentStatus: 0
      }
    }
    if (this.data.itemIndex == 1) {
      var data = {
        disId: this.data.distributerId,
        orderStatus: 3,
        paymentStatus: 1
      }
    }
    if (this.data.itemIndex == 2) {
      
      var data = {
        disId: this.data.distributerId,
        orderStatus: 2,
        paymentStatus: -1
      }
    }
    if (this.data.itemIndex == 3) {
      var data = {
        disId: this.data.distributerId,
        orderStatus: 4,
        paymentStatus: -1
      }
    }

    console.log("----widhhejekrjk")
    console.log(data);
    getPaymentAndDeliveryOrder(data)
      .then(res => {
        if (res) {
          console.log(res.result.data);
          if (this.data.itemIndex == 0) {
            this.setData({
              unPaymentArr: res.result.data
            })
          }
          if (this.data.itemIndex == 1) {
            this.setData({
              isPaymentArr: res.result.data
            })
          }
          if (this.data.itemIndex == 2) {
            this.setData({
              unDeliveryArr: res.result.data
            })
          }
          if (this.data.itemIndex == 3) {
            this.setData({
              isDeliveryArr: res.result.data
            })
          }
         
        }
      })
  },



  try: function(e) {
    console.log("-----try------")
    console.log(e);
    if (this.data.subItemIndex == 2) {

    }
  },

  toPaymentPage: function(e) {
    console.log(e);
    wx.navigateTo({
      url: '../paymentPage/paymentPage?nxOrdersId=' + e.currentTarget.dataset.id,
    })
  },

  choiceisPayingOrder: function(e) {
    var index = e.currentTarget.dataset.index;
    var isPayingArr = "isPaymentArr[" + index + "].isSelected";
    var isSelected = this.data.isPaymentArr[index].isSelected;
    if (isSelected) {
      this.setData({
        [isPayingArr]: false,
      })
    } else {
      this.setData({
        [isPayingArr]: true,
      })
    }


  },
  
  selectDeliveryOrder: function(e){
   
    var routeindex = e.currentTarget.dataset.routeindex;
    var index = e.currentTarget.dataset.index;
    var unDeliveryArrSel = "unDeliveryArr[" + routeindex + "].arr[" + index+"].isSelected";
    var isSelected = this.data.unDeliveryArr[routeindex]['arr'][index].isSelected;
    var deliveryOrderAmount = this.data.deliveryOrderAmount;
      if (isSelected) {
        this.setData({
          [unDeliveryArrSel]: false,
          deliveryOrderAmount: deliveryOrderAmount - 1,

        })
      } else {
        this.setData({
          [unDeliveryArrSel]: true,
          deliveryOrderAmount: deliveryOrderAmount + 1,

        })
      }
    wx.setStorageSync("unDeliveryOrders", this.data.unDeliveryArr);

  },
  assignUnDeliveryOrder:function(e){
    wx.navigateTo({
      url: '../deliveryBoy/deliveryBoy',
    })
  },
  isDeliveryUserOrders:function(e){
    var deliveryUserId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../deliveryBoyOrders/deliveryBoyOrders?deliveryUserId=' + deliveryUserId,
    })
    

  },






})