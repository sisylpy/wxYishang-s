// pagesCustomer/goodsPage/goodsPage.js

import apiUrl from '../../config.js'
import userTime from '../../lib/userTime.js'
const globalData = getApp().globalData;
import {
  customerUserGetMy
} from '../../lib/apiCustomer.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    showWeighUser: true,

    


  },

  onShow:function(e){
   this._initData();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      // distributerId: globalData.distributerId,
      nxCustomerUserId: 2,
      url: apiUrl.server,

    })

    
   
  },

  _initData:function(){
    customerUserGetMy(this.data.nxCustomerUserId)
      .then(res => {
        if (res) {
          console.log(res.result.data)
          this.setData({
            templateArr: res.result.data.template,
            user: res.result.data.user,
          })
        }
      })
  },
  toMyGoodsDetail:function(e){
    console.log(e);
   wx.navigateTo({
     url: '../goodsPageDetail/goodsPageDetail?nxTemplateId=' + e.currentTarget.dataset.id ,
   })
  },

  toMyLove:function(e){

  },

  toMyRank: function(e){
    wx.navigateTo({
      url: '../rankGoods/rankGoods',
    })

  },


})