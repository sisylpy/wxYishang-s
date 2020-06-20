const globalData = getApp().globalData;

import {
  addNewStandard
} from '../../../lib/apiBusiness.js'



Page({

  /**
   * 页面的初始数据
   */
  data: {
    canSave: false,
    src: '../../../images/logof.png',
    nxStandardError: 0,



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      nxGoodsId: options.id,
    })

  },

  //规格名称
  getStandardName: function(e) {
    this.setData({
      nxStandardName: e.detail.value,
      isStandardName: true,
    })
    this._checkSave();
  },

  //规格比例
  getStandardScale: function(e) {
    this.setData({
      nxStandardScale: e.detail.value,
      isStandardScale: true
    })
    this._checkSave();
  },

  //规格误差
  getStandardError: function(e) {
    this.setData({
      nxStandardError: e.detail.value
    })
  },






  //选择图片
  choiceImg: function(e) {
    var _this = this;

    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        // success
        console.log(res)
        _this.setData({
          src: res.tempFilePaths,
          isSelectImg: true
        })
        _this._checkSave();
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })

  },



  saveHandling: function(e) {
    var filePathList = this.data.src;
    var nxStandardName = this.data.nxStandardName;
    var nxStandardScale = this.data.nxStandardScale;
    var nxStandardError = this.data.nxStandardError
    var nxSGoodsId = this.data.nxGoodsId;



    wx.showLoading({
      title: 'save a new handling',
    })

    addNewStandard(filePathList, nxStandardName, nxStandardScale, nxStandardError, nxSGoodsId)
      .then(res => {
        wx.hideLoading()

        if (res.result) {

          wx.navigateBack({
            delta: 1
          })
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2];
          prevPage.setData({
            addStandard: true,
          })
        }
      })
  },



  _checkSave: function() {
    var isSelectImg = this.data.isSelectImg;
    var isStandardName = this.data.isStandardName;
    var isStandardScale = this.data.isStandardScale;

    if (isSelectImg && isStandardName && isStandardScale) {
      this.setData({
        canSave: true
      })
    }

  }
















})