const globalData = getApp().globalData;

var load = require('../../../lib/load.js');
import { 
  disGetToPlanPurchaseGoods,
  savePlanPurchase,
  disGetPurchaseGoods,
  savePurchaseBatchType,
  getPurchaseGoodsAndPurchaseBatch,
} from '../../../lib/apiDepOrder.js'

import {getStandardList, } from '../../../lib/apiibook'

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
  if(this.data.itemIndex == 0){
    this._getPlanPurchaseGoods();
  }
  if(this.data.itemIndex == 1){
    this._getPurchaseGoods();
  }


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
    // 
    wx.setNavigationBarTitle({
      "title": "备货"
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#49174a',
      animation: {
        duration: 200,
        timingFunc: 'easeIn'
      }
    })

    var date = new Date();
    var today =   date.getDate();
    var todayStr = ""
    if(today < 10){
      todayStr = "0" + today.toString(); 
    }else{
      todayStr = today.toString();
    }
    
    this.setData({
      today: todayStr
    })
    console.log(typeof tody)
  },


  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      itemIndex: e.detail.current
    });
    if (this.data.itemIndex == 0) {
      this.setData({
        status: 0,
      })
      this._getPlanPurchaseGoods();

    }
    if (this.data.itemIndex == 1) {
      this.setData({
        status: 1,
      })
      this._getPurchaseGoods();

    }

  },


  // 一, 第一个swipter-item
  // 1, 订货-获取订货商品
  _getPlanPurchaseGoods(){
  load.showLoading("获取数据中")
  disGetToPlanPurchaseGoods(this.data.distributerId)
    .then(res => {
      console.log(res)
      if (res) {
        load.hideLoading();
        this.setData({
          planArr: res.result.data
        }) 
      }
    })
},

//2,打开进货商品弹出窗口
  planPurchase: function(e) {

    console.log(e);

    this.setData({
      item: e.currentTarget.dataset.item,
      fatherId: e.currentTarget.dataset.fatherid,
      showPlan: true,
      applyStandardName: e.currentTarget.dataset.standard,
    })

    getStandardList(e.currentTarget.dataset.id).then(res => {
      if(res) {
        console.log(res.result.data)
       
        this.setData({
          standardArr: res.result.data,
        })
      }
    })
  },
  changeStandard(e){
    console.log(e);
    this.setData({
      applyStandardName: e.detail.applyStandardName,
    })
 
  },

// 3,保存添加进货商品
  savePlan:function(e) {
    var that = this;
    this.setData({
      showPlan: false
    })
    var data = {
      nxDpgNxGoodsFatherId: this.data.fatherId,
      nxDpgNxGoodsId: this.data.item.goodsId,
      nxDpgQuantity: e.detail.plan,
      nxDpgStandard: this.data.applyStandardName,
      nxDepartmentOrdersEntities: this.data.item.orders,
      nxDpgDistributerId: this.data.distributerId
    }
    savePlanPurchase(data)
    .then(res => {
      if(res) {
        console.log(res);
        this.setData({
          item: []
        })
        that._getPlanPurchaseGoods();
      }
    })
  },


// 4, 选择进货商品
  selectPurchaseGoods: function (e) {
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var unPurchaseSel = "purArr[" + index + "].isSelected";
    var isSelected = this.data.purArr[index].isSelected;
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

  },

//第二个swipter-item

// 1, 进货单-获取进货单商品
_getPurchaseGoods(){
  load.showLoading("获取数据中")
  getPurchaseGoodsAndPurchaseBatch(this.data.distributerId)
    .then(res => {
      console.log(res)
      if (res) {
        load.hideLoading();
        this.setData({
          purArr: res.result.data.goods,
          batchArr: res.result.data.batchs,
        }) 
      }
    })
},

// 3, 查询选择的进货单商品
_querySelectedGoods(data){
  var purArr = this.data.purArr;
  var purGoods = [];
  for(var i = 0; i < purArr.length; i++){
    var purSelect = purArr[i].isSelected;
    if(purSelect){
      purGoods.push(purArr[i]);
    }
  }
  var batch = {
    nxDpbDistributerId: this.data.distributerId,
    nxDpbType: data,
    nxDPGEntities: purGoods,
  }
  return batch;
},

// 打印方法
printList(e){

},

//复制方法
copyList(e){
  var purGoods = this._querySelectedGoods(2);

  savePurchaseBatchType(purGoods).then(res => {
    if(res) {
      console.log(res);
      var purArr = this.data.purArr;
      var purGoodsContent = "";
      for(var i = 0; i < purArr.length; i++){
        var purSelect = purArr[i].isSelected;
        if(purSelect){
          // purGoods.push(purArr[i]);
          purGoodsContent = purArr[i].nxGoodsEntity.nxGoodsName + 
          purArr[i].nxDpgQuantity + ',  ' + purGoodsContent 
        }
      }
     this.setData({
       clip: purGoodsContent
     })
     
  wx.setClipboardData({
    data: purGoodsContent,
    success: (res)=> {
      this._getPurchaseGoods();
  //     wx.showModal({
  //     title: '提示',
  //     content: '复制成功',
  //     success: (res)=> {
  //       if (res.confirm) {
  //         console.log('确定')
  //       } else if (res.cancel) {
  //         console.log('取消')
  //       }
  //     }
	//  })
    }
  })
    
    }
  })



},

//市场采购方法

toPurchaseBoy: function(e){

  wx.navigateTo({
    url: '../purchaseBoy/purchaseBoy' ,
  })

  var purGoods = this._querySelectedGoods(3);
  wx.setStorageSync('purGoods', purGoods)


  
},

//微信订货方法
wxOrder(){
  console.log("akfalkfjdsa")

  var purGoods = this._querySelectedGoods(4);

  savePurchaseBatchType(purGoods).then(res => {
    if(res) {
      console.log(res);
     
      wx.navigateTo({
        url: '../sharePage/sharePage?batchId=' + res.result.data,
      })
    
    }
  })



},


  // 完成进货方法
  finishPurchase(e){

  }




})