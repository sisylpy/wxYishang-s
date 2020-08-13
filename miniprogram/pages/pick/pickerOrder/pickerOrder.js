// pages/order/ordersPage/ordersList/ordersList.js

var load = require('../../../lib/load.js');


const globalData = getApp().globalData;
var app = getApp()

import apiUrl from '../../../config.js';

import { getUnPickerOrder, saveAssignUnweightOrder} from '../../../lib/apiDepOrder.js'



Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemIndex: 0,
    selOrderAmount: 0,
    tomorrowWeightOrderAmount: 0,


  },


  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      "title": "分派拣货单",
    }),
    

    wx.setNavigationBarColor ({
      frontColor: '#ffffff', 
      backgroundColor: '#466496', 
      animation: { 
        duration: 200,
        timingFunc: 'easeIn'
      }
    })

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      // distributerId: globalData.distributerId,
      distributerId: 1,
      // url: apiUrl.url
    })
     this._getUnPickerOrderData();
  },



// 点击切换标签
  swichNav:function(e){
  
    var that = this;
    this.setData({
      itemIndex: e.currentTarget.dataset.current
    });
  },

 

// 未称重接口
  _getUnPickerOrderData: function () {

    getUnPickerOrder(this.data.distributerId)
      .then(res => {
        if (res) {
          console.log(res.result)
          this.setData({
            depArr: res.result.data,

          })  
        }
      })
  },


  choiceisPayingOrder: function(e){
    
    var index = e.currentTarget.dataset.index;
    var todayArrSel = "depArr[" + index + "].isSelected";
    var isSelected = this.data.depArr[index].isSelected;
    var selOrderAmount = this.data.selOrderAmount;
    if (isSelected) {
      this.setData({
        [todayArrSel]: false,
        selOrderAmount: selOrderAmount - 1,
      })
      // wx.setStorageSync("unWeightOrders", this.data.depArr);
      // this._selectDepartentOrders();
      this._selectDepartment();

    }else{
      this.setData({
        [todayArrSel]: true,
        selOrderAmount: selOrderAmount + 1,
      })
      // wx.setStorageSync("unWeightOrders", this.data.depArr);
      // this._selectDepartentOrders();
      this._selectDepartment();

    }
  },

  _selectDepartentOrders(){
   var arr = this.data.depArr;
   for (var i = 0; i < arr.length; i++){
    var temp = [];

     if(arr[i].isSelected){
       var xxx = arr[i].nxDepartmentEntities.length;
       for(var j = 0; j < arr[i].nxDepartmentEntities.length; j++){
        console.log(arr[i].nxDepartmentEntities[j].nxDepartmentOrdersEntities);
        for(var m = 0; m < arr[i].nxDepartmentEntities[j].nxDepartmentOrdersEntities.length; m++){
          temp.push(arr[i].nxDepartmentEntities[j].nxDepartmentOrdersEntities[m])
        }
       }
       console.log(temp)
       wx.setStorageSync('unWeightOrders', temp)

     }

   }

  },


  _selectDepartment(){
    var dep = this.data.depArr;
    var depArr = [];
    for (var i = 0; i < dep.length; i++){
      var sel = dep[i].isSelected;
      if(sel){
        var dep = dep[i];
        depArr.push(dep);
      }
    }
    wx.setStorageSync("depArr", depArr);

  },

  assignUnWeightOrder: function(e) {

    wx.navigateTo({
      url: '../picker/picker',
    })
  }







})