// pages/storeApplys/storeApplys.js

const app = getApp()
const globalData = getApp().globalData;
import {
  getPurchaseGoodsByUUID,
} from '../../../lib/apiDepOrder'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    limit: 20,
    page: 1,



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uuid: options.uuid
    })
    
    getPurchaseGoodsByUUID(this.data.uuid)
      .then(res => {
        if (res) {
          console.log(res);
          this.setData({
            goodsArr: res.result.data

          })
        }
      })


  },


  /**
   * 用户点击右上角分享
   */
  
  onShareAppMessage: function (res) {
    return {
      title: '李沛谊订货',    
      path: '/pages/buy/sharePage/sharePage?uuid=' + this.data.uuid,     // 当前页面 path ，必须是以 / 开头的完整路径
      imageUrl: '../../../images/logo.jpg',
       success: function (res) {
         console.log(res)

       },
    }
  },
})