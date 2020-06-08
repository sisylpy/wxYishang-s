
const globalData = getApp().globalData;
import {
  addNewTemplate
} from '../../../lib/apiCustomer.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: "../../../images/logof.png",
    canSave: false,
    
   
    customerUserId: 1,




  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,

    })

   
  },



  //选择图片
  choiceImg: function (e) {
    var _this = this;

    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // success
        console.log(res)
        _this.setData({
          src: res.tempFilePaths,
          isSelectImg: true
        })
        _this._checkSave();
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

  },



  getTemplateName: function (e) {
    this.setData({
      templateName: e.detail.value
    })
    this._checkSave();

  },

  saveTemplate: function (e) {

    var filePathList = this.data.src;
    var templateName = this.data.templateName;
    var customerUserId = this.data.customerUserId;

    
   
    addNewTemplate(filePathList, templateName, customerUserId)
      .then((res) => {
        wx.hideLoading()
        if (typeof cb === 'function') {
          cb()
        }
        if (res.result) {
          wx.hideLoading();
          console.log(res.result.data)
          wx.navigateBack({
            delta: 1
          })
        } else {
        }
      })
  },


  _checkSave: function () {
    var isSelectImg = this.data.isSelectImg;
    var templateName = this.data.templateName;
   

    if (isSelectImg && templateName) {
      this.setData({
        canSave: true
      })
    }
  }
















})