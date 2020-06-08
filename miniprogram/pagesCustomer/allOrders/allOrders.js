// pagesCustomer/checkOrder/checkOrder.js

import apiUrl from '../../config.js'
import userTime from '../../lib/userTime.js'
const globalData = getApp().globalData;
import {
  customerGetOrders
} from '../../lib/apiCustomer.js'




Page({

  /**
   * 页面的初始数据
   */
  data: {

    itemIndex: 0,
    totalPage: 0,
    totalCount: 0,
    limit: 21,
    currentPage: 1,

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
      nxCustomerUserId: 1

    })
     
  },


  _initData() {

    var data = {
      limit: this.data.limit,
      page: this.data.currentPage,
      nxOrdersUserId: this.data.nxCustomerUserId,
    }
   
    customerGetOrders(data)
      .then(res => {
        if (res) {
          console.log(res.result.page.list)
          this.setData({
            totalPage: res.result.page.totalPage,
            totalCount: res.result.page.totalCount,
            orderArr: res.result.page.list,
          })
        }
      })

  
  },

  // onReachBottom  onPullDownRefresh
  onReachBottom: function () {
    console.log("000000")
    let { currentPage, totalPage, isLoading } = this.data
    console.log(currentPage)
    console.log(totalPage)

    if (currentPage >= totalPage || isLoading) {
      console.log("coming??")
      return
    }
    this.setData({
      isLoading: true
    })


    // let { limit, fatherId } = this.data
    // currentPage = currentPage + 1;
    console.log("4444")
    var data = {
      limit: this.data.limit,
      page: this.data.currentPage + 1,
      nxOrdersUserId: this.data.nxCustomerUserId,
    }
    console.log("11111111")
    customerGetOrders(data)
      .then((res) => {
        console.log("onReachBottom")
        wx.hideLoading()
        if (typeof cb === 'function') {
          cb()
        }
        if (res.result) {
          console.log(res.result)
          var orderArr = res.result.page.list;
          if (orderArr.length > 0) {
            var currentPage = this.data.currentPage; // 获取当前页码
            currentPage += 1; // 加载当前页面的下一页数据
            var now = this.data.orderArr;
            var newdata = now.concat(orderArr)
            this.setData({
              orderArr: newdata,
              currentPage,
              isLoading: false,
              totalPage: res.result.page.totalPage,
              totalCount: res.result.page.totalCount,
            })
          }
        }
      })
  },

  toDetail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../ordersDetailPage/ordersDetailPage?nxOrdersId=' + id,
    })

  },







})