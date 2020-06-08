// pagesCustomer/order/order.js
const globalData = getApp().globalData;
import userTime from '../../lib/userTime.js'
import {
  saveOrder
} from '../../lib/apiOrders.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyArr: [],
    multiIndex: [0, 0, 0],
    

  },



  onShow: function () {
    console.log("aa")
    var userInfo = wx.getStorageSync("userInfo");
    if(userInfo){
      this.setData({
        userInfo: userInfo,
      })
    }
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
    })


    var applyArr = wx.getStorageSync("applyArr");
    if (applyArr.length > 0) {
      this.setData({
        applyArr: applyArr,
      })
      this._getTotal();
    }
   



    var userTime = wx.getStorageSync("userTime");
    if(userTime) {
      this.setData({
        userTime: userTime,

      })
    };
    this._getPickData();
  },



  reduce: function (e) {
   console.log(e);
    var applyIndex = e.currentTarget.dataset.index;
    var apply = "applyArr[" + applyIndex + "].nxOsQuantity";
    var number = this.data.applyArr[applyIndex].nxOsQuantity;
    var sub = this.data.applyArr[applyIndex].nxOsSubtotal;
    var sellType = this.data.applyArr[applyIndex].nxOsGoodsSellType;
    var price = this.data.applyArr[applyIndex].nxOsPrice;
    var scale = this.data.applyArr[applyIndex].nxOsGoodsSellStandardScale;
    var add = (Number(price) * Number(scale)).toFixed(1);
    var subWeight = this.data.applyArr[applyIndex].nxOsSubWeight;
    var nxOsSubtotal = "applyArr[" + applyIndex + "].nxOsSubtotal";
    var nxOsSubWeight = "applyArr[" + applyIndex + "].nxOsSubWeight";
    if (sellType == 0) {
      sub = (Number(sub) - Number(price)).toFixed(1);
      subWeight = Number(subWeight) - 1;
    } else if (sellType == 1) {
      sub = (Number(sub) - Number(add)).toFixed(1);
      subWeight = (Number(subWeight) - Number(scale)).toFixed(1);
    }

    console.log(number);
    if (number == 1) {
      if(this.data.applyArr.length == 1){
        console.log("back le")

        // wx.showToast({
        //   title: 'back',
        //   success:function(){
          
        //   }
        // })
        wx.navigateBack({
          delta: 1
        })
        this.data.applyArr.splice(applyIndex, 1);
        wx.setStorageSync("applyArr", applyArr);

      
      }else{

        var applyArr = this.data.applyArr;
        applyArr.splice(applyIndex, 1);
        this.setData({
          applyArr: applyArr,
        })
        wx.setStorageSync("applyArr", applyArr);
        this._getTotal();

      }

      
      
    } else {
      this.setData({
        [apply]: Number(number) - 1,
        [nxOsSubtotal]: sub,
        [nxOsSubWeight] : subWeight,
      })
      wx.setStorageSync("applyArr", this.data.applyArr);
      this._getTotal();

    }
  },

  add: function (e) {
    
    var applyIndex = e.currentTarget.dataset.index;
    var apply = "applyArr[" + applyIndex + "].nxOsQuantity";
    var number = this.data.applyArr[applyIndex].nxOsQuantity;
    var sub = this.data.applyArr[applyIndex].nxOsSubtotal;
    var sellType = this.data.applyArr[applyIndex].nxOsGoodsSellType;
    var price = this.data.applyArr[applyIndex].nxOsPrice;
    var scale = this.data.applyArr[applyIndex].nxOsGoodsSellStandardScale;
    var add = (Number(price) * Number(scale)).toFixed(1);
    var subWeight = this.data.applyArr[applyIndex].nxOsSubWeight;
    var nxOsSubtotal = "applyArr[" + applyIndex + "].nxOsSubtotal";
    var nxOsSubWeight = "applyArr[" + applyIndex + "].nxOsSubWeight";

    if(sellType == 0){
      sub = (Number(sub) + Number(price)).toFixed(1);
      subWeight = (Number(subWeight) + 1).toFixed(1);
    }else if (sellType == 1){
      sub  = (Number(sub) + Number(add)).toFixed(1);
      subWeight = (Number(subWeight) + Number(scale)).toFixed(1);
    }
    this.setData({
      [apply]: Number(number) + 1,
      [nxOsSubtotal]: sub,
      [nxOsSubWeight]: subWeight,
    })
    wx.setStorageSync("applyArr", this.data.applyArr);
    this._getTotal();


  },


  cancelUsertime: function(e){
    wx.removeStorageSync("userTime");
    this.setData({
      userTime: null
    })

  },
  _getTotal:function(e){
    var applyArr = this.data.applyArr;
    var total = 0;
    console.log("0000000----")
    for (var i = 0; i < applyArr.length; i++) {
      console.log("=====111111")
      var sub = applyArr[i].nxOsSubtotal;
      total = total + Number(sub);
      console.log(total);
    }
    this.setData({
      total: total.toFixed(1)
    })

  },

  gorRunnerLobby1: function () {
    var that = this;
    console.log("@22")
    wx.requestSubscribeMessage({
      tmplIds: ['iBEpT3V5qQy4xXOPsDAuIU1n-Z0ruTuOB3NN_6xFSKU'],
      success(res) {
        console.log("可以给用户推送一条中奖通知了。。。");
        var data = that._getOrderData();
        saveOrder(data)
        .then(res => {
          if(res) {
            console.log(res.result);
            wx.removeStorageSync("applyArr");
            wx.removeStorageSync("userTime");

            wx.navigateBack({
              delta: 1
            })
          }
        })
        
      },
      fail(res) {

        console.log('fail  失败')

        console.log(res)

        logger.warn('订阅消息fail', res)

      },
    })
  },

  gorRunnerLobby:function(){
    var data = this._getOrderData();
    saveOrder(data)
    .then(res => {
      if(res) {
        console.log(res.result);
        wx.removeStorageSync("applyArr");
        wx.removeStorageSync("userTime");

        wx.navigateBack({
          delta: 1
        })     
         }
    })

  },

  _getOrderData:function(e){
   
    var applyArr = wx.getStorageSync("applyArr");
    var userTime = wx.getStorageSync("userTime");
    var method = userTime.method;
    var dayName = userTime.dayName;
    var serviceTime = userTime.dayTime;

    var service = ""
    var arr = serviceTime.split(":");
    var hour = arr[0];
    if(hour < 10)hour = "0" + hour;
    var min = arr[1];
   
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    if (month < 10) month = "0" + month;

    var date = new Date();
    var today = date.getDate();
    // var date1 = new Date();
    var date2 = new Date(date);
    date2.setDate(date.getDate() + 1);
    var tomorrow = date2.getDate();
    var serviceDate = "";
    if(method == "今天"){
      serviceDate = month + '-' + today;
      service = month + today + hour + min;

    }if(method == "明天"){
      service = month + tomorrow + hour + min;
      serviceDate = month + '-' + tomorrow;
    }

    
    var data = {
      nxOrdersCustomerId: this.data.userInfo.nxCustomerId,
      nxOrdersUserId: this.data.userInfo.nxCustomerUserEntity.nxCuUserId,
      nxOrdersDistributerId: this.data.userInfo.nxCustomerDisId,
      nxOrdersService: service,
      nxOrdersServiceDate: serviceDate,
      nxOrdersServiceTime: serviceTime,
      nxOrdersSubAmount: applyArr.length,
      nxOrdersSubEntities: applyArr,
      nxOrdersAmount: this.data.total
    }
    return data;
  },




//

  toAddressPage:function(){
   wx.navigateTo({
     url: '/pagesCustomer/customerInfo/customerInfo',
   })
  },


  _getPickData: function (e) {
    var customerChoice = userTime.getPickData();
    this.setData({
      customerChoice: customerChoice
    })

    var multiArray = userTime.getMultiArray();

    this.setData({
      multiArray: multiArray
    })
  },

  bindMultiPickerChange: function (e) {
    this.setData({
      method: this.data.multiArray[0][this.data.multiIndex[0]],
      dayName: this.data.multiArray[1][this.data.multiIndex[1]],
      dayTime: this.data.multiArray[2][this.data.multiIndex[2]]
    })
    var userTime = {
      method: this.data.method,
      dayName: this.data.dayName,
      dayTime: this.data.dayTime,
    }
    wx.setStorageSync("userTime", userTime);
    this.setData({
      userTime: userTime,
    })


  },

  bindMultiPickerColumnChange: function (e) {
    console.log(e);
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;

    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            var b = [];
            var lenb = this.data.customerChoice[0].day.length;
            console.log(lenb);
            for (var j = 0; j < lenb; j++) {
              var bz = this.data.customerChoice[0].day[j].dayName;
              console.log(bz);
              b.push(bz);
            }
            this.data.multiArray[1] = b;
            data.multiArray[2] = this.data.customerChoice[0].day[0].dayTime;
            break;
          case 1:
            var b = [];
            var lenb = this.data.customerChoice[1].day.length;
            console.log(lenb);
            for (var j = 0; j < lenb; j++) {
              var bz = this.data.customerChoice[1].day[j].dayName;
              console.log(bz);
              b.push(bz);
            }
            data.multiArray[1] = b;
            data.multiArray[2] = this.data.customerChoice[1].day[0].dayTime;
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;

      //ddd

      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = this.data.customerChoice[0].day[0].dayTime;
                break;
              case 1:
                data.multiArray[2] = this.data.customerChoice[0].day[1].dayTime;
                break;
              case 2:
                data.multiArray[2] = this.data.customerChoice[0].day[2].dayTime;
                break;
              case 3:
                data.multiArray[2] = this.data.customerChoice[0].day[3].dayTime;
                break;
              case 4:
                data.multiArray[2] = this.data.customerChoice[0].day[4].dayTime;
                break;
              case 5:
                data.multiArray[2] = this.data.customerChoice[0].day[5].dayTime;
                break;
              case 6:
                data.multiArray[2] = this.data.customerChoice[0].day[6].dayTime;
                break;

            }
            break;
          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = this.data.customerChoice[1].day[0].dayTime;
                break;
              case 1:
                data.multiArray[2] = this.data.customerChoice[1].day[1].dayTime;
                break;
              case 2:
                data.multiArray[2] = this.data.customerChoice[1].day[2].dayTime;
                break;
              case 3:
                data.multiArray[2] = this.data.customerChoice[1].day[3].dayTime;
                break;
              case 4:
                data.multiArray[2] = this.data.customerChoice[1].day[4].dayTime;
                break;
              case 5:
                data.multiArray[2] = this.data.customerChoice[1].day[5].dayTime;
                break;
              case 6:
                data.multiArray[2] = this.data.customerChoice[1].day[6].dayTime;
                break;

            }
            break;
        }
        data.multiIndex[2] = 0;
        console.log(data.multiIndex);


        break;

    }
    this.setData(data);

  },




})