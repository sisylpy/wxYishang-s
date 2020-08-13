// miniprogram/pages/order/ordersPage/paymentPage/paymentPage.js


var load = require('../../../lib/load.js');

const globalData = getApp().globalData;
var app = getApp()

var tsc = require("../../../utils/GPutils/encoding-indexes");
var esc = require("../../../utils/GPutils/esc.js");
// var encode = require("../../../utils/GPutils/encoding.js");


import { getToFillDepOrders, saveBill } from '../../../lib/apiDepOrder.js'

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function(bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    looptime: 0,
    currentTime: 1,
    lastData: 0,
    oneTimeData: 0,
    buffSize: [],
    buffIndex: 0, //发送字节数下标
    printNum: [],
    printNumIndex: 0,
    printerNum: 1,
    currentPrint: 1,
    isReceiptSend: false,
    isQuery: false,
    imageSrc: '../../imags/wechat.png',
    jpgSrc: '../../imags/flower2.jpg',
    canvasWidth: 100,
    canvasHeight: 100,
    jpgWidth: 200,
    jpgHeight: 200,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      "title": "送货单",
    }),
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#2d5a5f',
        animation: {
          duration: 200,
          timingFunc: 'easeIn'
        }
      })


    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      disId: 1,
      userId: 1
    })


    getToFillDepOrders(1)
      .then(res => {
        if (res) {
          console.log(res.result.data);
          this.setData({
            applyArr: res.result.data,
          })
        }
       
      })

  },


  getInputValue:function(e){
    console.log(e);
  
  
    if(e.detail.value > 0 ){
      if(e.currentTarget.dataset.type == 1){
        console.log(1)
        var index = e.currentTarget.dataset.index;
        var nxDoPrice = this.data.applyArr[index].nxDoPrice;
        var subtotal = Number(e.detail.value) * Number(nxDoPrice) ;
       
        var nxDoWeight = "applyArr[" + index + "].nxDoWeight";
        var nxDoSubtotal = "applyArr[" + index + "].nxDoSubtotal";
        this.setData({
          [nxDoWeight]: e.detail.value,
          [nxDoSubtotal]: subtotal.toFixed(1),
        })
        this._getTotal();
      }if(e.currentTarget.dataset.type == 2) {
        console.log(2)
        var index = e.currentTarget.dataset.index;
        // var nxDoPrice = this.data.applyArr[index].nxDoPrice;
        var nxDoWeight = this.data.applyArr[index].nxDoWeight;
        var subtotal = Number(e.detail.value) * Number(nxDoWeight) ;
       
        var nxDoPrice = "applyArr[" + index + "].nxDoPrice";
        var nxDoSubtotal = "applyArr[" + index + "].nxDoSubtotal";
        this.setData({
          [nxDoPrice]: e.detail.value,
          [nxDoSubtotal]: subtotal.toFixed(1),
        })
      }
       this._getTotal();
    }

  },
  _getTotal(){
    var arr = this.data.applyArr;
    var temp = 0;
    for(var i = 0; i < arr.length; i++){
      var subtotal = Number(arr[i].nxDoSubtotal);
      if(subtotal > 0){
           temp = temp + subtotal
      }
    }
    this.setData({
      total: temp
    })
  },

  _getSubmitOrder(){
    var arr = this.data.applyArr;
    var temp = [];
    for(var i = 0; i < arr.length; i++){
      var price = Number(arr[i].nxDoPrice);
      var weight = Number(arr[i].nxDoWeight);
      if(price > 0 && weight > 0){

        temp.push(arr[i]);
      }

    }
    return temp;

  },


  saveAndPrint:function(e){


    this.printPickData();

    // var arr = this._getSubmitOrder();

    // var bill = {
    //   nxDbDisId: this.data.disId,
    //   nxDbTotal: this.data.total,
    //   nxDepartmentOrdersEntities: arr,
    //   nxDbIssueUserId: this.data.userId,
    // }
    // saveBill(bill).then(res =>{
    //   if(res) {
    //     console.log(res)
    //   }
    // })
      
  },

//  DAYINJI


printPickData: function (e) {
 
  var that = this;
    var canvasWidth = that.data.canvasWidth
    var canvasHeight = that.data.canvasHeight
    var command = esc.jpPrinter.createNew()
    command.init() //初始化打印机
    command.setSelectJustification(1) //居中
    command.setCharacterSize(17); //设置倍高倍宽
    command.setText("票据测试");
    command.setPrint(); //打印并换行
    command.setCharacterSize(0); //设置正常大小
    command.setSelectJustification(0) //设置居左
    command.setText("打印对齐方式测试：")
    command.setPrint() //打印并换行
    command.setSelectJustification(0) //设置居左
    command.setText("居左")
    command.setPrint() //打印并换行
    command.setSelectJustification(1) //设置居中
    command.setText("居中")
    command.setPrint()
    command.setSelectJustification(2)
    command.setText("居右");
    command.setPrint()
    command.setSelectJustification(0)
    command.setText("同行打印位置测试：");
    command.setPrint()
    command.setText("居左");
    command.setAbsolutePrintPosition(168)
    command.setText("居中");
    command.setAbsolutePrintPosition(336)
    command.setText("居右");
    command.setPrint()
    command.init() //初始化打印机
    command.setPrint()
    command.setText("条码打印");
    command.setPrint()
  
    command.setPrint()
    command.setPrint()
    command.setPrint()
    command.setPrint()
    that.prepareSend(command.getData())//准备发送数据 
},


prepareSend: function(buff) { //准备发送，根据每次发送字节数来处理分包数量
  // console.log(buff)
  var that = this
  var time = that.data.oneTimeData
  var looptime = parseInt(buff.length / time);
  var lastData = parseInt(buff.length % time);
  console.log(looptime + "---" + lastData)
  that.setData({
    looptime: looptime + 1,
    lastData: lastData,
    currentTime: 1,
  })
  
  that.Send(buff)
},

Send: function(buff) { //分包发送
  var that = this
  var currentTime = that.data.currentTime
  var loopTime = that.data.looptime
  var lastData = that.data.lastData
  var onTimeData = that.data.oneTimeData
  var printNum = that.data.printerNum
  var currentPrint = that.data.currentPrint
  var buf
  var dataView
  if (currentTime < loopTime) {
    buf = new ArrayBuffer(onTimeData)
    dataView = new DataView(buf)
    for (var i = 0; i < onTimeData; ++i) {
      dataView.setUint8(i, buff[(currentTime - 1) * onTimeData + i])
    }
  } else {
    buf = new ArrayBuffer(lastData)
    dataView = new DataView(buf)
    for (var i = 0; i < lastData; ++i) {
      dataView.setUint8(i, buff[(currentTime - 1) * onTimeData + i])
    }
  }
  console.log("第" + currentTime + "次发送数据大小为：" + buf.byteLength)
  wx.writeBLECharacteristicValue({
    deviceId: app.BLEInformation.deviceId,
    serviceId: app.BLEInformation.writeServiceId,
    characteristicId: app.BLEInformation.writeCharaterId,
    value: buf,
    success: function(res) {
      
    },
    fail: function(e) {
      console.log(e)
    },
    complete: function() {
      currentTime++
      if (currentTime <= loopTime) {
        that.setData({
          currentTime: currentTime
        })
        that.Send(buff)
      } else {
        wx.showToast({
          title: '已打印第' + currentPrint + '张',
        })
        if (currentPrint == printNum) {
          that.setData({
            looptime: 0,
            lastData: 0,
            currentTime: 1,
            isReceiptSend: false,
            isLabelSend: false,
            currentPrint: 1
          })
        } else {
          currentPrint++
          that.setData({
            currentPrint: currentPrint,
            currentTime: 1,
          })
          that.Send(buff)
        }
      }
    }
  })
  
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var list = []
    var numList = []
    var j = 0
    for (var i = 20; i < 200; i += 10) {
      list[j] = i;
      j++
    }
    for (var i = 1; i < 10; i++) {
      numList[i - 1] = i
    }
    this.setData({
      buffSize: list,
      oneTimeData: list[0],
      printNum: numList,
      printerNum: numList[0]
    })
    // this.initPhoto();
  },

  buffBindChange: function(res) { //更改打印字节数
    var index = res.detail.value
    var time = this.data.buffSize[index]
    this.setData({
      buffIndex: index,
      oneTimeData: time
    })
  },
  printNumBindChange: function(res) { //更改打印份数
    var index = res.detail.value
    var num = this.data.printNum[index]
    this.setData({
      printNumIndex: index,
      printerNum: num
    })
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    //关闭蓝牙连接
    // wx.closeBLEConnection({
    //   deviceId: app.BLEInformation.deviceId,
    //   success: function(res) {
    //     console.log("关闭蓝牙成功")
    //   },
    // })
  },





})