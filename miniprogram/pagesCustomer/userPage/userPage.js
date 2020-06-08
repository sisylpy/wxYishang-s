// pagesCustomer/userPage/userPage.js
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

  },




  toMemberInfo: function (e) {
    wx.navigateTo({
      url: '../memberInfo/memberInfo',
    })
  },

  toRegister: function (e) {
    wx.navigateTo({
      url: '../register/register',
    })

  },


  toAnalyse: function (e) {
    wx.navigateTo({
      url: '../memberInfo/memberInfo',
    })
  },


  toFamily: function (e) {
    wx.navigateTo({
      url: '../memberInfo/memberInfo',
    })
  },

})