// pages/customerDepList/customerDepList.js

import {getSubDepartments,} from '../../lib/apiDepOrder'

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

    getSubDepartments(options.depId).then(res =>{
      if(res) {
        console.log(res)
        this.setData({
          subArr: res.result.data,

        })
      }
    })

  },


  addCustomerOrders(e){
    wx.navigateTo({
      url: '../customerOrder/rIndex/rIndex?depId=' + e.currentTarget.dataset.id
      +'&hassubs=1',
    })
   

  },

  

})