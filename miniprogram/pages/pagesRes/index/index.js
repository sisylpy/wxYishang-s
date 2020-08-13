// pagesD/index/index.js

const app = getApp()
const globalData = getApp().globalData;



// import {
//   groupInfo
// } from '../../../lib/apiRestraunt'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    // grouplist: []
    oneName: "送货单 ",
    oneUrl: "../../images/goods.jpg",
    twoName: "订货群",
    twoUrl: "../../images/addGroup.jpg",
    threeName: "自采订货",
    threeUrl: "../../images/add.jpg",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      userId: options.userId,
      userId:1,
    })

    var now = new Date();
    var day = now.getDay();
    var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    var week = weeks[day];
    var date = now.getDate();
    this.setData({
      week: week,
      date: date,
    })

    this._getGroupInfo();

  
  },

  _getGroupInfo(){
    groupInfo(this.data.userId).then(res => {
      if(res) {
        console.log(res)
        var subDeps = res.result.data.groupInfo.nxDepartmentEntities;
        var usersAmount = 0;
        subDeps.forEach(sub => {
          var users = sub.nxDepartmentUserEntities.length;
          console.log(users)
          usersAmount = usersAmount + users;
        });
        this.setData({
          userInfo: res.result.data.userInfo,
          groupInfo: res.result.data.groupInfo,
          ordersArr: res.result.data.orders,
          memberAmount: usersAmount
          
        })
      }
      wx.setStorageSync('groupInfo', res.result.data)
    })
  },
  onShow:function() {
    //2，获取店内申请列表
  
    // this.getMyApplys(this.data.storeId);
  },

getMyApplys:function(store) {
  myApplys(store)
    .then(res => {
      if (res) {
        console.log(res);
        this.setData({
          applyArr: res.result.data
        })
      }
    })
},


  toOrderGroup(){
    wx.navigateTo({
      url: '../orderGroup/orderGroup?depId=' + this.data.groupInfo.nxDepartmentId,
    })
  },


})