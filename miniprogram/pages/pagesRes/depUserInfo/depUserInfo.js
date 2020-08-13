// pages/restaurant/restaurant.js


const globalData = getApp().globalData;



// import {
//   defInfo, saveUser
// } from '../../../lib/apiRestraunt'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      second_height: globalData.windowHeight - globalData.windowWidth / 750 * 120 - (globalData.windowWidth / 750) * 94,
      userId: options.id,
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      depId: options.depId,
      showDepartment: false,
    })
    
    defInfo(this.data.depId).then(res => {
      if(res) {
        console.log(res)
        this.setData({
          depInfo: res.result.data,
          subDepArr: res.result.data.nxDepartmentEntities,
          selDepartmentName: res.result.data.nxDepartmentEntities[0].nxDepartmentName,
          nxDuDepartmentId: res.result.data.nxDepartmentEntities[0].nxDepartmentId,
        })
      }
    })


  },
  showDepartment(){
    this.setData({
      showDepartment:true,
    })

  },
  selDepartment(e){
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    console.log(id);
    this.setData({
      selDepartmentName: name,
      showDepartment: false,
      nxDuDepartmentId: id,
      
    })

  },


  //用户授权中链接socket
  getUserInfo: function(e) {

    //用户点击“确认”
    wx.getUserInfo({
      success: res => {


// /////////
        wx.login({
          success: (res) => {

             //显示mask
        // this.setData({
        //   show: true
        // })

            var nxDepartmentUser = {
              nxDuWxNickName: e.detail.userInfo.nickName,
              nxDuWxAvartraUrl: e.detail.userInfo.avatarUrl,
              nxDuCode:res.code,
              nxDuAdmin: 0 ,
              nxDuDepartmentId: this.data.nxDuDepartmentId
            }
            // this.setData({
            //   [aaa]: user,
            //   [customerCode]: code,
            // })

            saveUser(nxDepartmentUser)
              .then((res => {
                console.log(res.result.data)
                if (res.result.data) {
                  wx.reLaunch({
                    url: '../../pagesOrder/rIndex/rIndex?userId=' + res.result.data.nxDepartmentUserId,
                  })
                } else {
                  wx.showToast({
                    title: '请重新提交',
                  })
                }
              }
              ))
          },
          fail: (res =>{
            console.log(res)
          })
        })


      

      },
      fail: res => {
        console.log("quxiaole userinfo......")
        // 获取失败的去引导用户授权 
      }
    })
  }




  
   






})