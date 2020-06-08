// pagesCustomer/register/register.js

import { saveNewUser, jscode2session } from '../../lib/apiCustomer.js'
const globalData = getApp().globalData;
// var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sugData: [
      {
        name: "悦榕湾",
        nxCommunityId: '1' 
      },
      {
        name: "纳丹堡",
        nxCommunityId: '2'
      },
      {
        name: "福成五期",
        nxCommunityId: '3'
      },
      {
        name: "福成五期",
        nxCommunityId: '4'
      },
      {
        name: "福成五期",
        nxCommunityId: '5'
      },
      {
        name: "福成五期",
        nxCommunityId: '6'
      }
    ],
    showSug: false,
    canLogin: false,

    markers: [],
    latitude: '',
    longitude: '',
    rgcData: {},
    userInfo:{
      nxCustomerDisId: 1,
      nxCustomerCall: 1,
    }

    

  },



  onLoad:function(){
   
  },


  selectCommunity:function(e){
      this.setData({
        showSug: true,
      })
  },

  clickCommunity:function(e){
    var nxCustomerCommunityId = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    var updateId = "userInfo.nxCustomerCommunityId";
    var communityEntity = "userInfo.nxCommunityEntity";
    var entity = {
      nxCommunityId: nxCustomerCommunityId,
      nxCommunityName: name
    }
    this.setData({
      showSug: false,
      [updateId]: nxCustomerCommunityId,
      [communityEntity]: entity,
      community: name
    })

  },


  // 绑定详细地址输入 
  bindAddressInput: function (e) {
    var value = e.detail.value;
    var address = "userInfo.nxCustomerAddress";
    this.setData({
      [address]: value, 
    })
    this.ifCanLogin();


  },
  

  //输入名字
  bindNameInput: function(e){
    var value = e.detail.value;
    var name = "userInfo.nxCustomerName";
    this.setData({
      [name]: value,
    })
    this.ifCanLogin();

  },

  selectCall: function(e){
    var call = e.currentTarget.dataset.call;
    var cc = "userInfo.nxCustomerCall"
      this.setData({
        [cc] : call
      })
    this.ifCanLogin();

    
  },
  //输入phone
  bindPhoneInput: function (e) {
    var value = e.detail.value;
    var phone = "userInfo.nxCustomerPhone";
    this.setData({
      [phone]: value,
    })

    this.ifCanLogin();
  },

  //baocun
  updateMember: function(){

    var userInfo = this.data.userInfo;

    
    updateCustomer(this.data.userInfo).
    then(res => {
      console.log(res)
      if(res.result){
       wx.setStorageSync("userInfo", res.result.data); 
       wx.navigateBack({
         delta: 1
       })  
      }else {
        
      }
    })
  },

  //用户授权中链接socket
  getUserInfo: function (e) {

    //用户点击“确认”
    wx.getUserInfo({
      success: res => {
        wx.login({
          success: (res) => {
            var user = {
              nxCuWxNickName: e.detail.userInfo.nickName,
              nxCuWxAvatarUrl: e.detail.userInfo.avatarUrl,
              nxCuWxGender: e.detail.userInfo.gender,
            }
            var aaa = "userInfo.nxCustomerUserEntity"
            var code = res.code;
            var customerCode = "userInfo.code";
            this.setData({
              [aaa]: user,
              [customerCode]: code,
            })

            saveNewUser(this.data.userInfo)
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


        ///
    


      },
      fail: res => {
        console.log("quxiaole userinfo......")
        // 获取失败的去引导用户授权 
      }
    })

  },

  ifCanLogin(){
    var address = this.data.userInfo.nxCustomerAddress;
    var name = this.data.userInfo.nxCustomerName;
    var call = this.data.userInfo.nxCustomerCall;
    var phone = this.data.userInfo.nxCustomerPhone;
    if ( address && name && call && phone){
      this.setData({
        canLogin: true,
      })
    }
    

  },


  getDigitHeight: function(e){
    getApp().globalData.digitBoardHeight = e.detail.height;
    console.log(getApp().globalData) 

   
  }




})