// pages/order/addPickFirstStep/addPickFirstStep.js

var load = require('../../../lib/load.js');
import { disGetUserByRole } from '../../../lib/apiOrders.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedStores: 0,
    arr: [],
    disId: 1,



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      depId: options.depId
    })
    this._getWeighUserData();

  },

  _getWeighUserData: function () {
    load.showLoading("获取数据中")
    var data = {
      disId: 1,
      roleNumber: 3,
    }
    disGetUserByRole(data)
      .then(res => {
        if (res) {

          load.hideLoading();
          console.log(res.result.data)

          this.setData({
            pickStoreArr: res.result.data
          })
        }
      })
  },

  isSelected: function (e) {
    var isSelected = e.currentTarget.dataset.isselected;
    var index = e.currentTarget.dataset.index;
    var storeId = e.currentTarget.dataset.storeid;
    var tempArr = this.data.arr;

    var store = {
      storeId: storeId
    }

    if (this.data.pickStoreArr[index].isSelected) {
      console.log("splice...")
      tempArr.splice(tempArr.findIndex(item => item.storeId === storeId), 1)

      this.setData({
        ['pickStoreArr[' + index + '].isSelected']: false,
        selectedStores: this.data.selectedStores - 1,
        arr: tempArr
      })
    } else {
      tempArr.push(store);
      this.setData({
        ['pickStoreArr[' + index + '].isSelected']: true,
        selectedStores: this.data.selectedStores + 1,
        arr: tempArr
      })
    }
  },


  toGetGoodsFather: function (e) {
    var storeArr = this.data.arr;
    wx.navigateTo({
      url: '../addPickSecondStep/addPickSecondStep?storeArr=' + JSON.stringify(storeArr),
    })




  }







})