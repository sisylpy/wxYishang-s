var app = getApp();
const globalData = getApp().globalData;
import apiUrl from '../../../config.js'
import { getiBookFatherGoodsAndInitPage } from '../../../lib/apiBusiness.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    url: apiUrl.server
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log(options);
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      secondId: options.fatherId,

    })

    this.initGoodsPage(options.fatherId);

  },

//init
  initGoodsPage: function (fatherId) {
    getiBookFatherGoodsAndInitPage(fatherId)
      .then(res => {
        if (res) {
          console.log(res);
          this.setData({
            fatherArr: res.result.data.fatherList,
            initGoods: res.result.data.initGoods

          })
        }
      })
  },

  


  // 滚动切换标签样式
  switchTab: function (e) {
    console.log(e)
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  // 
  openGoodsPage: function(e){
    console.log(e)
    wx.navigateTo({
      url: '../goodsPage/goodsPage?productsId=' + e.currentTarget.dataset.id,
    })

  }
  

})