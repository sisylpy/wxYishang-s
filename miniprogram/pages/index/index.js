var load = require('../../lib/load.js');

var _animation; // 动画实体

const _ANIMATION_TIME = 300; // 动画播放一次的时长ms
const globalData = getApp().globalData;
var app = getApp()

import apiUrl from '../../config.js'
import {
  disGetTodayOrderCustomer,
  indexData
} from '../../lib/apiDepOrder.js'

Page({

  /**
   * 页面的初始数
   */
  data: {
    itemIndex: 0,
    purItemIndex: 0,
    showmymodal: false,
    showBuyer: false,
    showPicker: false,
    showCustomer: false,
    pickAnimation: '',
    outAnimation: '',
    changeFirst: false,
    secondItemIndex: 0,

    indicatorDots: false,
    autoplay: false,
    interval: 2000,
    duration: 400,

    openIndex: "",
    limit: 200,
    page: 1,
    showIndex: -1,



  },



  onShow: function () {
    _animation = wx.createAnimation({
      duration: _ANIMATION_TIME,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50% 0'
    })

    //todo
    if (this.data.distributerId) {
      // this._getIndexPageData();
    }
    // this._getIndexPageData();





  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var value = wx.getStorageSync('disInfo');
    if (value) {
      this.setData({
        disInfo: value,
        disId: value.nxDistributerEntity.nxDistributerId,
        disName: value.nxDistributerEntity.nxDistributerName,
      })
    }

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      url: apiUrl.server,

    })
    // this._getIndexPageData();
    this._getTodayCustomer();

  },


  _getTodayCustomer(){
    disGetTodayOrderCustomer(this.data.disId).then(res => {
      if(res) {
        console.log(res.result.data);
        this.setData({
          customerArr: res.result.data,
        })
        if(res.result.data.length > 0){
          this.setData({
            showCustomer: true,
          })
        }
      }
    })

  },
  _getIndexPageData: function () {

    //1，获取首页初始化数据

    load.showLoading("获取数据中")
    indexData(1)
      .then(res => {
        load.hideLoading();
        console.log(res)
        if (res.result.data.buyer.length > 0) {
          this.setData({
            buyerArr: res.result.data.buyer,
            showBuyer: true,

          })
        }
        if (res.result.data.picker.length > 0) {
          this.setData({
            pickerArr: res.result.data.picker,
            showPicker: true

          })
        }


        //初始化图片
        if (this.data.buyerArr.length > 0) {
          this.buyStartAnimationInterval(90);
        }
        if (this.data.pickerArr.length > 0) {
          this.pickStartAnimationInterval(90);
        }


      })
  },


  //点击出货单
  clickShowBuyer: function (e) {
    if (this.data.showBuyer) {
      this.buyStartAnimationInterval(0);
      this.setData({
        showBuyer: false
      })
    } else {
      this.buyStartAnimationInterval(90);
      this.setData({
        showBuyer: true
      })
    }
  },

  //点击拣货单
  clickShowPicker: function () {
    console.log("hai")
    if (this.data.showPicker) {
      this.pickStartAnimationInterval(0);
      this.setData({
        showPicker: false
      })
    } else {
      this.pickStartAnimationInterval(90);

      this.setData({
        showPicker: true
      })
    }

  },






  // // 滚动切换标签样式
  switchTab: function (e) {
    console.log(e)

    this.setData({
      itemIndex: e.detail.current
    });
    console.log(this.data.itemIndex);
    if (this.data.itemIndex == 0) {

    }
    if (this.data.itemIndex == 1) {
      // this._getDgCataData();

    }
    if (this.data.itemIndex == 4) {
      // wx.navigateTo({
      //   url: '../business/ibookCover/ibookCover',
      // })
    }

  },
  toIbook() {
    wx.navigateTo({
      url: '../business/ibookCover/ibookCover',
    })
  },



  switchSubTab: function (e) {
    this.setData({
      purItemIndex: e.detail.current
    });
  },

  // // 点击标题切换当前页时改变样式
  // swichNav: function (e) {
  //   var cur = e.target.dataset.current;
  //   if (this.data.currentTaB == cur) { return false; }
  //   else {
  //     this.setData({
  //       currentTab: cur
  //     })
  //   }
  // },




  /**
   * 打开店铺页面
   */
  toPickerOrder: function (e) {
    wx.navigateTo({
      url: '../pick/pickerOrder/pickerOrder',
    })
  },
  /**
   * 打开备货页面
   */
  toPurchase: function (e) {
    wx.navigateTo({
      url: '../buy/buyPage/buyPage',
    })
  },

  /**
   * 
   */
  toPayAndDeliverOrder: function (e) {
    wx.navigateTo({
      url: '../payAndDelivery/orderDepartment/orderDepartment?disId=' + this.data.distributerId,
    })
  },
  /**
   * 
   */
  toPickerPage: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '../weight/pickDepartment/pickDepartment?pickerUserId=' + e.currentTarget.dataset.id
    })
  },

  toBuyerPage: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '../buy/purchaseGoods/purchaseGoods?purchaseUserId=' + e.currentTarget.dataset.id
    })
  },

  /**
   * 打开出货单
   */
  toOutStockBill: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '../order/outBill/outBill?storeId=' + e.currentTarget.dataset.storeid
    })
  },
  /**
   * 拣货单-图片旋转
   */
  pickStartAnimationInterval: function (angle) {
    _animation.rotate(angle).step()
    this.setData({
      pickAnimation: _animation.export()
    })
  },

  /**
   * 出货单-图片旋转
   */
  buyStartAnimationInterval: function (angle) {
    _animation.rotate(angle).step()
    this.setData({
      buyAnimation: _animation.export()
    })
  },


  setPrinter: function () {
    wx.navigateTo({
      url: '/pagesPicker/pIndex/pIndex',
    })
  },

  kanakn: function (e) {
    wx.navigateTo({
      url: '/pages/pur/purGoods/purGoods',
    })
  },

  toRestaurantList() {
    wx.navigateTo({
      url: '/pages/restaurant/restaurantList/restaurantList?id=' + this.data.distributerId,
    })
  },


  toChoicePrinter(e) {
    console.log("totootototo")
    wx.navigateTo({
      url: '../pSearchPrinter/pSearchPrinter',
    })
  }





})