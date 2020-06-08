// pages/memberInfo/memberInfo.js
// import {
//   memberSetBirthday,
//   getMemberByMemberId
// } from '../../lib/api-member.js';

const globalData = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    months: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12" ],
    days: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"],
    month: 1,
    day:1,
    value: [0, 0],
    showPicker: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var value = wx.getStorageSync("userInfo");
    if(value) {
      this.setData({
        userInfo: value
      })
      console.log(value)
      if(value.birthday){
        this.setData({
         birthdayEmpty: false,

        })


      }else{
        this.setData({
          birthdayEmpty: true,

        })
      }
    }

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR

    })

  },

  setMybirthday: function() {
   this.setData({
     showPicker: true
   })
  },

  //设置生日
  value: function (e) {
    const val = e.detail.value
    this.setData({
      month: this.data.months[val[0]],
      day: this.data.days[val[1]]
    })
  },


  setBirthday: function () {
    memberSetBirthday(this.data.userInfo.memberId, this.data.month, this.data.day)
    .then((res => {
     if(res) {
       if(res.result){
         console.log("ok")

         this._updateMemberByMemberId(this.data.userInfo.memberId);
         this.setData({
           showPicker: false,
           birthdayEmpty: false
         })

       }

     }else {

     }
    })
    )
  },

  _updateMemberByMemberId: function (memberId) {

    getMemberByMemberId(memberId)
      .then((res) => {
        if (res.result) {
          wx.setStorageSync("userInfo", res.result.data);
          this.setData({
            userInfo: res.result.data
          })
        } else {

        }
      })
  },

})