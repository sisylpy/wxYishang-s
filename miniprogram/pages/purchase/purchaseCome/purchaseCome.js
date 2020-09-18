
var load = require('../../../lib/load.js');

let windowWidth = 0;
let itemWidth = 0;
const globalData = getApp().globalData;

import {
  getDisGoodsCata,
  disGetToPlanPurchaseGoods,
  savePlanPurchase,
} from '../../../lib/apiDistributer'




Page({
  data:{
    tab1Index:0,
    itemIndex:0,
    sliderOffset: 0,
    sliderOffsets: [],
    sliderLeft: 0,
    tabs: ["订单", "商品"],
   

    showPlanPurchase: false,
  },

  onLoad: function(options){
   
  //0,
  var value = wx.getStorageSync('userInfo');
    
  if(value){
    this.setData({
      disId: value.nxDistributerEntity.nxDistributerId,
      userInfo: value
    })
  }
    this.clueOffset();
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
    var index= e.currentTarget.dataset.index;
    var parentIndex = e.currentTarget.dataset.parentindex;
  
    var item  = this.data.planArr[parentIndex].nxDistributerGoodsEntities[index];

    this.setData({
      parentIndex: e.currentTarget.dataset.parentindex,
      index:  e.currentTarget.dataset.index,
      showPlanPurchase: true,
      item: item,

    })

   


  },

  confirm(e){
    console.log(e);


    var parentIndex = this.data.parentIndex;
    var index = this.data.index;

    console.log( this.data.planArr[this.data.parentIndex])
    var goodsId = this.data.planArr[parentIndex].nxDistributerGoodsEntities[index].nxDistributerGoodsId;
    var fatherGoodsId = this.data.planArr[parentIndex].nxDistributerFatherGoodsId;

    var ordersArr = this.data.planArr[parentIndex].nxDistributerGoodsEntities[index].nxDepartmentOrdersEntities;
    var plan = e.detail.plan;
    var standard = this.data.item.nxDgGoodsStandardname;
    
    var purGoods = {
      nxDpgDisGoodsId: goodsId,
      nxDpgDisGoodsFatherId: fatherGoodsId,
      nxDpgQuantity: plan,
      nxDpgStandard:  standard,
      nxDpgDistributerId: this.data.disId,
      nxDepartmentOrdersEntities: ordersArr,
    }
    savePlanPurchase(purGoods).then(res => {
      if (res) {
        console.log(res);
        this._getPlanPurchaseGoods();
      }
    })

  },


  /**
   * 计算偏移量
   */
  clueOffset() {
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        itemWidth = Math.ceil(res.windowWidth / that.data.tabs.length);
        let tempArr = [];
        for (let i in that.data.tabs) {
          console.log(i)
          tempArr.push(itemWidth * i);
        }
        // tab 样式初始化
        windowWidth = res.windowWidth;
        that.setData({
          sliderOffsets: tempArr,
          sliderOffset: 0,
          sliderLeft: 0,
          windowWidth: globalData.windowWidth * globalData.rpxR,
          windowHeight: globalData.windowHeight * globalData.rpxR,
        });

        

      }
    });
  },

  /**
   * tabItme点击
   */
  onTab1Click(event) {
    let index = event.currentTarget.dataset.index;
    this.setData({
      sliderOffset: this.data.sliderOffsets[index],
      tab1Index: index,
      itemIndex: index,
    })
  },

  /**
   * swiper-item 的位置发生改变
   */
  swiperTran(event) {
    let dx = event.detail.dx;
    let index = event.currentTarget.dataset.index;
    if (dx > 0) { //----->
      if (index < this.data.tabs.length - 1) { //最后一页不能---->
        let ratio = dx / windowWidth; /*滑动比例*/
        let newOffset = ratio * itemWidth + this.data.sliderOffsets[index];
        // console.log(newOffset,",index:",index);
        this.setData({
          sliderOffset: newOffset,
        })
      }
    } else { //<-----------
      if (index > 0) { //最后一页不能<----
        let ratio = dx / windowWidth; /*滑动比例*/
        let newOffset = ratio * itemWidth + this.data.sliderOffsets[index];
        console.log(newOffset, ",index:", index);
        this.setData({
          sliderOffset: newOffset,
        })
      }
    }

  },

  /**
   * current 改变时会触发 change 事件
   */
  swiperChange(event) {
    // this.setData({
    //   sliderOffset: this.data.sliderOffsets[event.detail.current],
    //   tab1Index: event.detail.current,
    //   itemIndex: event.detail.current,
    // })
  },
  /**
   * 动画结束时会触发 animationfinish 事件
   */
  animationfinish(event) {
    this.setData({
      sliderOffset: this.data.sliderOffsets[event.detail.current],
      tab1Index: event.detail.current,
      itemIndex: event.detail.current,
    })
    if (this.data.tab1Index == 0) {
      this._getPlanPurchaseGoods();
    }
    if (this.data.tab1Index == 1) {
      this._getInitData();


    }

  },


  _getInitData(){

    getDisGoodsCata(this.data.disId).then(res =>{
      if(res.result.data.length > 0){
        console.log(res.result.data);
        this.setData({
          goodsList: res.result.data,
        })
      }
    }) 
  },


  showOrHide(e){
    var greatIndex = e.currentTarget.dataset.greatindex;
    var grandIndex = e.currentTarget.dataset.grandindex;
    for( var i = 0; i < this.data.goodsList.length; i ++){
     
      for(var j = 0; j < this.data.goodsList[i].fatherGoodsEntities.length; j++){
        var itemShow = "goodsList["+ i+"].fatherGoodsEntities["+ j+"].isShow";
        console.log(i);
        console.log(greatIndex);
        console.log("<<<<<<<")
        console.log(j);
        console.log(grandIndex);
        console.log(">>>>>>>>>>>>");
         if (i != greatIndex || j != grandIndex) {
          this.setData({
            [itemShow]: false
          })         
         }    
      }  
    }

 
    var show = this.data.goodsList[greatIndex].fatherGoodsEntities[grandIndex].isShow;
    var itemShow = "goodsList["+ greatIndex+"].fatherGoodsEntities["+ grandIndex+"].isShow";
    this.setData({
      [itemShow]: !show
    })

  },

  toGoodsList(e){

    wx.navigateTo({
      url: '../disPurchaseGoodsList/disPurchaseGoodsList?fatherId=' + e.currentTarget.dataset.id,
    })


  },
  



})