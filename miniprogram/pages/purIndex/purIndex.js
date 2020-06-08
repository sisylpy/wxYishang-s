const globalData = getApp().globalData;

var load = require('../../lib/load.js');

var _animation; // 动画实体

const _ANIMATION_TIME = 300; // 动画播放一次的时长ms

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    oneName: "地址管理",
    oneUrl: "../../images/logo.jpg",
    twoName: "供货商",
    twoUrl: "../../images/logo.jpg", 
    threeName: "送货店铺",
    threeUrl: "../../images/logo.jpg",

    showPrintTimes: true,
    
    pickAnimation: '',
    outAnimation: '',   
    indicatorDots: false,
    interval: 2000,
    duration: 400,
    openIndex: ""

   

  },

  onShow: function () {
    _animation = wx.createAnimation({
      duration: _ANIMATION_TIME,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50% 0'
    })

  //todo
  this._getIndexPageData();
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      depId: 4,
    
    })

  },




_getIndexPageData: function(){

  //1，获取首页初始化数据
  var data = {
    purDepId: this.data.depId,
  }
  load.showLoading("获取数据中")
  purchaseGoods(this.data.depId)
    .then(res => {
      load.hideLoading();
      console.log(res.result)
      this.setData({
        plan: res.result.data,
      })

      //初始化图片
      if(this.data.plan > 0){
        this.pickStartAnimationInterval(90);
      }
      
      //缓存打开店铺和商品


    })
},
  showPrintNumber: function(e){
    console.log(e)
    this.setData({
      openIndex: e.currentTarget.dataset.index
    })

  },




  /**
   * 拣货单-图片旋转
   */
  pickStartAnimationInterval: function (angle) {
    _animation.rotate(angle).step()
    this.setData({
      pickAnimation: _animation.export()
    })
  },


  /**
   * 出货单-图片旋转
   */
  outStartAnimationInterval: function (angle) {
    _animation.rotate(angle).step()
    this.setData({
      outAnimation: _animation.export()
    })
  },

  toApplys: function(e) {
    var fatherId = e.currentTarget.dataset.fatherid;
    var fatherName = e.currentTarget.dataset.fathername;
    
    wx.navigateTo({
      url: '../pur/purGoods/purGoods?fatherId=' +fatherId+'&fatherName='+ fatherName,
    })
  }





})