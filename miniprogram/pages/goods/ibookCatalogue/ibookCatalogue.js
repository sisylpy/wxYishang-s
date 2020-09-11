// pages/business/catalogue/catalogue.js
import apiUrl from '../../../config.js'
import { getSubNameByFatherId } from '../../../lib/apiibook.js'
const globalData = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    showAll: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      fatherId: options.fatherId,
      fatherName: options.fatherName,
      color: options.color,
      index: options.index,
      url: apiUrl.server,

    })

    
    this._initCatalogueData();
   

  },

  _initCatalogueData: function () {
   
   
    getSubNameByFatherId(this.data.fatherId).
      then(res => {
        console.log(res.result.code == 0)
        if (res) {
          this.setData({
            goodsList: res.result.data,
          })

        }
      })
  },

  clickFather:function(e){
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var fatherName = e.currentTarget.dataset.fathername;
    var img = e.currentTarget.dataset.img;
    var color = e.currentTarget.dataset.color;
    var sort = e.currentTarget.dataset.sort;
    var grandid = e.currentTarget.dataset.grandid;
    var grandname = e.currentTarget.dataset.grandname;
    var data = {
      grandId: grandid,
      grandName: grandname,
      grandImg : img,
      grandColor : color 
    }
    wx.setStorageSync('grandFather', data)
    wx.navigateTo({
      url: '../ibookGoods/ibookGoods?fatherId=' + id +'&fatherName=' + fatherName + '&img=' + img + '&color=' + color + '&sort=' + sort,
    })

  },

  showAll: function(){
    this.setData({
      showAll: true,
    })
  }


})