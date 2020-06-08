const globalData = getApp().globalData;

var load = require('../../../lib/load.js');
import { getToPurchaseGoods, savePlanPurchase } from '../../../lib/apiOrders.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemIndex: 0,
    showPlan: false,
    status: 0,
    purchaseGoodsAmount: 0
  
  },


onShow:function(){
  this._getPurchaseGoods();

},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      distributerId: globalData.distributerId,
      distributerId: 1,

    })
    wx.setNavigationBarTitle({
      "title": "进货"
    })
    
   

  },


  // 滚动切换标签样式
  switchTab: function (e) {
    console.log(e)

    this.setData({
      itemIndex: e.detail.current
    });
    if (this.data.itemIndex == 0) {
      this.setData({
        status: 0,
      })
      this._getPurchaseGoods();

    }
    if (this.data.itemIndex == 1) {
      this.setData({
        status: 1,
      })
      this._getPurchaseGoods();

    }
    if (this.data.itemIndex == 2) {
      this.setData({
        status: 2,
      })
      this._getPurchaseGoods();

    }

  },

_getPurchaseGoods(){

  console.log("getettetetett")

  var data= {
    disId: this.data.distributerId,
    status: this.data.status

  }
  load.showLoading("获取数据中")

  getToPurchaseGoods(data)
    .then(res => {
      if (res) {
        load.hideLoading();

        console.log(res.result.data);
        if (this.data.itemIndex == 0){
          this.setData({
            listNew: res.result.data
          })
        }
        if (this.data.itemIndex == 1) {
          this.setData({
            listPlan: res.result.data
          })
        }
        if (this.data.itemIndex == 2) {
         
        }
      
      }
    })

},


  planPurchase: function(e) {
    this.setData({
      item: e.currentTarget.dataset.item,
      showPlan: true,
    })

  },


  savePlan:function(e) {
    var that = this;
    this.setData({
      showPlan: false
    })
    var plan = e.detail.plan;
    var data = {
      disGoodsId: this.data.item.disGoodsId,
      plan: e.detail.plan,
      subList: JSON.stringify(this.data.item.subList)
    }
    savePlanPurchase(data)
    .then(res => {
      if(res) {
        console.log(res);
        that._getPurchaseGoods();
      }
    })
    console.log(data);
  },






  selectPurchaseGoods: function (e) {
    console.log(e);
    var parentIndex = e.currentTarget.dataset.parent_index;
    var index = e.currentTarget.dataset.index;
    var unPurchaseSel = "listPlan["+parentIndex+"].goodsList[" + index + "].isSelected";
    var isSelected = this.data.listPlan[parentIndex].goodsList[index].isSelected;
    var purchaseGoodsAmount = this.data.purchaseGoodsAmount;
    if (isSelected) {
      this.setData({
        [unPurchaseSel]: false,
        purchaseGoodsAmount: purchaseGoodsAmount - 1,

      })
    } else {
      this.setData({
        [unPurchaseSel]: true,
        purchaseGoodsAmount: purchaseGoodsAmount + 1,
      })
    }
    wx.setStorageSync("purchaseGoods", this.data.listPlan);

  },

//wx
  onShareAppMessage: function (res) {
    if (res.from === "button") {
    }
    return {
      title: '李沛谊订货',    
      path: '/pages/index/index',     // 当前页面 path ，必须是以 / 开头的完整路径
      imageUrl: '../../../images/logo.jpg',
       success: function (res) {
         console.log(res)

       },
    }
    


  },

  toPurchaseBoy: function(e){
    wx.navigateTo({
      url: '../purchaseBoy/purchaseBoy',
    })
  },




})