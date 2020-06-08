
const globalData = getApp().globalData;
var member = {}
import {
  saveNewUser
} from '../../lib/apiBusiness.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerDisId: 1,
    show:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR
    })

  

  },





  //用户授权中链接socket
  getUserInfo: function(e) {
    //用户点击“确认”
    wx.getUserInfo({
      success: res => {
       

        wx.login({
          success: (res) => {

            member = {
              customerDisId: this.data.customerDisId,
              customerAddress: "美林湾小区",
              code: res.code,
              userEntity: {
                cuWxNickName: e.detail.userInfo.nickName,
                cuWxAvatarUrl: e.detail.userInfo.avatarUrl,
                cuWxGender: e.detail.userInfo.gender,
              }
            }
            saveNewUser(member)
              .then((res => {
                if (res.result) {
                  console.log(res.result.data);
                  wx.setStorageSync("userInfo", res.result.data);
                  wx.redirectTo({
                    url: '/pagesCustomer/index/index',
                  })

                } else {

                }
              }
              ))
          }
        })

       


      
      
      
      },
      fail: res => {
        console.log("quxiaole userinfo......")
        // 获取失败的去引导用户授权 
      }
    })


  },








})