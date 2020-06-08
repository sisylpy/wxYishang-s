// pages/goods/goodsPage/goodsPage.js
var app = getApp();
const globalData = getApp().globalData;
import apiUrl from '../../../config.js'



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
    console.log(options)

    this.setData({
      productsId: options.productsId,
      productsId: 1,
      url: apiUrl.server

    })

    this.getProductsDetail();


  }, 

  getProductsDetail: function(){
    getProductsByProductsId(this.data.productsId)
    .then(res => {
      if(res) {
        this.setData({
          products: res.result.data
        })
      }
    })
  },

  openNewHandling: function(){
   wx.navigateTo({
     url: '../newHandling/newHandling',
   })
  },




})