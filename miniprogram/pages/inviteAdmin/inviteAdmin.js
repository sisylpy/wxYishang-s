
const globalData = getApp().globalData;
var load = require('../../lib/load.js');
import {
  disUserSave,
  disLogin,
} from '../../lib/apiDistributer'

Page({

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      disId: options.disId,
    })
  },


  //
  getUserInfo: function (e) {

    //用户点击“确认”
    wx.getUserInfo({
      success: res => {
        wx.login({
          success: (res) => {

            // 注册接口
            if (e.currentTarget.dataset.type == 0) {
              var nxDistributerUser = {
                nxDiuWxNickName: e.detail.userInfo.nickName,
                nxDiuWxAvartraUrl: e.detail.userInfo.avatarUrl,
                nxDiuCode: res.code,
                nxDiuAdmin: 1,
                nxDiuDistributerId: this.data.disId,
                roleEntities: [{
                  nxDurRoleId: 0
                }]
              }
              load.showLoading("管理员注册中")
              disUserSave(nxDistributerUser)
                .then((res => {
                  if (res.result.code !== -1) {
                    console.log(res.result.data)

                    wx.setStorageSync('userInfo', res.result.data)
                    wx.switchTab({
                      url: '../order/index/index',
                    })
                    
                  } else {
                    load.hideLoading();
                    wx.showToast({
                      title: res.result.msg,
                    })
                    this.setData({
                      resCode: -1
                    })
                  }
                }))
            } else {
              var disUser = {
                nxDiuCode: res.code,
              }
            //登陆接口
            disLogin(disUser)
                .then((res) => {
                  wx.hideLoading()              
                  if (res.result.code !== -1) {
                    wx.setStorageSync('userInfo', res.result.data)
                    wx.switchTab({
                      url: '../order/index/index',
                    })
                  } else {
                    load.hideLoading();
                    wx.showToast({
                      title: res.result.msg,
                    })
                  }
                })
            }
          },
          fail: (res => {
            wx.showToast({
              title: '请重新操作',
              icon: 'none'
            })
          })
        })
      },
      fail: res => {
        wx.showToast({
          title: '请检查网络',
          icon: 'none'
        })     
       }
    })
  },



  _getGroupInfo(userId) {

    groupInfo(userId).then(res => {
      if (res.result.code == 0) {
  
       
        wx.setStorageSync('userInfo', res.result.data.userInfo); //缓存用户信息
        wx.setStorageSync('groupInfo', res.result.data.groupInfo); //缓存部门信息

        //跳转到首页
        wx.redirectTo({
          url: '../../pages/index/index',
        })
      }else{
        //失败
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        })
      }
    })
  },








})