// pagesRes/userInfo/userInfo.js

// import {saveUser} from "../../../lib/apiRestraunt"

const globalData = getApp().globalData;
// var socket = globalData.socket;



Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeId: 1,
    show: false,
    showMes: "工作人员将立即为注册，请稍后！",
  

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      id: options.socketId,
      disId: options.disId
    })

   var that = this
  },

  socketStart: function() {

    // 设置socket连接地址 socketUrl
    const socket = (this.socket = io(
      socketUrl,
    ))

    socket.on('connect', () => {

      var user = this.data.user;
  
     
      user.myId = socket.id;
      user.yourId = this.data.id;

      this.socket.emit('successRegister', user);

     
    })



    socket.on('enterIndex',function(){
      console.log("ok")
      wx.redirectTo({
        url: '/pagesRes/index/index',
      })
     
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

    socket.on('message', function(d) {
      this.setData({
        socketMessage: socketMessage += '服务器返回数据 → \n\n'
      })
      that.socketReceiveMessage(d)
    })

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





  //用户授权中链接socket
  getUserInfo: function(e) {

    //用户点击“确认”
    wx.getUserInfo({
      success: res => {
        wx.login({
          success: (res) => {
            var nxDepartmentUser = {
              nxDuWxNickName: e.detail.userInfo.nickName,
              nxDuWxAvartraUrl: e.detail.userInfo.avatarUrl,
              nxDuCode:res.code,
              nxDuAdmin: 1,
              nxDuDistributerId: this.data.disId,
            }
           
            saveUser(nxDepartmentUser)
              .then((res => {
                console.log(res);
                this.setData({
                  user: res.result.data
                })
                if (res.result.data) {

                  this.socketStart(res.result.data);
                  

                  // this.socket.on('commitSuccess', (data) => {
                  //   insertNewMember(member)
                  //     .then((res => {
                  //       if (res.result) {
                  //         console.log("result  shi  ge sha dognxi ?")
                  //         console.log(res.result)
                  //         wx.setStorageSync("userInfo", res.result.data);
                  //         this.setData({
                  //           show: false
                  //         })
    
                  //         wx.navigateTo({
                  //           url: '../member/member',
                  //         })
                  //         if (this.socket) {
                  //           console.log("guan")
                  //           this.socket.close();
                  //         }
                  //       } else {
    
                  //       }
                  //     }))
                  // })
                 
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

        // /////////



      

      },
      fail: res => {
        console.log("quxiaole userinfo......")
        // 获取失败的去引导用户授权 
      }
    })
  }



})