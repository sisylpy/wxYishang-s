
const globalData = getApp().globalData;



Page({

  /**
   * 页面的初始数据
   */
  data: {
    canSave: false,
    src: '../../../images/logof.png',
    handlingName: 'abc',
    handlingContent: "ddd",
    yieldUpPercent: "12",
    yieldDownPercent: "33",
    handlingPrice: "45.0",


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      productsId: options.id,
      productsId: 1
    })

  },
  
  getHandlingName: function(e) {
    this.setData({
      handlingName: e.detail.value
    })
    this._checkSave();

  },
  getHandlingContent: function(e){
    this.setData({
      handlingContent: e.detail.value
    })
    this._checkSave();
  },
  getYieldDownPercent: function(e){
    this.setData({
      yieldDownPercent: e.detail.value
    })
    this._checkSave();
  },
  getYieldUpPercent: function(e) {
    this.setData({
      yieldUpPercent: e.detail.value
    })
    this._checkSave();
  },
  getHandlingPrice: function(e) {
    this.setData({
      handlingPrice: e.detail.value
    })
    this._checkSave();
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



  saveHandling: function (e) {
    var filePathList = this.data.src;
    var handlingName = this.data.handlingName;
    var handlingContent = this.data.handlingContent;
    var yieldUpPercent = this.data.yieldUpPercent
    var yieldDownPercent = this.data.yieldDownPercent;
    var handlingPrice = this.data.handlingPrice;
    var productsId = this.data.productsId;
    
   
    wx.showLoading({
      title: 'save a new handling',
    })

    addNewHandling(filePathList, handlingName, handlingContent, yieldUpPercent, yieldDownPercent, handlingPrice, productsId)
      .then((res) => {
        wx.hideLoading()
        if (typeof cb === 'function') {
          cb()
        }
        if (res.result) {
          wx.hideLoading();
          wx.navigateBack()
        } else {
        }
      })
  },



  _checkSave: function () {
    var isSelectImg = this.data.isSelectImg;
    var handlingName = this.data.handlingName;
    var handlingContent = this.data.handlingContent;
    var yieldUpPercent = this.data.yieldUpPercent;
    var yieldDownPercent = this.data.yieldDownPercent;
    var handlingPrice = this.data.handlingPrice;
    var productsId = this.data.productsId;

    if (isSelectImg && handlingName.length > 0 && handlingContent.length > 0 
      && yieldUpPercent.length > 0 && yieldDownPercent.length > 0 && handlingPrice.length > 0 
    ) {
      this.setData({
        canSave: true
      })
    }
  }
















})