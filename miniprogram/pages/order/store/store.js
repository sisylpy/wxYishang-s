// pages/order/store/store.js

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
  
  var value = wx.getStorageSync("store");
  if(value) {
    this.setData({
      store: value.storeList
      }
    )
  }

  },


  storeApplys:function(e) {
    console.log(e);
    var storeId = e.currentTarget.id;
    wx.navigateTo({
      url: '../storeApplys/storeApplys?storeId=' + storeId,
    })
  },








  
})