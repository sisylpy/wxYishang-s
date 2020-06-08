
// import {
//   studentLogin,
//   studentIdLogin
// } from '../../lib/api-student.js'
// import {
//   teacherLogin
// } from '../../lib/api-teacher.js'

const globalData = getApp().globalData;
var load = require('../../lib/load.js');

Page({

  data: {
    loginFailure: 0,
    haveUserInfo: false
  },

  onLoad: function (options) {
    var value = wx.getStorageSync("studentInfo");
    if(value) {
      this.setData({
        studentInfo: value
      })
    }
    
  },
  






// 。。。。。。。。。。
  onShow: function(e) {
    var value = wx.getStorageSync("studentInfo");
    if (value) {
      this.setData({
        studentInfo: value
      })
    }
  },



  phone: function(e) {
    console.log(e)
    this.setData({
      phone: e.detail.value
    })
  },


//学生登录
  studentLogin: function() {
    load.showLoading("登录中")
    console.log(this.data.studentInfo)
    if(this.data.studentInfo) {
      var student = {
        studentId: this.data.studentInfo.studentId,
      }
      studentIdLogin(student)
      .then((res) => {
        if (typeof cb === 'function') {
          cb()
        }
        if (res.result) {
          load.hideLoading();
          if (res.result.Success) {
            wx.setStorageSync("studentInfo", res.result.Data);
            if (res.result.Data.hyStudiesForStudent.length > 0) {
              var hyStudy = res.result.Data.hyStudiesForStudent[0].hyStudy;
              wx.setStorageSync("hyStudy", hyStudy);
              this.setData({
                loginFailure: 0,
                phone: '',                
              })   
              wx.redirectTo({
                url: '../../pages/s/studentClassPage/studentClassPage',
              })
            }
          } if (res.result.code == 1) {
            this.setData({
              loginFailure: 1
            })
          } if (res.result.code == 2) {
            this.setData({
              loginFailure: 2
            })
          }
        } else {
          load.hideLoading();
        }
      })
    }else {
      var student = {
        phone: this.data.phone,
      }
      //登录
      studentLogin(student)
        .then((res) => {
          if (typeof cb === 'function') {
            cb()
          }
          if (res.result) {
            load.hideLoading();
            if (res.result.Success) {
              wx.setStorageSync("studentInfo", res.result.Data);
              if (res.result.Data.hyStudiesForStudent.length > 0) {
                var hyStudy = res.result.Data.hyStudiesForStudent[0].hyStudy;
                wx.setStorageSync("hyStudy", hyStudy);
                this.setData({
                  loginFailure: 0,
                  phone: '',     
                })
                wx.redirectTo({
                  url: '../../pages/s/studentClassPage/studentClassPage',
                })
              }
            } if (res.result.code == 1) {
              this.setData({
                loginFailure: 1
              })
            } if (res.result.code == 2) {
              this.setData({
                loginFailure: 2
              })
            }
          } else {
            load.hideLoading();
          }
        })
    }
  },

  //微信授权点击“允许”
  getUserInfo: function (e) {
    console.log(e);
    var nickName = e.detail.userInfo.nickName;
    var avatarUrl = e.detail.userInfo.avatarUrl;
      var teacher = {
        wxNickName: nickName,
        wxAvatarUrl: avatarUrl,
        status: 0 
      }
      //登录
    load.showLoading("老师登录中")
      teacherLogin(teacher)
        .then((res) => {
          wx.hideLoading()
          if (typeof cb === 'function') {
            cb()
          }
          if (res.result) {
            if(res.result.Success) {
              console.log(res.result)
              globalData.teacherInfo = res.result.Data;
              wx.setStorageSync("teacherInfo", res.result.Data)
              wx.redirectTo({
                url: '../t/tIndex/tIndex',
              })
            }else{
              wx.showModal({
                title: '登录失败',
                content: res.result.Message,
              })
            }
          } else {
            load.hideLoading();
          }
        })
  },


  

})