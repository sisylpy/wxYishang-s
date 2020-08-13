// pages/order/addPickFirstStep/addPickFirstStep.js

var load = require('../../../lib/load.js');
import { disGetUserByRole,
  
} from '../../../lib/apiOrders.js'
  
import { savePurchaseBatchType} from '../../../lib/apiDepOrder'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedStores: 0,
    arr: [],
    disId: 1,
    purchaseUserId: ''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      batchId: options.batchId
    })
    
    this._getDeliveryUserData();

  }, 
  
  _getDeliveryUserData: function () {
    load.showLoading("获取数据中")
    var data = {
      disId: 1,
      roleNumber: 5,
    }
    disGetUserByRole(data)
      .then(res => {
        if (res) {

          load.hideLoading();
          console.log(res.result.data)

          this.setData({
            purchaseUserArr: res.result.data
          })
        }
      })
  },

  radioChange:function(e){
    console.log(e);
    this.setData({
      purchaseUserId: e.detail.value,
    })

  },


 saveBuyTypePurchaseBatch:function(){
  var value = wx.getStorageSync('purGoods');
  console.l
  if(value){

    
    value.nxDpbPurUserId = this.data.purchaseUserId;

    savePurchaseBatchType(value).then(res => {
      if(res) {
        console.log(res);
       
        wx.navigateTo({
          url: '../sharePage/sharePage?batchId=' + res.result.data,
        })
      
      }
    })

  }
  


  


}







})