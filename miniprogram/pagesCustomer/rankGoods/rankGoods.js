// pagesCustomer/rankGoods/rankGoods.js

import apiUrl from '../../config.js'
import userTime from '../../lib/userTime.js'
const globalData = getApp().globalData;
import {
  customerUserGetRank
} from '../../lib/apiCustomer.js'

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

    customerUserGetRank(1)
      .then(res => {
        if(res){
          console.log(res.result.data);
        }
      })


  },

})