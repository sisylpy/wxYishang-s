// pages/business/catalogue/catalogue.js


import apiUrl from '../../config.js'
import userTime from '../../lib/userTime.js'
const globalData = getApp().globalData;
import {
  cgCataList
} from '../../lib/apiBusiness.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

    multiIndex: [0, 0, 0],
    applyArr: [],
    method: 0,
    show: false,
    showCar: false,
    itemIndex: 0,

  },


  onShow: function () {

    this._getUserInfo();

    this._getGoods();


    this._getPickData();
    var value = wx.getStorageSync("applyArr");
    if (value.length > 0) {
      this.setData({
        applyArr: value,
        applyNumber: value.length,
      })
    } else {
      wx.setStorageSync("applyArr", []);
      this.setData({
        applyArr: [],
      })

    }

    // var userTime = wx.getStorageSync("userTime");
    // if (userTime) {
    //   this.setData({
    //     userTime: userTime
    //   })
    // } else {
    //   this.setData({
    //     userTime: null
    //   })
    // }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      distributerId: 1,
      server: apiUrl.server
    })



  },

  _getUserInfo() {
    var userInfo = wx.getStorageSync("userInfo");
    var userTime = wx.getStorageSync("userTime");

    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
    }else{
      wx.redirectTo({
        url: '../register/register',
      })
    };

    if (userTime) {
      this.setData({
        userTime: userTime
      })
    }

  },

  _getGoods() {
    cgCataList(this.data.distributerId).
      then(res => {
        if (res) {
          console.log(res.result.data)
          this.setData({
            goodsList: res.result.data,
          })
        }
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
    this.setData({
      userTime: userTime
    })
    wx.setStorageSync("userTime", userTime);


  },

  bindMultiPickerColumnChange: function (e) {
    console.log(e);
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;

    //修改第一列---天
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
          //修改第二列 ---下午
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


  _initPickerData: function (e) {



  },

  _getWeek() {

    var a = ["日", "一", "二", "三", "四", "五", "六"];
    var week = new Date().getDay();

    var date1 = new Date();
    var date2 = new Date(date1);

    date2.setDate(date1.getDate() + 1);
    var week2 = date2.getDay();

    date2.setDate(date1.getDate() + 2);
    var week3 = date2.getDay();

    date2.setDate(date1.getDate() + 3);
    var week4 = date2.getDay();

    date2.setDate(date1.getDate() + 4);
    var week5 = date2.getDay();

    date2.setDate(date1.getDate() + 5);
    var week6 = date2.getDay();

    date2.setDate(date1.getDate() + 6);
    var week7 = date2.getDay();

    date2.setDate(date1.getDate() + 7);
    var week8 = date2.getDay();

    var weekOne = a[week2];
    var weekTwo = a[week3];
    var weekThree = a[week4];
    var weekFour = a[week5];
    var weekFive = a[week6];
    var weekSix = a[week7];
    var weekSeven = a[week8];




  },






  clickFather: function (e) {
    console.log(e);
    console.log("why????")
    var id = e.currentTarget.dataset.id;
    var fatherName = e.currentTarget.dataset.fathername;
    wx.navigateTo({
      url: '/pagesCustomer/sign/sign?fatherId=' + id + '&fatherName=' + fatherName,
    })

  },

  showCar: function (e) {
    console.log(e);
    if (this.data.showCar) {
      this.setData({
        showCar: false,
      })
    } else {
      this.setData({
        showCar: true,
      })
    }
  },

  reduce: function (e) {

    var applyIndex = e.detail.index;
    var apply = "applyArr[" + applyIndex + "].nxOsQuantity";
    var number = this.data.applyArr[applyIndex].nxOsQuantity;
    if (number == 1) {
      var applyArr = this.data.applyArr;
      applyArr.splice(applyIndex, 1);
      this.setData({
        applyArr: applyArr,
      })
      wx.setStorageSync("applyArr", applyArr);
      if (applyArr.length == 0) {
        this.setData({
          showCar: false
        })
      }
    } else {
      this.setData({
        [apply]: Number(number) - 1,
      })
      wx.setStorageSync("applyArr", this.data.applyArr);

    }
  },

  add: function (e) {
    var applyIndex = e.detail.index;
    var apply = "applyArr[" + applyIndex + "].nxOsQuantity";
    var number = this.data.applyArr[applyIndex].nxOsQuantity;
    this.setData({
      [apply]: Number(number) + 1,
    })
    wx.setStorageSync("applyArr", this.data.applyArr);

  },

  choiceFinish: function (e) {
    this.setData({
      showCar: false
    })
    this.bindMultiPickerChange();
    wx.navigateTo({
      url: '../../pagesCustomer/order/order',
    })

  },

  toUserPage: function () {
    wx.navigateTo({
      url: '../userPage/userPage',
    })
  },

  toAllOrders: function () {
    wx.navigateTo({
      url: '../allOrders/allOrders',
    })
  },

  toOrderHistory: function () {
    wx.navigateTo({
      url: '../oftenOrder/oftenOrder',
    })
  },



  // 滚动切换标签样式
  switchTab: function (e) {
    console.log(e)

    this.setData({
      itemIndex: e.detail.current
    });
    if (this.data.itemIndex == 0) {

    }
    if (this.data.itemIndex == 1) {

    }
    if (this.data.itemIndex == 2) {

    }

  },



  switchSubTab: function (e) {
    this.setData({
      purItemIndex: e.detail.current
    });
  },


  toMyGoodsDetail: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '../goodsPageDetail/goodsPageDetail',
    })
  },

  toCaidiPage: function(e) {
    wx.navigateTo({
      url: '../caidiPage/caidiPage',
    })
  },

  emptyApplyArr:function(e){
    console.log("empty")
    wx.setStorageSync("applyArr", []);
    this.setData({
      applyArr : [],
      showCar: false,
    })
  }
  

})