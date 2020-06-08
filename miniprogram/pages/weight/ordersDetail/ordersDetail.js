// pages/storeApplys/storeApplys.js

const app = getApp()
const globalData = getApp().globalData;
//getOrderDetail

import apiUrl from '../../../config.js'
import { getOrderDetail, saveSubOrderWeight } from '../../../lib/apiOrders.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      distributerId: globalData.distributerId,
      nxOrdersId: options.nxOrdersId
    })


    getOrderDetail(this.data.nxOrdersId)
      .then(res => {
        if (res) {
          console.log(res.result.data);
          this.setData({
            applyArr: res.result.data.nxOrdersSubEntities,
            order: res.result.data
          })
        }
        wx.setNavigationBarTitle({
          title: this.data.order.nxOrdersCommunityRoom,
        }) 
      })
        
  },


  getWeightValue:function(e){
 
    console.log(e)
  
    if(e.detail.value > 0 ){
      var index = e.currentTarget.dataset.index;
      var nxOsPrice = this.data.applyArr[index].nxOsPrice;
      var subtotal = Number(e.detail.value) * Number(nxOsPrice) ;
     
      var oxWeigh = "applyArr[" + index + "].nxOsWeight";
      var nxOsSubtotal = "applyArr[" + index + "].nxOsSubtotal";
      this.setData({
        [oxWeigh]: e.detail.value,
        [nxOsSubtotal]: subtotal.toFixed(1),
      })
    }

  },

  saveWeight: function(e){

    var data = this.data.order;
    var arr = this.data.applyArr;
    var resArr = [];
    var amount = 0;

    for(var i = 0; i < arr.length; i++){
      var weight = arr[i].nxOsWeight;
      console.log("huututututu")
      console.log(weight);
      console.log("clear?????")
      var temp = Number(arr[i].nxOsSubtotal);
      amount = amount +  temp;  
      if (weight > 0) {
        var apply = {
          nxOrdersSubId: arr[i].nxOrdersSubId,
          nxOsWeight: arr[i].nxOsWeight,
          nxOsSubtotal: arr[i].nxOsSubtotal,
        }
        resArr.push(apply);
      }
    }
    
    
    if (resArr.length == data.nxOrdersSubEntities.length) {
      data.nxOrdersStatus = 2;
      data.nxOrdersAmount = amount;
    }

    data.nxOrdersSubEntities = resArr;
    data.nxOrdersSubFinished = resArr.length;
    console.log(resArr.length)
    console.log(data.nxOrdersSubEntities.length)
    

    saveSubOrderWeight(data)
      .then(res => {
        if(res) {
          console.log(res);
          wx.navigateBack({
            delta: 1
          })
        }
      })
  }

  
})