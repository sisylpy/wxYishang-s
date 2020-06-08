// pages/business/catalogue/catalogue.js
import apiUrl from '../../../config.js'
import { getiBook } from '../../../lib/apiBusiness.js'
const globalData = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalPage: 0,
    totalCount: 0,
    limit: 21,
    currentPage: 1,
    isLoading: false,
    showIndex: -1,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(globalData)
    const distributerId = globalData.distributerId;


    console.log(options)
    this.setData({
      fatherId: options.fatherId,
      fatherName: options.fatherName,
      distributerId: distributerId
    })
    this.initGoodsPage(options.fatherId);

  },

  //init
  initGoodsPage: function (fatherId) {
    getiBook(fatherId)
      .then(res => {
        if (res) {
          console.log(res);
          this.setData({
            goodsList: res.result.data

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
      fatherId: this.data.fatherId,
    }
    console.log("11111111")
    getGoodsByFatherId(data)
      .then((res) => {
        console.log("onReachBottom")
        wx.hideLoading()
        if (typeof cb === 'function') {
          cb()
        }
        if (res.result) {
          var goodsList = res.result.page.list;
          if (goodsList.length > 0) {
            var currentPage = this.data.currentPage; // 获取当前页码
            currentPage += 1; // 加载当前页面的下一页数据
            var now = this.data.goodsList;
            var newdata = now.concat(goodsList)
            this.setData({
              goodsList: newdata,
              currentPage,
              isLoading: false,
              totalPage: res.result.page.totalPage,
              totalCount: res.result.page.totalCount,
            })
          }
        }
      })
  },


  clickFather: function(e){
    console.log(e);
    var clickIndex = e.currentTarget.dataset.index;
    if (this.data.showIndex == clickIndex){
      this.setData({
        showIndex: -1
      })
    }else{
      this.setData({
        showIndex: clickIndex
      })
    }
  },
  downSave: function(e){
    console.log(e);
    var id = e.currentTarget.dataset.id;
    console.log(id);
    var distributerId = this.data.distributerId;
    console.log(distributerId)


  }



})