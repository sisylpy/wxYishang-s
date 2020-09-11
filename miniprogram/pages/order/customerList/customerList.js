
import {
 
  disGetAllCustomer,

} from '../../../lib/apiDistributer.js'




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
    var subamount = e.currentTarget.dataset.subamount;
    if(subamount == 0){
      wx.navigateTo({
        url: '../rIndex/rIndex?depId=' + e.currentTarget.dataset.id 
        +'&depFatherId='+e.currentTarget.dataset.id,
        
      })
    }
    if(subamount > 0){
      wx.navigateTo({
        url: '../customerDepList/customerDepList?fatherId=' + e.currentTarget.dataset.id,
      }) 
    }

  },





})