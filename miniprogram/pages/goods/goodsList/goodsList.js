
var app = getApp();

import {disGetDisGoodsListByFatherId} from '../../../lib/apiDistributer'

const globalData = getApp().globalData;
import apiUrl from '../../../config.js'

var load = require('../../../lib/load.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    fatherId: null

  },
 
  onShow: function () {
    var addStandard = this.data.addStandard;

    if (addStandard){
     this._updateStandards();
    }else{
    }
    if(this.data.fatherId !== null){
      this._getInitData();
    }
  },

  _updateStandards(){
    var index = this.data.itemIndex;

    getStandardList(this.data.nxGoodsId)
    .then(res =>{
      if(res){
        var up = "goodsList[" + index + "].nxGoodsStandardEntities"
        this.setData({
          [up]: res.result.data
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
    console.log(e);
    var cur = e.target.dataset.current;
    if (this.data.currentTab == cur) { return false; }
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

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
    this.setData({
      // disId: globalData.userInfo.nxDistributerEntity.nxDistributerId,
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      disId: 1,
      url: apiUrl.server,
      fatherId: options.id,
      fatherName: options.name,
      // fatherId: 111
    })

    wx.setNavigationBarTitle({
      "title": options.name,
    })
  },

  _getInitData(){
  
    load.showLoading("获取商品中")
    disGetDisGoodsListByFatherId(this.data.fatherId).then(res => {
      if(res.result.code == 0){
        load.hideLoading();
        console.log(res);
        this.setData({
          goodsList: res.result.data
        })
      }else{
        wx.showToast({
          title: '获取商品失败',
          icon: 'none'
        })
      }
    })
  },

  // footerTap: app.footerTap,

  

  toDetail(e){
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?disGoodsId=' + e.currentTarget.dataset.id + '&fatherName=' + this.data.fatherName,
    })
  },

  addDisGoods(){
    wx.navigateTo({
      url: '../disAddGoods/disAddGoods?fatherId=' + this.data.fatherId + '&fatherName=' + this.data.fatherName,
    })
  },




})