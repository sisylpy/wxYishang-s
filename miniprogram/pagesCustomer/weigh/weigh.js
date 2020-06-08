// pagesCustomer/order/order.js
const globalData = getApp().globalData;
import {
  jscode2session, sendCrl
} from '../../lib/apiBusiness.js'



Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyArr: [],
    multiIndex: [0, 0, 0],
    

  },
  
  send:function(e){
    console.log("send")
    sendCrl().
    then(res => {
      if(res) {
        console.log(res)
      }
    })

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
    }

    var userTime = wx.getStorageSync("userTime");
    if(userTime) {
      this.setData({
        userTime: userTime,

      })
    };

    var multiArray = wx.getStorageSync("multiArray");
    if(multiArray){
      this.setData({
        multiArray: multiArray
      })
    };

    var customerChoice = wx.getStorageSync("customerChoice");
    if (customerChoice){
      this.setData({
        customerChoice: customerChoice
      })
    }


  },

  confireApplys: function (e) {


  },
  cancelUsertime: function(e){
    wx.removeStorageSync("userTime");
    this.setData({
      userTime: null
    })

  },


  toAddressPage:function(){
   wx.navigateTo({
     url: '/pagesCustomer/customerInfo/customerInfo',
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
            var lenb = this.data.customerChoice[0].day.length;
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