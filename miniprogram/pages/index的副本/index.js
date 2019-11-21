const globalData = getApp().globalData;


import { getSortList } from '../../lib/apiOrder.js'
var load = require('../../lib/load.js');

var _animation; // 动画实体

const _ANIMATION_TIME = 300; // 动画播放一次的时长ms

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    itemIndex: 0,
    purItemIndex: 0,
    showmymodal: false,
    showPrintTimes: true,
    showStockBill: true,
    pickAnimation: '',
    outAnimation: '',

   

  },

  onShow: function () {
    _animation = wx.createAnimation({
      duration: _ANIMATION_TIME,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50% 0'
    })

  //
  this._getIndexPageData();
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      depId: 1,

    })

  },





_getIndexPageData: function(){

  //1，获取首页初始化数据
  var data = {
    status: 0,
    depId: this.data.depId,
  }
  load.showLoading("获取数据中")
  getSortList(data)
    .then(res => {
      load.hideLoading();
      this.setData({
        sorts: res.result.data,
        store: res.result.data.store,
        goods: res.result.data.goods,
        pick: res.result.data.pick,
        bill: res.result.data.bill
      })

      //初始化图片
      if(this,data.pick > 0){
        this.pickStartAnimationInterval(90);
      }
      if(this.data.bill.length > 0) {
        this.outStartAnimationInterval(90);
      }
      //缓存打开店铺和商品

      wx.setStorageSync("store", this.data.store)

    })
},

//点击拣货单
  showPrintNumber: function() {
    console.log("hai")
    if(this.data.showPrintTimes) {
      this.pickStartAnimationInterval(0);
      this.setData({
        showPrintTimes: false
      })
    }else {
      this.pickStartAnimationInterval(90);

      this.setData({
        showPrintTimes: true
      })
    }
    
  },



  //点击出货单
  showStockBill: function(e) {
    if (this.data.showStockBill) {
      this.outStartAnimationInterval(0);
      this.setData({
        showStockBill: false
      })
    } else {
      this.outStartAnimationInterval(90);
      this.setData({
        showStockBill: true
      })
    }
  },




  // // 滚动切换标签样式
  switchTab: function (e) {
    console.log(e)
    this.setData({
      itemIndex: e.detail.current
    });
    console.log(this.data.itemIndex)
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
  toStore: function (e) { wx.navigateTo({ url: '../order/store/store', }) },
  /**
   * 打开商品页面
   */
  toGoods: function (e) { wx.navigateTo({ url: '../order/cateGoods/cateGoods', }) },

  /**
   * 打开第N次打印拣货单
   */
  toEnterGoodsStock: function (e) { wx.navigateTo({ url: '../order/enterOutStock/enterOutStock?pageNumber=' + e.currentTarget.dataset.pagenumber }) },
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

addPickFirstStep: function(e) {wx.navigateTo({url:'../order/addPickFirstStep/addPickFirstStep?depId=' + this.data.depId})}







})