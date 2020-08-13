// pages/restaurant/restaurant.js


const QRCode = require('../../../lib/weapp-qrcode.js')
import rpx2px from '../../../lib/rpx2px.js'
let qrcode;
// 300rpx 在6s上为 150px
const qrcodeWidth = rpx2px(300);
const qrcodeHeight = rpx2px(400);
const globalData = getApp().globalData;


// const io = require('../../utils/weapp.socket.io.js')
// const io = require("../../../utils/weapp.socket.io.js")
// // socket 连接地址
// var socketUrl = 'http://localhost:3000'
// var socketUrl = 'https://grainservice.club'
var socketMessage = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
    onReady() {
      // const query = wx.createSelectorQuery()
      // query.select('#myCanvas')
      //   .fields({ node: true, size: true })
      //   .exec((res) => {
      //     const canvas = res[0].node
      //     const ctx = canvas.getContext('2d')
  
      //     const dpr = wx.getSystemInfoSync().pixelRatio
      //     canvas.width = res[0].width * dpr
      //     canvas.height = res[0].height * dpr
      //     ctx.scale(dpr, dpr)
  
      //     ctx.fillRect(0, 0, 100, 100)
      //   })
    } ,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var value = wx.getStorageSync('disInfo');
    if(value) {
      this.setData({
        disInfo: value,
        disId: value.nxDistributerEntity.nxDistributerId,
        disName: value.nxDistributerEntity.nxDistributerName
      })
    } 
   

  // var that = this
  // this.socketStart();

  qrcode = new QRCode('myQrcode', {
    // usingIn: this,
    text: "http://localhost:8080/nxl_war_exploded/addRestraunt?disId=" + this.data.disId ,
    // image: '/images/1.jpg',
    width: qrcodeWidth,
    height: qrcodeHeight,
    colorDark: "black",
    colorLight: "white",
    correctLevel: QRCode.CorrectLevel.H,
});


  },



  socketStart: function() {

    // 设置socket连接地址 socketUrl
    const socket = (this.socket = io(
      socketUrl,
    ))

    socket.on('connect', () => {
      this.setData({
        socketMessage: socketMessage += 'SOCKET连接成功 → \n\n'
      })

      // 此处修改为与server约定的数据、格式
      var sendMessage = '{"token":"v3jsoc8476shNFhxgqPAkkjt678","client":}'
      this.socketSendMessage(this.socket.id);

     

    socket.on('beginBusiness', function(d) {
      console.log(d)
      console.log(d.yourId)
      console.log("begingkgngi2344")
      wx.navigateTo({
        url: '../stepOne/stepOne?id=' + d.nxDepartmentUserId,
      })

      getApp().globalData.socket = socket;
      console.log(getApp().globalData.socket) 
      var ids = {
        disId: socket.id,
        resId: d.myId
      }
      wx.setStorageSync('socketIds', ids)
  


    
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

    //
    

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
      this.socket.emit('myId', sendStr);
    }
  },

  /**
   * 接收消息
   */
  socketReceiveMessage: function (receivedStr) {
    this.setData({ socketMessage: socketMessage += '服务器返回数据 → ' + receivedStr + '\n\n' })
    this.socketStop();
  },

  
   






})