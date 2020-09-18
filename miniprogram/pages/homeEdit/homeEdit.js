
const globalData = getApp().globalData;
var load = require('../../lib/load.js');

import apiUrl from '../../config.js'
import {
  getDisUsers,
  deleteDisUser
} from '../../lib/apiDistributer'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    showOperation: false,
    toOpenMini: false,
    isTishi: false,
    toSharePurchase: false
  },

  onShow: function () {

    if(this.data.toSharePurchase){
      this.setData({
        isTishi: true
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      url: apiUrl.server,

    })

    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        
      })
    }

    this._initData();
    
  },

  
  toShareAdmin(){
    this.setData({
      toSharePurchase:  true
    })

  },

  /**
   * 邀请采购员
   * @param {*} options 
   */
  onShareAppMessage: function (options) {
    return {
      title: "注册管理员", // 默认是小程序的名称(可以写slogan等)
      path: '/pages/inviteAdmin/inviteAdmin?disId=' + this.data.userInfo.nxDiuDistributerId,
      imageUrl: '',
    }
  },

  // 初始化数据
  _initData() {

    getDisUsers(this.data.userInfo.nxDiuDistributerId).then(res =>{
      if(res.result.code == 0){
        console.log(res);
        this.setData({
          userArr: res.result.data,
        })
          // 获取页面总高度
          var that = this;
          var query = wx.createSelectorQuery();
          query.select('#mjltest').boundingClientRect()
          query.exec(function (res) {
            that.setData({
              maskHeight: res[0].height * globalData.rpxR
            })
          })
      }else{
        wx.showToast({
          title: '获取用户失败',
          icon: 'none'
        })
      }
    })
    
  },
  openOperation(e){
    this.setData({
      showOperation: true,
      selectUserId: e.currentTarget.dataset.id,

    })
  },


  /**
   * 关闭蒙版
   */
  hideMask() {
    this.setData({
      showOperation: false,
      
    })
  },


  /**
   * 删除用户
   */
  delUser() {
    load.showLoading("删除用户")
    deleteDepUser(this.data.selectUserId).then(res => {
      if (res.result.code !== -1) {
        load.hideLoading();
        this._initData();
      } else {
        load.hideLoading();
        wx.showToast({
          title: res.result.msg,
        })
      }
    })
  },


  /**
   * 打开修改订货群名称页面
   */
  editGroup() {
    wx.navigateTo({
      url: '../depGroupEdit/depGroupEdit',
    })
  },
  editUser(){
    wx.navigateTo({
      url: '../depUserEdit/depUserEdit',
    })
  },


  toSharePurchase(){
    this.setData({
      toSharePurchase:  true
    })

  },
  
  closeMask(){
    this.setData({
      toOpenMini:  false,
      isTishi: false,
      toSharePurchase: false
    })

  }















})