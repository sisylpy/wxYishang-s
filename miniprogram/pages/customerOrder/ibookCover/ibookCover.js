// pages/ibook/ibook.js
const app = getApp()
const globalData = app.globalData;
import { getiBook } from '../../../lib/apiibook.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    indicatorDots: true,
    autoplay: false,
    interval: 2000,
    duration: 400,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth,
      windowHeight: globalData.windowHeight,
      second_height: globalData.windowHeight - (globalData.windowWidth / 750) * 64
    })

    this.initPageData();

  
  },


  initPageData: function () {
    getiBook()
      .then(res => {
        if (res) {
          console.log(res);
          this.setData({
            ibooklist: res.result.data
          })

        }
      })
  },

  todetail: function(e){
    console.log(e);
    var fatherId = e.currentTarget.dataset.fatherid;
    var fatherName = e.currentTarget.dataset.fathername;
    var index = e.currentTarget.dataset.index;
    var color = e.currentTarget.dataset.color;
    console.log(e);
    wx.navigateTo({
      url: '../ibookCatalogue/ibookCatalogue?fatherId=' +fatherId + '&fatherName=' +  fatherName +'&index=' + index +'&color='+ color,
    })
  },

  
})