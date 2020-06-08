// pages/order/addPickFirstStep/addPickFirstStep.js

var load = require('../../../lib/load.js');
import { disGetUserByRole,
  distributionWeighing,
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

  var temp = wx.getStorageSync("unWeightOrders");
  var temparr = [];
  if(temp) {
    for (var i = 0; i < temp.length; i++) {
      if(temp[i].isSelected){
        var id = temp[i].nxOrdersId;
        console.log(id);
        var order = {
          nxOrdersId: id
        }
        console.log(order)
        temparr.push(order);
      }
    
    }
  }

console.log(temparr)
  var userid = this.data.pickUserId;
  
    var data = {
      pickUserId: userid,
      ordersEntities: JSON.stringify(temparr) 
    };

    distributionWeighing(data)
    .then(res => {
      if(res.result.code == 0) {
        wx.navigateBack({
          delta: 2
        })

      }
    })



  


}







})