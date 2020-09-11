// pages/storeApplys/storeApplys.js
const innerAudioContext = wx.createInnerAudioContext();

const app = getApp()
const globalData = getApp().globalData;
//getOrderDetail
var load = require('../../../lib/load.js');

import apiUrl from '../../../config.js'

import {
  getToFillDepOrders,
  saveToFillContent,
  downLoadYuyin
} from '../../../lib/apiDepOrder.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focusIndex: -1,
    lastInput: true,
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      distributerId: globalData.distributerId,
      depId: options.id,
      depHasSubs: options.depHasSubs,
     
    })

   
    var data = {
      depFatherId: this.data.depId,
    }
    load.showLoading("获取订单中")

    getToFillDepOrders(data)
      .then(res => {
        if (res) {
          console.log(res);
          load.hideLoading();

          if (this.data.depHasSubs == 0) {
            this.setData({
              applyArr: res.result.data,
            })
          }
          if (this.data.depHasSubs == 1) {
            this.setData({
              depArr: res.result.data,
            })
          }
        }
        load.hideLoading();
      })


    var that = this;
    // // Fragment 播放
    // const innerAudioContextOriginal = wx.createInnerAudioContext();
    // 监听播放回调  
    innerAudioContext.onPlay(() => {
      console.log('原音开始播放aaaa');
     
    })

    innerAudioContext.onStop(() => {
      console.log('原音播放停止');
    })
    innerAudioContext.onEnded(() => {
      console.log('原音播放结束');
    
    })
    innerAudioContext.onError((res) => {
      console.log(res)
    })
  },
  

  try (data) {
    console.log("try")
    var value = wx.getStorageSync(data);
    if(value){
      innerAudioContext.autoplay = true;
      innerAudioContext.src = value;
      innerAudioContext.play();
    }else{
      downLoadYuyin(data).then(res => {
        if (res) {
          console.log(res)
          if (res.result.statusCode === 200) {
            console.log("here???")
            wx.setStorageSync( data , res.result.tempFilePath)
            innerAudioContext.autoplay = true
            innerAudioContext.src = res.result.tempFilePath,
            innerAudioContext.play();
          }
        }
      })
    }
   

   
  },

  //input methos ======
  //1,输入
  inputValue(e) {
    console.log(e);

    var value = e.currentTarget.dataset.value;


    if (this.data.depHasSubs == 0) {

      // begin
      var oldValue = this.data.applyArr[this.data.focusIndex].nxDoPrice;

      //1，输入数字
      if (value <= 9 && value >= 0 ) {
        oldValue = this.data.applyArr[this.data.focusIndex].nxDoPrice;
        var newValue = 0;
        if (oldValue !== null) {
          newValue = oldValue + value;
        } else {
          newValue = value
        }
        this.setData({
          ["applyArr[" + this.data.focusIndex + "].nxDoPrice"]: newValue,
        })
        this.try(value); // read 数字
        this._getSubTotal();
      } else {

        console.log("ontherhehrehr")
        //2，输入“dian”
        if (value == ".") {
          oldValue = this.data.applyArr[this.data.focusIndex].nxDoPrice;
        var newValue = 0;
        if(oldValue.indexOf(".") != -1){
          this.try("tishi");

        }else{
          if (oldValue > 0) {
            newValue = oldValue + value;
           
            this._getSubTotal();
            this.try("dian")// read 清除
          } else {
            newValue = "0."
            this.try("lingdian")// read 清除
  
          }
          this.setData({
            ["applyArr[" + this.data.focusIndex + "].nxDoPrice"]: newValue,
          })
        }
        
      }
        //2，输入“删除”
        if (value == "del") {
          newValue = oldValue.substr(0, oldValue.length - 1);

          this.setData({
            ["applyArr[" + this.data.focusIndex + "].nxDoPrice"]: newValue,
          })
          this.try("delete")// read 清除
        }

        //3，输入“关闭”
        if (value == "close") {
          this.setData({
            focusIndex: -1,
            lastInput: true
          })
          this.try("close"); // read 关闭

        }
        //4,输入“下一个”
        if (value == "next") {
          var focusIndex = this.data.focusIndex;
          if (focusIndex !== this.data.applyArr.length - 1) {
            this.setData({
              focusIndex: focusIndex + 1,
            })
          } else {
            this.setData({
              focusIndex: -1,
              lastInput: true
            })
          }
          this.try("next");// read 下一个
        }
      }
    }
    //  d
    if (this.data.depHasSubs == 1) {

      // begin
      var oldValue = this.data.depArr[this.data.focusParentIndex].depOrders[this.data.focusIndex].nxDoPrice;

      //1，输入数字
      if (value <= 9 && value >= 0) {
        var newValue = 0;
        if (oldValue !== null) {
          newValue = oldValue + value;
        } else {
          newValue = value
        }
        this.setData({
          ["depArr[" + this.data.focusParentIndex + "].depOrders[" + this.data.focusIndex + "]nxDoPrice"]: newValue
        })
        this._getSubTotal();
        this.try(value); // read 数字
      } 
      
      else {
        console.log("ontherhehrehr")
        //2，输入“dian”
        if (value == ".") {
          oldValue = this.data.depArr[this.data.focusParentIndex].depOrders[this.data.focusIndex].nxDoPrice;
        var newValue = 0;
        if(oldValue.indexOf(".") != -1){
          this.try("tishi");

        }else{
          if (oldValue > 0) {
            newValue = oldValue + value;
           
            this._getSubTotal();
            this.try("dian")// read 清除
          } else {
            newValue = "0."
            this.try("lingdian")// read 清除
  
          }
          this.setData({
            ["depArr[" + this.data.focusParentIndex + "].depOrders[" + this.data.focusIndex + "]nxDoPrice"]: newValue          })
        }
        
      }
        //2，输入“删除”
        if (value == "del") {
          newValue = oldValue.substr(0, oldValue.length - 1);

          this.setData({
            ["depArr[" + this.data.focusParentIndex + "].depOrders[" + this.data.focusIndex + "]nxDoPrice"]: newValue
          })
          this.try("delete")// read 清除

        }

        //3，输入“关闭”
        if (value == "close") {
          console.log("close")
          this.setData({
            focusParentIndex: -1,
            focusIndex: -1,
            lastInput: true
          })
          this.try("close"); // read 关闭

        }
        //3,输入“下一个”
        if (value == "next") {
          var focusIndex = this.data.focusIndex;
          var focusParentIndex = this.data.focusParentIndex;

          console.log(focusParentIndex)
          console.log(this.data.depArr.length)

          if (focusParentIndex < this.data.depArr.length) {
            if (focusIndex < this.data.depArr[this.data.focusParentIndex].depOrders.length) {
              this.setData({
                focusIndex: focusIndex + 1,
              })
            }
            if (focusIndex == this.data.depArr[this.data.focusParentIndex].depOrders.length - 1) {
              this.setData({
                focusParentIndex: focusParentIndex + 1,
                focusIndex: 0,
              })
              if (focusIndex == this.data.depArr[this.data.focusParentIndex].depOrders[this.data.focusIndex] - 1) {

              }
            }
          }
          this.try("next"); // read 下一个

        }
      }
    }





    // .over




  },

  changeFocusIndex(e) {

    this.setData({
      focusParentIndex: e.currentTarget.dataset.parentindex,
      focusIndex: e.currentTarget.dataset.index,
      lastInput: false
    })

  },



  // ./input methods 




  _getSubTotal: function () {

    if (this.data.depHasSubs == 0) {

      var nxDoPrice = Number(this.data.applyArr[this.data.focusIndex].nxDoPrice);
      var nxDoWeight = Number(this.data.applyArr[this.data.focusIndex].nxDoWeight);

      if (nxDoPrice > 0 && nxDoWeight > 0) {
        var subtotal = (nxDoPrice * nxDoWeight).toFixed(1);
        var nxDoSubtotal = "applyArr[" + this.data.focusIndex + "].nxDoSubtotal";
        this.setData({
          [nxDoSubtotal]: subtotal,
        })
      }

    }

    if (this.data.depHasSubs == 1) {

      var nxDoPrice = Number(this.data.depArr[this.data.focusParentIndex].depOrders[this.data.focusIndex].nxDoPrice);
      var nxDoWeight = Number(this.data.depArr[this.data.focusParentIndex].depOrders[this.data.focusIndex].nxDoWeight);

      if (nxDoPrice > 0 && nxDoWeight > 0) {
        var subtotal = (nxDoPrice * nxDoWeight).toFixed(1);
        var nxDoSubtotal = "depArr[" + this.data.focusParentIndex + "].depOrders[" + this.data.focusIndex + "]nxDoSubtotal";
        this.setData({
          [nxDoSubtotal]: subtotal,
        })
      }

    }



  },

  saveWeight: function (e) {


    if (this.data.depHasSubs == 0) {
      var arr = this.data.applyArr;
      var resArr = [];

      for (var i = 0; i < arr.length; i++) {
        var weight = arr[i].nxDoPrice;

        if (weight > 0) {
          var apply = {
            nxDepartmentOrdersId: arr[i].nxDepartmentOrdersId,
            nxDoPrice: arr[i].nxDoPrice,
            nxDoSubtotal: arr[i].nxDoSubtotal
          }
          resArr.push(apply);
        }

      }
      this._save(resArr);

    }

    if (this.data.depHasSubs == 1) {
      var depArr = this.data.depArr;
      var resArr = [];

      for (var i = 0; i < depArr.length; i++) {
        for (var j = 0; j < depArr[i].depOrders.length; j++) {
          var weight = depArr[i].depOrders[j].nxDoPrice;

          if (weight > 0) {
            var apply = {
              nxDepartmentOrdersId: depArr[i].depOrders[j].nxDepartmentOrdersId,
              nxDoPrice: depArr[i].depOrders[j].nxDoPrice,
              nxDoSubtotal: depArr[i].depOrders[j].nxDoSubtotal
            }
            console.log("------")
            console.log(apply)

            resArr.push(apply);
          }

        }
      }
      this._save(resArr);

    }

  },
  _save(resArr) {
    saveToFillContent(resArr)
      .then(res => {
        load.showLoading("保存数量订单中")
        if (res.result.code == 0) {
          console.log(res);
          load.hideLoading();
          wx.navigateBack({
            delta: 1
          })
        }
      })
  }






})