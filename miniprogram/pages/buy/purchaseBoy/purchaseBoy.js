// pages/order/addPickFirstStep/addPickFirstStep.js

var load = require('../../../lib/load.js');
import { disGetUserByRole,
  purchaseDisGoods,
} from '../../../lib/apiOrders.js'

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


distributeWeigh:function(){

  var temp = wx.getStorageSync("purchaseGoods");
  var temparr = [];
  if (temp) {
    for (var i = 0; i < temp.length; i++) {
      for (var j = 0; j < temp[i].goodsList.length; j++) {
        if (temp[i].goodsList[j].isSelected) {
          var id = temp[i].goodsList[j].disGoodsId;
          var arr = temp[i].goodsList[j].subList;
          console.log(id);
          var order = {
            disGoodsId: id,
            nxOrdersSubEntities: arr
          }
          console.log(order)
          temparr.push(order);
        }
      }
    }
  }

console.log(temparr)
  var userid = this.data.purchaseUserId;
  
    var data = {
      purchaseUserId: userid,
      disGoodsEntities: JSON.stringify(temparr) 
    };

  purchaseDisGoods(data)
    .then(res => {
      if(res.result.code == 0) {
        wx.navigateBack({
          delta: 1
        })

      }
    })



  


}







})