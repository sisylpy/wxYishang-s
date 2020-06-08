const app = getApp()
const globalData = app.globalData;
//

import { getOrdersToWeigh } from '../../../lib/apiOrders.js'



Page({
  data: {
    
    sotckRecords: [],
    outStockValue: '',
    selectId: -1
  },

// onShow: function(e) {

//  this._getApplyByPageNumber();
// },
  onLoad: function (options) {
    var that = this;
    that.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      sentenceWidth: globalData.windowWidth * globalData.rpxR - 50,
      // beyondKeyHeight: globalData.beyondKeyHeight,
      pickerUserId: options.pickerUserId
    
    })
    that._getApplyByPageNumber();


    wx.setNavigationBarTitle({
      title: '第' + that.data.pageNumber + '几次打印'
    })



   



  },

  _getApplyByPageNumber: function(e) {


    var data = {
      pickerUserId: this.data.pickerUserId,
      status: 1,
    }
    getOrdersToWeigh(data)
      .then(res => {
        if (res) {
          console.log(res.result.data)
          this.setData({
            goodsArr: res.result.data
          })
          // wx.setStorageSync("goodsArr", res.result.data)
        }
      })

  },
  clickGoods: function(e) {
   var goodsIndex = e.currentTarget.dataset.goodsindex;
   var goodsFinished = this.data.goodsArr[goodsIndex].finished;

   if (goodsFinished) {
     this.setData({
       ['goodsArr[' + goodsIndex + '].finished']: false
     })
   }else {
     this.setData({
       ['goodsArr[' + goodsIndex + '].finished']: true
     })
   }
   

  },


  

  
  togetQuantity: function(e) {
    console.log("blur.............")
    console.log(e);
    this._giveThisValue(e);
  


  },

  _giveThisValue(e) {
    var value = e.detail.value;
    var applyId = e.currentTarget.dataset.applyid;
    var applyIndex = e.currentTarget.dataset.applyindex;
    var goodsIndex = e.currentTarget.dataset.goodsindex;
    var applyAmount = e.currentTarget.dataset.applyamount;

    if (Number(value) > 0) {
      this.setData({
        ['goodsArr[' + goodsIndex + '].applys[' + applyIndex + '].stockRecordEntity.quantity']: value,
        ['goodsArr[' + goodsIndex + '].applys[' + applyIndex + '].onFocus']: false,
      })
    }
    this._checkFinished(goodsIndex, applyAmount);
  },

  _checkFinished(goodsIndex, applyAmount) {
    var applys = this.data.goodsArr[goodsIndex].applys;
    var valueAmount = 0;
    for(var i = 0; i < applys.length; i++){
      var value = applys[i].stockRecordEntity.quantity;
      console.log(value)
      if(!value == ""){
        valueAmount += 1 ;
      }
    }
    if (valueAmount == applyAmount){
        this.setData({
            ['goodsArr[' + goodsIndex + '].finished']: true
          })
    }
    


  },


  //下一个input获取焦点
  confirmToNext: function(e) {
    console.log("confirm..........")
    console.log(e);
    this._giveThisValue(e);

    var applyIndex = e.currentTarget.dataset.applyindex;
    var goodsIndex = e.currentTarget.dataset.goodsindex;
    var applyAmount = e.currentTarget.dataset.applyamount;

    var nextApplyIndex = parseInt(applyIndex) + 1;
    var nextGoodsIndex = parseInt(goodsIndex) + 1;

    console.log("look????")

    if (applyIndex < applyAmount - 1){
      this.setData({
        ['goodsArr[' + goodsIndex + '].applys[' + nextApplyIndex + '].onFocus']: true,
      })
    }else if (applyIndex == applyAmount - 1) {
      this.setData({
        ['goodsArr[' + nextGoodsIndex + '].applys[0].onFocus']: true,
      })
    }
    
  },

//如果是最后一个输入框，则关闭键盘
  _claseKeyboard: function (e) {
    console.log("closeKeyboard")
  },



  // 保存课堂
  saveStock: function (e) {

   var stockArr = this.data.goodsArr;
   console.log(stockArr);
   var stockRecordArr = [];
   for(var i = 0; i <  stockArr.length; i++) {
     for(var j = 0; j < stockArr[i].applys.length; j++) {
       var stockEntity = stockArr[i].applys[j]['stockRecordEntity'];
       console.log(stockArr[i].applys[j])
       console.log(stockEntity)

       var quantity = stockEntity.quantity;
       if (Number(quantity) > 0) {
         stockRecordArr.push(stockEntity);
       }

     }
   }
    
   

    saveStockRecords(stockRecordArr)
    .then(res => {
      if(res) {
        console.log(res)
        wx.navigateBack({
          delta: 1
        })
      }
    })



  
  },



  

  









  

})