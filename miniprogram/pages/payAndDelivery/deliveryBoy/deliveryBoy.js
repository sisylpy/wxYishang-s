// pages/order/addPickFirstStep/addPickFirstStep.js

var load = require('../../../lib/load.js');
import { disGetUserByRole,
  distributionDelivery,
} from '../../../lib/apiOrders.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedStores: 0,
    arr: [],
    disId: 1,
    pickUserId: ''


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    
    this._getDeliveryUserData();

  }, 
  
  _getDeliveryUserData: function () {
    load.showLoading("获取数据中")
    var data = {
      disId: 1,
      roleNumber: 1,
    }
    disGetUserByRole(data)
      .then(res => {
        if (res) {

          load.hideLoading();
          console.log(res.result.data)

          this.setData({
            pickUserArr: res.result.data
          })
        }
      })
  },

  radioChange:function(e){
    console.log(e);
    this.setData({
      pickUserId: e.detail.value,
    })

  },


distributeWeigh:function(){

  var temp = wx.getStorageSync("unDeliveryOrders");
  var temparr = [];
  if(temp) {
    for (var i = 0; i < temp.length; i++) {
      for(var j = 0; j < temp[i].arr.length; j++){
        if (temp[i].arr[j].isSelected) {
          var id = temp[i].arr[j].nxOrdersId;
          console.log(id);
          var order = {
            nxOrdersId: id
          }
          console.log(order)
          temparr.push(order);
        }
      }
    }
  }

console.log(temparr)
  var userid = this.data.pickUserId;
  
    var data = {
      deliveryUserId: userid,
      ordersEntities: JSON.stringify(temparr) 
    };

  distributionDelivery(data)
    .then(res => {
      if(res.result.code == 0) {
        wx.navigateBack({
          delta: 2
        })

      }
    })



  


}







})