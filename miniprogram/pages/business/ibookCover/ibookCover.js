// pages/ibook/ibook.js
const app = getApp()
const globalData = app.globalData;
import apiUrl from '../../../config.js'
import { getiBook } from '../../../lib/apiibook.js'
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
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
        windowHeight: globalData.windowHeight * globalData.rpxR,
    })

    var value = wx.getStorageSync('userInfo');
      if(value){

        

        wx.setNavigationBarTitle({
          // "title": value.nxDistributerEntity.nxDistributerName,
          "title": "商品手册",

        })

      }
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
    var grandid = e.currentTarget.dataset.grandid;
    var grandname = e.currentTarget.dataset.grandname;
    console.log(e);
    var grand = {
      greatGrandId: grandid,
      greatGrandName: grandname,
      greatGrandColor: color
    }
    wx.setStorageSync('greatGrandFather', grand)
    wx.navigateTo({
      url: '../ibookCatalogue/ibookCatalogue?fatherId=' +fatherId + '&fatherName=' +  fatherName +'&index=' + index +'&color='+ color,
    })
  },

  
})