
var load = require('../../lib/load.js');

var _animation; // 动画实体

const _ANIMATION_TIME = 300; // 动画播放一次的时长ms
const globalData = getApp().globalData;
var app = getApp()

import apiUrl from '../../config.js'
import {indexData, dgCataList } from '../../lib/apiBusiness.js'

Page({
  
  /**
   * 页面的初始数
   */
  data: {
    itemIndex: 0,
    purItemIndex: 0,
    showmymodal: false,
    showWeighUser: true,
    showDeliver: true,
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
    this._getIndexPageData();

    if (this.data.itemIndex == 2) {
      this._getDgCataData();

    } 
    
     },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.distributerId = "1"  
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      distributerId: globalData.distributerId,
    })

  },

 _getDgCataData: function(){
   
   dgCataList(this.data.distributerId).
     then(res => {
       if (res) {
         console.log(res.result.data)
         this.setData({
           goodsList: res.result.data,
         })

       }
     })
 },

  



_getIndexPageData: function(){

  //1，获取首页初始化数据
  
  load.showLoading("获取数据中")
  indexData(this.data.distributerId)
    .then(res => {
      load.hideLoading();
      console.log(res.result.data);
      this.setData({
        // sorts: res.result.data,
        // store: res.result.data.store,
        // goods: res.result.data.goods,
        weighUserArr: res.result.data.weigh,
        showWeighUser: true,
        purchaseUserArr: res.result.data.purchase,

        // bill: res.result.data.bill
      })

      //初始化图片
      if (this.data.weighUserArr.length > 0){
        this.pickStartAnimationInterval(90);
      }
      // if(this.data.bill.length > 0) {
      //   this.outStartAnimationInterval(90);
      // }
      //缓存打开店铺和商品

      // wx.setStorageSync("store", this.data.store)

    })
},

//点击拣货单
  clickShowWeighUser: function() {
    console.log("hai")
    if(this.data.showWeighUser) {
      this.pickStartAnimationInterval(0);
      this.setData({
        showWeighUser: false
      })
    }else {
      this.pickStartAnimationInterval(90);

      this.setData({
        showWeighUser: true
      })
    }
    
  },



  //点击出货单
  clickShowDeliver: function(e) {
    if (this.data.showDeliver) {
      this.outStartAnimationInterval(0);
      this.setData({
        showDeliver: false
      })
    } else {
      this.outStartAnimationInterval(90);
      this.setData({
        showDeliver: true
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
    if(this.data.itemIndex == 1){

    }
    if (this.data.itemIndex == 1){
      this._getDgCataData();

    }
    if (this.data.itemIndex == 4) {
      // wx.navigateTo({
      //   url: '../business/ibookCover/ibookCover',
      // })
    }

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
  toWeightOrder: function (e) { wx.navigateTo({ url: '../pick/weightOrder/weightOrder', }) },
  /**
   * 打开商品页面
   */
  toPurchase: function (e) { wx.navigateTo({ url: '../buy/buyPage/buyPage', }) },



  /**
   * 
   */
  toPayAndDeliverOrder: function (e) { wx.navigateTo({ url: '../payAndDelivery/ordersList/ordersList', }) },
  /**
   * 打开第N次打印拣货单
   */
  toWeighingUser: function (e) { 
    console.log(e);
    wx.navigateTo({ url: '../weight/weighingOrders/weighingOrders?pickerUserId=' + e.currentTarget.dataset.id }) },

  toPurchaseUser: function(e){
    console.log(e);
    wx.navigateTo({ url: '../buy/purchaseGoods/purchaseGoods?purchaseUserId=' + e.currentTarget.dataset.id })
  },

  /**
   * 打开出货单
   */
  toOutStockBill: function (e) { console.log(e); wx.navigateTo({ url: '../order/outBill/outBill?storeId=' + e.currentTarget.dataset.storeid }) },
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
  outStartAnimationInterval: function (angle) {
    _animation.rotate(angle).step()
    this.setData({
      outAnimation: _animation.export()
    })
  },

// addPickFirstStep: function(e) {
//   console.log("first")
//   wx.navigateTo({url:'../order/weight/addPickFirstStep/addPickFirstStep'})},

  toGoodsList: function(e){ 

    console.log(e)
    wx.navigateTo({
    url: '../goods/ibookmain/ibookmain?id='+e.currentTarget.dataset.id,
  })},

switchGoods:function(e){
console.log(e);
if(e.detail.current == 1){
  this.setData({
    changeFirst: true,
  })
}
},

  toIbook:function(e){
    wx.navigateTo({
      url: '../business/ibookCover/ibookCover'
    })
  },

  clickFather: function (e) {
    console.log(e);
    console.log("why????")
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../business/disGoods/disGoods?fatherId=' + id,
    })

  },
  quick: function(){
    console.log("quick")
    wx.navigateTo({
      url: '/pagesCustomer/index/index',
    })
  },

// kanakn: function(e){
//   wx.navigateTo({
//     url: '/pages/purIndex/purIndex',
//   })
// },


  kanakn: function (e) {
    wx.navigateTo({
      url: '/pages/pur/purGoods/purGoods',
    })
  }



})