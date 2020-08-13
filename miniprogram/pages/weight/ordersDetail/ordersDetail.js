// pages/storeApplys/storeApplys.js

const app = getApp()
const globalData = getApp().globalData;
//getOrderDetail

import apiUrl from '../../../config.js'
import { getToFillDepOrders, saveDepartmentOrderFillContent } from '../../../lib/apiDepOrder.js'
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
      nxDepId: options.nxDepId
    })


    getToFillDepOrders(this.data.nxDepId)
      .then(res => {
        if (res) {
          console.log(res.result.data);
          this.setData({
            applyArr: res.result.data,
          })
        }
       
      })
        
  },


  getWeightValue:function(e){
 
    console.log(e)
  
    if(e.detail.value > 0 ){
      var index = e.currentTarget.dataset.index;
      var nxDoPrice = this.data.applyArr[index].nxDoPrice;
      var subtotal = Number(e.detail.value) * Number(nxDoPrice) ;
     
      var nxDoWeight = "applyArr[" + index + "].nxDoWeight";
      var nxDoSubtotal = "applyArr[" + index + "].nxDoSubtotal";
      this.setData({
        [nxDoWeight]: e.detail.value,
        [nxDoSubtotal]: subtotal.toFixed(1),
      })
    }

  },

  saveWeight: function(e){

    var arr = this.data.applyArr;
    var resArr = [];

    for(var i = 0; i < arr.length; i++){
      var weight = arr[i].nxDoWeight;
      
      if (weight > 0) {
        var apply = {
          nxDepartmentOrdersId: arr[i].nxDepartmentOrdersId,
          nxDoWeight: arr[i].nxDoWeight,
        }
        resArr.push(apply);
      }
    }
      console.log(resArr)

    saveDepartmentOrderFillContent(resArr)
      .then(res => {
        if(res.result.code == 0) {
          console.log(res);
          wx.navigateBack({
            delta: 1
          })
        }
      })
  }

  
})