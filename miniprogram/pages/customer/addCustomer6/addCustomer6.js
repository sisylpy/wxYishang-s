// pages/customer/addCustomer6/addCustomer6.js

import MapUtil from '../../../lib/map.js'

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
    // this.onMapTaped();

    let point = {lng:112.586149,lat:26.913201};
    // new BMap.Point(112.579325,26.915291),
    // new BMap.Point(112.584967,26.899086),
    // new BMap.Point(112.608287,26.898023),
    // new BMap.Point(112.605035,26.90764),
    // new BMap.Point(112.602825,26.914356),
    // new BMap.Point(112.588254,26.909862),
    let polygon  = [
      {lng:112.579325,lat:26.915291},
      {lng:112.608287,lat:26.898023},
      {lng:112.605035,lat:26.90764},
      {lng:112.602825,lat:26.914356},
      {lng:112.588254,lat:26.909862},
  
    ] //多边形
    let oneResult = MapUtil.isPointInPolygon(point,polygon)
    console.log(oneResult)

  },

  onMapTaped(e){
    let point = {lng:114,lat:40};
    let polygon  = [{lng:114,lat:40},{lng:114.2,lat:40.1}] //多边形
    let oneResult = MapUtil.isPointInPolygon(point,polygon)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})