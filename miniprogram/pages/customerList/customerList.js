// pages/customerList/customerList.js
import {
 
  disGetAllCustomer,

} from '../../lib/apiDepOrder.js'




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

    disGetAllCustomer(options.disId).then(res => {
      if(res){
        this.setData({
          myCustomerArr: res.result.data
        })
      }
    })

  },

  addCustomerOrders(e){
    console.log(e);
    var hassubs = e.currentTarget.dataset.hassubs;
    if(hassubs == 0){
      wx.navigateTo({
        url: '../customerOrder/rIndex/rIndex?depId=' + e.currentTarget.dataset.id 
        +'&hassubs=0',
        
      })
    }
    if(hassubs == 1){
      wx.navigateTo({
        url: '../customerDepList/customerDepList?depId=' + e.currentTarget.dataset.id,
      }) 
    }

  },





})