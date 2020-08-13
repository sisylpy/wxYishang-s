// pagesRes/orderGroup/orderGroup.js



// import {
//   defInfo
// } from '../../../lib/apiRestruant'

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
      // depId: options.depId,
      depId:1,

    })

    this._getDepInfo();

  },

  _getDepInfo(){
    defInfo(this.data.depId).then(res => {
      if(res) {
        console.log(res)
        this.setData({
          depInfo: res.result.data,
          subDepArr: res.result.data.nxDepartmentEntities
        })
      }
    })
  },
  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: 'aaa',
      path: '/pagesRes/depUserInfo/depUserInfo?depId=' + this.data.depId,
      success: function (res) {
        console.log("fenxiangchenggongn")
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          // console.log('=====')
          return false;
        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
            var encryptedData = res.encryptedData;
            var iv = res.iv;
            console.log("00000000");
            console.log(res);
            console.log(iv);
            console.log("111111");
          },
          complete:function(e){
            console.log(e);
            console.log("fanhuillellelelelel")
          }
        })
      },
      fail: function (res) {
        // 转发失败
        console.log("---");

      },
      complete:function(e){
        console.log(e);
        console.log("fanhuillellelelelel")
      }
      
    }

    console.log("---");

  },



})