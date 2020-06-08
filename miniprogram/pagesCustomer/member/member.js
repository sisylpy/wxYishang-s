// pages/socket/socket.js

// import {
//   getMemberByMemberId,
//   memberSelectUsrSocketId
// } from '../../lib/api-member.js'
// import {
//   computeHolidaydays,
//   computeBirthdaydays
// } from '../../lib/computeMemDiscount.js'

const globalData = getApp().globalData;

var member = {}
var socketMessage = ''

// const io = require("../../utils/weapp.socket.io.js")
// // socket 连接地址
// var socketUrl = 'http://localhost:3000'
var socketUrl = 'https://grainservice.club'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    showMes: {
      typeOne: "今日您可享受九折的优惠，工作人员马上为您记录今日消费记录。",
      typeTwo: "节日快乐！您可享受八五折优惠，工作人员马上为您记录今日消费记录。",
      typeThree: "生日快乐！请在柜台领取今日您的生日礼物！"
    }
  },

  onShow: function () {
    member = wx.getStorageSync("userInfo");
    if (member) {
      this._updateMemberByMemberId(member.memberId);

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR
    })

    // //倒计时节日天数和生日天数
    // var holidays = computeHolidaydays();
    // var birthdays = computeBirthdaydays("07-04");
    // this.setData({
    //   holidayDays: holidays,
    //   birthdayDays: birthdays
    // })

    // var that = this
    // this.socketStart();

  },

  socketStart: function () {

    // 设置socket连接地址 socketUrl
    const socket = (this.socket = io(
      socketUrl,
    ))

    socket.on('connect', () => {
      this.setData({
        socketMessage: socketMessage += 'SOCKET连接成功 → \n\n'
      })

      // 此处修改为与server约定的数据、格式
      var sendMessage = '{"token":"v3jsoc8476shNFhxgqPAkkjt678","client":"发送内容"}'
      this.socketSendMessage(sendMessage);
    })

    socket.on('connect_error', d => {
      this.setData({
        socketMessage: socketMessage += 'SOCKET连接失败 → \n\n'
      })
    })

    socket.on('connect_timeout', d => {
      this.setData({
        socketMessage: socketMessage += 'SOCKET连接超时 → \n\n'
      })
    })

    socket.on('disconnect', reason => {
      this.setData({
        socketMessage: socketMessage += 'SOCKET连接断开 → \n\n'
      })
    })

    socket.on('reconnect', attemptNumber => {
      this.setData({
        socketMessage: socketMessage += 'SOCKET正在重连 → \n\n'
      })
    })

    socket.on('reconnect_failed', () => {
      this.setData({
        socketMessage: socketMessage += 'SOCKET重连失败 → \n\n'
      })
    })

    socket.on('reconnect_attempt', () => {
      this.setData({
        socketMessage: socketMessage += 'SOCKET正在重连 → \n\n'
      })
    })

    socket.on('error', err => {
      this.setData({
        socketMessage: socketMessage += 'SOCKET连接错误 → \n\n'
      })
    })

    socket.on('message', function (d) {
      this.setData({
        socketMessage: socketMessage += '服务器返回数据 → \n\n'
      })
      that.socketReceiveMessage(d)
    })

    this.memberWaiting();

     

  },

  /**
    * 断开socket
    */
  socketStop: function () {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  },

  /**
   * 发送消息
   */
  socketSendMessage: function (sendStr) {
    if (this.socket) {
      this.setData({ socketMessage: socketMessage += '向服务器发送数据 → ' + sendStr + '\n\n' })
      this.socket.emit('message', sendStr);
    }
  },

  /**
   * 接收消息
   */
  socketReceiveMessage: function (receivedStr) {
    this.setData({ socketMessage: socketMessage += '服务器返回数据 → ' + receivedStr + '\n\n' })
    this.socketStop();

  },





  //////////******* */
  memberBuying: function (e) {

    // 1,选择打折类型
    console.log(e);
    if (e.currentTarget.dataset.type == 1) {
      member['buyingType'] = 1;
      this.setData({
        discountType: 1
      })
    } else if (e.currentTarget.dataset.type == 2) {
      member['buyingType'] = 2;
      this.setData({
        discountType: 2
      })
    } else {
      member['buyingType'] = 3;
      this.setData({
        discountType: 3
      })
    }
      // 2.1 查询当时可发送消息的userSocketId
      memberSelectUsrSocketId(member)
        .then((res => {
          if (res.result) {
            member['userSocketId'] = res.result.data.socketid;
            console.log("new memberSelectUsrSocketId")
            console.log(member)
            member['memberSocketId'] = this.socket.id;
            this.socket.emit('memberBuying', member)
            this.setData({
              show: true,
            })
          


          } else {
          }
        }))


    
  },

  memberWaiting: function(e) {
    var that = this;
    this.socket.on('addFinished', function (data) {
      console.log("addFinshed socket !!!")
      console.log(data);
      console.log("memberListenAddFinished, addFinised received!")
      that.setData({
        show: false
      })

    that._updateMemberByMemberId(member.memberId);
    });
   
  },


  

  toMemberInfo: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '../memberInfo/memberInfo',
    })
  },

  showMyRecords: function () {
    wx.navigateTo({
      url: '../memberRecords/memberRecords?memberId=' + member.memberId,
    })
  },


  _updateMemberByMemberId: function (memberId) {

    getMemberByMemberId(memberId)
      .then((res) => {
        if (res.result) {
          wx.setStorageSync("userInfo", res.result.data);
          this.setData({
            member: res.result.data
          })
        } else {

        }
      })
  },

  _memberListenAddFinished() {
    console.log("mei daozheli lai ma????")
    var that = this;
    this.socket.on('addFinished', function (data) {
      console.log("addFinshed socket !!!")
      console.log(data);
      console.log("memberListenAddFinished, addFinised received!")
      that.setData({
        show: false
      })

      that._updateMemberByMemberId(value.memberId);
    });

  },


  getMemberGift: function (e) {
    console.log(e)
  },




})