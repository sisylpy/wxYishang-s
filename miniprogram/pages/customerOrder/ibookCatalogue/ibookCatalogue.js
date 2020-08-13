// pages/business/catalogue/catalogue.js
import apiUrl from '../../../config.js'
import { getSubNameByFatherId } from '../../../lib/apiibook.js'
const globalData = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    limit: 200,
    page: 1,
    fatherName: "新鲜蔬菜",
    index: "1.6",
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
    // var data = {
    //   limit: this.data.limit,
    //   page: this.data.page,
    //   fatherId: this.data.fatherId,
    // }
    var data = {
      limit: 20,
      page: 1,
      fatherId: this.data.fatherId,
    }
    getSubNameByFatherId(data).
      then(res => {
        console.log(res.result.page.list)
        if (res) {
          this.setData({
            goodsList: res.result.page.list,
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
    wx.navigateTo({
      url: '/pagesOrder/ibookGoods/ibookGoods?fatherId=' + id +'&fatherName=' + fatherName + '&img=' + img + '&color=' + color + '&sort=' + sort,
    })

  },

  showAll: function(){
    this.setData({
      showAll: true,
    })
  }


})