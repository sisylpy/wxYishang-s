// pages/applyGoods/applyGoods.js

var load = require('../../lib/load.js');

const globalData = getApp().globalData;
import {

  disGetToPlanPurchaseGoods,
  savePlanPurchase,
} from '../../lib/apiDepOrder.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    disId:1,
    showPlanPurchase: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this._getPlanPurchaseGoods();

  },


  _getPlanPurchaseGoods() {
    load.showLoading("获取进货商中")
    disGetToPlanPurchaseGoods(this.data.disId)
      .then(res => {
        console.log(res)
        if (res) {
          load.hideLoading();
          this.setData({
            planArr: res.result.data
          })
        }
        load.hideLoading();

      })
  },


  purchaseGoods(e) {
    var parentIndex = e.currentTarget.dataset.parentindex;
    var index = e.currentTarget.dataset.index;
    var selectAmount = this.data.planArr[parentIndex].goodsList[index].selectAmount;
    var ordersArr = this.data.planArr[parentIndex].goodsList[index].orders;
    var goodsSelectAmount = "planArr[" + parentIndex + "].goodsList[" + index + "].selectAmount";
    var purchaseQuantityArr = "planArr[" + parentIndex + "].goodsList[" + index + "].purchaseQuantity";
    
    if (selectAmount > 0) {
      //1.1 delate goods
      for (var i = 0; i < ordersArr.length; i++) {
        var orderFocus = "planArr[" + parentIndex + "].goodsList[" + index + "].orders[" + i + "].onFocus";
        this.setData({
          [orderFocus]: false,
        })
      }
      this.setData({
        [goodsSelectAmount]: 0,
        [purchaseQuantityArr]: []
      })

    } else {
      //2.1 add goods
      var goodsPurchaseArr = [];
      for (var i = 0; i < ordersArr.length; i++) {
        var standard = ordersArr[i].nxDoStandard;
        var quantity = ordersArr[i].nxDoQuantity;
        var orderId = ordersArr[i].nxDepartmentOrdersId;
        //2 添加 purchaseArr
        var purchaseItem = {
          orderId: orderId,
          quantity: quantity,
          standard: standard
        }
        goodsPurchaseArr.push(purchaseItem);

        var orderFocus = "planArr[" + parentIndex + "].goodsList[" + index + "].orders[" + i + "].onFocus";
        this.setData({
          [orderFocus]: true,
        })
      }
      this.setData({
        [goodsSelectAmount]: ordersArr.length,
        [purchaseQuantityArr]: goodsPurchaseArr
      })
    }


  },

  unChoiceOrder(e) {
    var parentIndex = e.currentTarget.dataset.parentindex;
    var index = e.currentTarget.dataset.index;
    var orderIndex = e.currentTarget.dataset.orderindex;
    var hasChoice = this.data.planArr[parentIndex].goodsList[index].orders[orderIndex].hasChoice;
    var selectAmount = this.data.planArr[parentIndex].goodsList[index].selectAmount;

    var hasChoiceData = "planArr[" + parentIndex + "].goodsList[" + index + "].orders[" + orderIndex + "].hasChoice";
    var goodsSelectAmount = "planArr[" + parentIndex + "].goodsList[" + index + "].selectAmount";
  
    if (hasChoice) {

      // this._cuculateItemPurchaseQuantity(parentIndex, index, orderIndex);

      this.setData({
        [hasChoiceData]: false,
        [goodsSelectAmount]: selectAmount - 1,
      })
      //
    } else {
      // this._cuculateItemPurchaseQuantity(parentIndex, index, orderIndex);

    
      this.setData({
        [hasChoiceData]: true,
        [goodsSelectAmount]: selectAmount + 1,
      })
      //

    }
  },

  _cuculateItemPurchaseQuantity(parentIndex, index, orderIndex) {
    var purchaseArr = this.data.planArr[parentIndex].goodsList[index].purchaseQuantity;
    var onFocus = this.data.planArr[parentIndex].goodsList[index].orders[orderIndex].onFocus;
    var standard = this.data.planArr[parentIndex].goodsList[index].orders[orderIndex].nxDoStandard;
    var quantity = this.data.planArr[parentIndex].goodsList[index].orders[orderIndex].nxDoQuantity;
    var orderId = this.data.planArr[parentIndex].goodsList[index].orders[orderIndex].nxDepartmentOrdersId;
    var purchaseQuantityArr = "planArr[" + parentIndex + "].goodsList[" + index + "].purchaseQuantity";
    console.log("000000")

    //1,去掉选择
    if (onFocus) {
      console.log("11111111")

      if (purchaseArr.length > 0) {
        console.log("222222222")
        for (var i = 0; i < purchaseArr.length; i++) {
          var id = purchaseArr[i].orderId;
          if (orderId == id) {
            purchaseArr.splice(i, 1);
          }
          console.log(purchaseArr)
        }
        this.setData({
          [purchaseQuantityArr]: purchaseArr
        })

      }
    } else {
      console.log("333333")

      //2 添加
      var purchaseItem = {
        orderId: orderId,
        quantity: quantity,
        standard: standard
      }
      purchaseArr.push(purchaseItem);
      this.setData({
        [purchaseQuantityArr]: purchaseArr
      })
    }

  },



  //保存进货商品
  addPlanPurchse(e) {
    console.log(e);
    var index= e.currentTarget.dataset.index;
    var parentIndex = e.currentTarget.dataset.parentindex;
  
    console.log(this.data.planArr)
    var item  = this.data.planArr[parentIndex].goodsList[index];

    this.setData({
      parentIndex: e.currentTarget.dataset.parentindex,
      index:  e.currentTarget.dataset.index,
      showPlanPurchase: true,
      item: item,
      standard: e.currentTarget.dataset.standard,

    })

   


  },

  confirm(e){
    console.log(e);


    var parentIndex = this.data.parentIndex;
    var index = this.data.index;

    console.log( this.data.planArr[this.data.parentIndex])
    var goodsId = this.data.planArr[parentIndex].goodsList[index].goodsId;
    var fatherGoodsId = this.data.planArr[parentIndex].fatherGoodsId;

    var ordersArr = this.data.planArr[parentIndex].goodsList[index].orders;
    var plan = e.detail.plan;
    var standard = e.detail.standard;
    // var temp = [];
    // for (var i = 0; i < ordersArr.length; i++) {
    //   var onFocus = ordersArr[i].onFocus;
    //   if (onFocus) {
    //     temp.push(ordersArr[i]);
    //   }
    // }

    var purGoods = {
      nxDpgNxGoodsId: goodsId,
      nxDpgNxGoodsFatherId: fatherGoodsId,
      nxDpgQuantity: plan,
      nxDpgStandard:  standard,
      nxDpgDistributerId: 1,
      nxDepartmentOrdersEntities: ordersArr,
    }
    savePlanPurchase(purGoods).then(res => {
      if (res) {
        console.log(res);
        this._getPlanPurchaseGoods();
      }
    })

  }















})