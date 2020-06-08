// pagesCustomer/register/register.js

var bmap = require('../../lib/bmap-wx.min.js');
import { updateCustomer } from '../../lib/apiBusiness.js'
var wxMarkerData = [];

var BMap = new bmap.BMapWX({
  ak: 'mxgGUk1oDBQhF0lqDnv2XyCjTgOO6d2E'
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sugData: '',
    showSug: false,
    canLogin: false,

    markers: [],
    latitude: '',
    longitude: '',
    rgcData: {},

    

  },


  makertap: function (e) {
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // onLoad: function (options) {
  //   var that = this;
  //   // 新建百度地图对象 
   
  //   var fail = function (data) {
  //     console.log(data)
  //   };
  //   var success = function (data) {
  //     wxMarkerData = data.wxMarkerData;
  //     that.setData({
  //       markers: wxMarkerData
  //     });
  //     that.setData({
  //       latitude: wxMarkerData[0].latitude
  //     });
  //     that.setData({
  //       longitude: wxMarkerData[0].longitude
  //     });
  //   }
  //   // 发起regeocoding检索请求 
  //   BMap.regeocoding({
  //     fail: fail,
  //     success: success,
  //     iconPath: '../../img/marker_red.png',
  //     iconTapPath: '../../img/marker_red.png'
  //   });
   

  // },

  onLoad:function(){
    var userInfo = wx.getStorageSync("userInfo");
    if(userInfo) {
      this.setData({
        userInfo: userInfo
      })
    }

  },





  // 绑定input输入 
  bindAddressInput: function (e) {
    var value = e.detail.value;

    var address = "userInfo.customerAddress";

    this.setData({
      [address]: value, 

    })




    var that = this;
    // 新建百度地图对象 
    // var BMap = new bmap.BMapWX({
    //   ak: 'mxgGUk1oDBQhF0lqDnv2XyCjTgOO6d2E'
    // });
    var fail = function (data) {
      console.log(data)
    };
    
    var success = function (data) {
      console.log("0000000")
      console.log(data.result)
      if(data.result.length > 0) {
        that.setData({
          sugData: data.result,
          showSug: true,
        });
      }
      
     
    }
    // 发起suggestion检索请求 
    BMap.suggestion({
      query: e.detail.value,
      region: '三河',
      city_limit: true,
      fail: fail,
      success: success
    });




  },

//选择地址
  clickAddress: function(e){
    console.log(e)
    var index = e.currentTarget.dataset.index;
    var name = this.data.sugData[index].name;
    var aaa = this.data.sugData[index].location.lat;
    var bbb = this.data.sugData[index].location.lng;
   
    var address = "userInfo.customerAddress";
    var lat = "userInfo.customerLat";
    var lng = "userInfo.customerLng";
    console.log(aaa);
    var mm = "markers[0].address"

    this.setData({
      [address]: name, 
      [lat]: aaa,
      [lng]: bbb,
      showSug: false,
      [mm]: name,
    })
    this.ifCanLogin();

    

  },

//输入楼号
  bindBuildingInput: function(e){
    var value = e.detail.value;
    var building = "userInfo.customerBuilding";
    this.setData({
      [building]: value,
    })
    this.ifCanLogin();

  },

  //输入名字
  bindNameInput: function(e){
    var value = e.detail.value;
    var name = "userInfo.customerName";
    this.setData({
      [name]: value,
    })
    this.ifCanLogin();

  },

  selectCall: function(e){
    var call = e.currentTarget.dataset.call;
    var c = this.data.member.active;
    var cc = "userInfo.customerCall"
      this.setData({
        [cc] : call
      })
    this.ifCanLogin();

    
  },
  //输入phone
  bindPhoneInput: function (e) {
    var value = e.detail.value;
    var phone = "userInfo.customerPhone";
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
       var user = {
            cuWxNickName: e.detail.userInfo.nickName,
            cuWxAvatarUrl: e.detail.userInfo.avatarUrl,
            cuWxGender: e.detail.userInfo.gender,
          
        }

        var aaa = "member.userEntity"
        this.setData({
          [aaa]: user
        })

        saveNewUser(this.data.member)
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


      },
      fail: res => {
        console.log("quxiaole userinfo......")
        // 获取失败的去引导用户授权 
      }
    })


  },

  ifCanLogin(){
    /**
     *   
      customerAddress: '',
      customerLat: '',
      customerLng: '',
      customerBuilding: '',
      customerName: '',
      customerCall: 0,
      customerPhone: '',
      customerType: 2,
     */
    var address = this.data.userInfo.customerAddress;
    var lat = this.data.userInfo.customerLat;
    var lng = this.data.userInfo.customerLng;
    var building = this.data.userInfo.customerBuilding;
    var name = this.data.userInfo.customerName;
    var call = this.data.userInfo.customerCall;
    var phone = this.data.userInfo.customerPhone;
    console.log("haiahai")
    if(address && building && name && phone){
      console.log("have phone&&&&&&&&&&&&333")
      this.setData({
        canLogin: true,
      })
    }

    

  },







})