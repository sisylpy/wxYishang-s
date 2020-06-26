

import {disAndUserSave, } from '../../lib/apiBasic'

const globalData = getApp().globalData;
var load = require('../../lib/load.js');

Page({

  data: {
   
  },

  onLoad: function (options) {
   this.setData({
    windowWidth: globalData.windowWidth * globalData.rpxR,
    windowHeight: globalData.windowHeight * globalData.rpxR,
   })
    
  },
  






  getName: function(e) {
    console.log(e)
    this.setData({
      name: e.detail.value
    })
  },



  //微信授权点击“允许”
  getUserInfo: function (e) {
    console.log(e);
    var nickName = e.detail.userInfo.nickName;
    var avatarUrl = e.detail.userInfo.avatarUrl;
      var dep = 
      {
        nxDistributerName: this.data.name,
        nxDistributerUserEntity:  {
          nxDiuWxNickName: nickName,
          nxDiuWxAvartraUrl: avatarUrl,
          roleEntities: [
            {
              nxDurRoleId: 0
            }
          ]
        }
        
      }
     
      //登录
    load.showLoading("用户登录中")
    disAndUserSave(dep)
        .then((res) => {
          wx.hideLoading()
          if (typeof cb === 'function') {
            cb()
          }
          if (res.result) {
            wx.setStorageSync("disInfo", res.result.data)
            wx.redirectTo({
              url: '../index/index',
            })
            
          } else {
            wx.showModal({
              title: '登录失败',
            })
            load.hideLoading();
          }
        })
  },


  

})