// pages/order/addPickFirstStep/addPickFirstStep.js

var load = require('../../../lib/load.js');
import {
  disGetUserByRole,

} from '../../../lib/apiOrders.js'

import {
  distributionWeighing, getPrintPickerData
} from '../../../lib/apiDepOrder'
const globalData = getApp().globalData;
var app = getApp()

var tsc = require("../../../utils/GPutils/encoding-indexes");
var esc = require("../../../utils/GPutils/esc.js");
var encode = require("../../../utils/GPutils/encoding.js");

import apiUrl from '../../../config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedStores: 0,
    arr: [],
    communityId: 1,
    pickUserId: '',

    // 

    sendContent: "shufjfjjfjfjf\n\n\n\n\n",
    looptime: 0,
    currentTime: 1,
    lastData: 0,
    oneTimeData: 0,
    returnResult: "",
    canvasWidth: 180,
    canvasHeight: 180,
    imageSrc: '../../imags/abc_ic_star_black_16dp.png',
    buffSize: [],
    buffIndex: 0,
    printNum: [],
    printNumIndex: 0,
    printerNum: 1,
    currentPrint: 1,
    isReceiptSend: false,
    isLabelSend: false,

    sendContent: "商品  订货     数量" ,
    abc: "黄瓜  3斤   "  



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    url: apiUrl.server,
      this.setData({
        url: apiUrl.server,
      })

    this._getWeighUserData();
    
    

    
  },

  _getWeighUserData: function () {
    load.showLoading("获取数据中")
    var data = {
      disId: 1,
      roleNumber: 3,
    }
    disGetUserByRole(data)
      .then(res => {
        if (res) {

          load.hideLoading();
          console.log(res.result.data)

          this.setData({
            pickUserArr: res.result.data
          })
        }
      })
  },

  receiptTest: function() { //票据测试

    var that = this;
    var canvasWidth = that.data.canvasWidth
    var canvasHeight = that.data.canvasHeight
    var command = esc.jpPrinter.createNew();
    command.init() 
    command.setSelectJustification(1) 
    command.setCharacterSize(17); 
    command.setText("拣货单");
    command.setPrint(); 
    command.setCharacterSize(0); 
    command.setSelectJustification(0) //设置居左
     var arr = this.data.depArr;
    for(var i =0 ; i < arr.length; i++){
      var depName = arr[i].nxDepartmentName;
    
      command.setText(depName);
      command.setPrint();
      command.setText("=================")
      command.setPrint();
      var subArr = arr[i].nxDepartmentEntities;
      for(var j = 0; j < subArr.length; j ++){
        var subName = subArr[j].nxDepartmentName;
        command.setText(subName);
        command.setPrint();

        var ordersArr = subArr[j].nxDepartmentOrdersEntities;
        for( var m = 0; m < ordersArr.length; m ++){
          var goodsName = ordersArr[m].nxGoodsEntity.nxGoodsName;
          var quantity = ordersArr[m].nxDoQuantity;
          var standard = ordersArr[m].nxDoStandard;
          command.setText(goodsName + "   " + quantity + " " + standard);
          command.setPrint();
        }

        
      }

    }
    // command.setText(this.data.sendContent );
    // command.setPrint() //打印并换行
    // command.setSelectJustification(0) //设置居左
    // command.setText(this.data.abc);
    // command.setPrint();
    
    command.setPrint()
    command.setPrint()
    command.setPrint()
    command.setPrint()
    that.prepareSend(command.getData())//准备发送数据
    
  },
  radioChange: function (e) {
    console.log(e);
    this.setData({
      pickUserId: e.detail.value,
    })

  },


  distributeWeigh: function () {

    this._getPrintData();



  },

  _savePickerOrders(){
console.log("save......")
    var userid = this.data.pickUserId;

      var data = {
        pickerUserId: userid,
        nxDepartmentEntities: this.data.depArr 
      };
    

      distributionWeighing(data)
      .then(res => {
        console.log(res)
        if(res.result.code == 0) {
          // wx.navigateBack({
          //   delta: 2
          // })

        }
      })
  },

  _getPrintData(){
    var dep = wx.getStorageSync('depArr');
    if(dep){
      this.setData({
        depArr: dep,
      })
     getPrintPickerData(dep).then(res => {
       if(res) {
         console.log(res.result)
         this.setData({
           depArr: res.result.data,
         })
             this.printBLEData();

       }
     }) 

    }
  },

  





  printBLEData: function (e) {
    var that = this
    // wx.stopBluetoothDevicesDiscovery({
    //   success: function (res) { console.log(res) },
    // })
    that.setData({
      serviceId: 0,
      writeCharacter: false,
      readCharacter: false,
      notifyCharacter: false
    })
    // console.log(e.currentTarget.dataset.title)
    wx.showLoading({
      title: '正在连接',
      
    })
    wx.createBLEConnection({
      deviceId: app.BLEInformation.deviceId,
      success: function (res) {
        console.log(res)
        // app.BLEInformation.deviceId = e.currentTarget.dataset.title

        that.getSeviceId()
      }, fail: function (e) {
        wx.showModal({
          title: '提示',
          content: '连接失败',
          showCancel: false
        })
        console.log(e)
        wx.hideLoading()
      }, complete: function (e) {
        console.log(e)
      }
    })
  },
  getSeviceId: function () {
    var that = this
    var platform = app.BLEInformation.platform
    console.log(app.BLEInformation.deviceId)
    wx.getBLEDeviceServices({
      deviceId: app.BLEInformation.deviceId,
      success: function (res) {
        that.setData({
          services: res.services
        })
        that.getCharacteristics()
      }, fail: function (e) {
        console.log(e)
      }, complete: function (e) {
        console.log(e)
      }
    })
  },
  getCharacteristics: function () {
    var that = this
    var list = that.data.services
    var num = that.data.serviceId
    var write = that.data.writeCharacter
    var read = that.data.readCharacter
    var notify = that.data.notifyCharacter
    wx.getBLEDeviceCharacteristics({
      deviceId: app.BLEInformation.deviceId,
      serviceId: list[num].uuid,
      success: function (res) {
        console.log(res)
        for (var i = 0; i < res.characteristics.length; ++i) {
          var properties = res.characteristics[i].properties
          var item = res.characteristics[i].uuid
          if (!notify) {
            if (properties.notify) {
              app.BLEInformation.notifyCharaterId = item
              app.BLEInformation.notifyServiceId = list[num].uuid
              notify = true
            }
          }
          if (!write) {
            if (properties.write) {
              app.BLEInformation.writeCharaterId = item
              app.BLEInformation.writeServiceId = list[num].uuid
              write = true
            }
          }
          if (!read) {
            if (properties.read) {
              app.BLEInformation.readCharaterId = item
              app.BLEInformation.readServiceId = list[num].uuid
              read = true
            }
          }
        }
        if (!write || !notify || !read) {
          num++
          that.setData({
            writeCharacter: write,
            readCharacter: read,
            notifyCharacter: notify,
            serviceId: num
          })
          if (num == list.length) {
            wx.showModal({
              title: '提示',
              content: '找不到该读写的特征值',
              showCancel: false
            })
          } else {
            that.getCharacteristics()
          }
        } else {
          wx.showToast({
            title: '连接成功',
          })

          that.receiptTest();
          // that.openControl()
        }
      }, fail: function (e) {
        console.log(e)
      }, complete: function (e) {
        console.log("write:" + app.BLEInformation.writeCharaterId)
        console.log("read:" + app.BLEInformation.readCharaterId)
        console.log("notify:" + app.BLEInformation.notifyCharaterId)
      }
    })
  },
  //  openControl: function () {//连接成功返回主页
  //   wx.navigateTo({
  //     url: '../home/home',
  //   })
  // },


  printPhoto:function(){//打印bitmap，图片内容不建议太大，小程序限制传输的字节数为20byte
    var that = this;
    var canvasWidth = that.data.canvasWidth
    var canvasHeight = that.data.canvasHeight
    var command = esc.jpPrinter.createNew()
    command.init() //初始化打印机
    wx.canvasGetImageData({
      canvasId: 'canvasOut',
      x: 0,
      y: 0,
      width: canvasWidth,
      height: canvasHeight,
      success: function (res) {
        console.log("获取画布数据成功")
        command.setBitmap(res)
        command.setPrint()
        that.prepareSend(command.getData())//发送数据
      },
      complete: function (res) {
        console.log("finish")
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: '获取画布数据失败',
          icon: 'none',
        })
      }
    })
  }, 
  printJPGPhoto:function(){
    var that = this;
    var canvasWidth = that.data.jpgWidth
    var canvasHeight = that.data.jpgHeight

    //抖动处理JPG图片
    const cfg = {
      x: 0,
      y: 0,
      width: canvasWidth,
      height: canvasHeight,
    }
    wx.canvasGetImageData({
      canvasId: 'canvasJPG',
      ...cfg,
      success: (res) => {
        //const data = convertToGrayscale(res.data)
        const data = convertToMonoImage(res.width, res.height, res.data, true);
        wx.canvasPutImageData({
          canvasId: 'canvasJPG',
          data,
          ...cfg,
          success: (res) => {
            console.log(res)
            console.log('deal graphic width: ' + cfg.width)
            console.log('deal graphic width: ' + cfg.height)
            that.printerJPG();
          },
          fail: (err) => {
            console.error(err)
          }
        })
      },
      fail: (err) => {
        console.error(err)
      }
    })
  },
  printerJPG: function(){
    var that=this;
    var canvasWidth = that.data.jpgWidth
    var canvasHeight = that.data.jpgHeight
    var command = esc.jpPrinter.createNew()
    command.init() //初始化打印机
    wx.canvasGetImageData({
      canvasId: 'canvasJPG',
      x: 0,
      y: 0,
      width: canvasWidth,
      height: canvasHeight,
      success: function (res) {
        console.log("获取画布数据成功")
        command.setBitmap(res)
        command.setPrint()
        that.prepareSend(command.getData())//发送数据
      },
      complete: function (res) {
        console.log("finish")
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: '获取画布数据失败',
          icon: 'none',
        })
      }
    })
  },
  prepareSend: function(buff) { //准备发送，根据每次发送字节数来处理分包数量
    //console.log(buff)
    var that = this
    var time = that.data.oneTimeData
    var looptime = parseInt(buff.length / time);
    var lastData = parseInt(buff.length % time);
    //console.log(looptime + "---" + lastData)
    that.setData({
      looptime: looptime + 1,
      lastData: lastData,
      currentTime: 1,
    })
    that.Send(buff)
  },
  queryStatus: function() { //查询打印机状态
    var that = this
    var buf;
    var dateView;
    /*
    n = 1：传送打印机状态
    n = 2：传送脱机状态
    n = 3：传送错误状态
    n = 4：传送纸传感器状态
    */
    buf = new ArrayBuffer(3)
    dateView = new DataView(buf)
    dateView.setUint8(0, 16)
    dateView.setUint8(1, 4)
    dateView.setUint8(2, 2)
    wx.writeBLECharacteristicValue({
      deviceId: app.BLEInformation.deviceId,
      serviceId: app.BLEInformation.writeServiceId,
      characteristicId: app.BLEInformation.writeCharaterId,
      value: buf,
      success: function(res) {
        console.log("发送成功")
        that.setData({
          isQuery: true
        })
      },
      fail: function(e) {
        wx.showToast({
          title: '发送失败',
          icon: 'none',
        })
        //console.log(e)
        return;
      },
      complete: function() {

      }
    })

    wx.notifyBLECharacteristicValueChange({
      deviceId: app.BLEInformation.deviceId,
      serviceId: app.BLEInformation.notifyServiceId,
      characteristicId: app.BLEInformation.notifyCharaterId,
      state: true,
      success: function(res) {
        wx.onBLECharacteristicValueChange(function(r) {
          console.log(`characteristic ${r.characteristicId} has changed, now is ${r}`)
          var result = ab2hex(r.value)
          console.log("返回" + result)
          var tip = ''
          if (result == 12) { //正常
            tip = "正常"
          } else if (result == 32) { //缺纸
            tip = "缺纸"
          } else if (result == 36) { //开盖、缺纸
            tip = "开盖、缺纸"
          } else if (result == 16) {
            tip = "开盖"
          } else if (result == 40) { //其他错误
            tip = "其他错误"
          } else { //未处理错误
            tip = "未知错误"
          }
          wx.showModal({
            title: '打印机状态',
            content: tip,
            showCancel: false
          })

        })
      },
      fail: function(e) {
        wx.showModal({
          title: '打印机状态',
          content: '获取失败',
          showCancel: false
        })
        console.log(e)
      },
      complete: function(e) {
        that.setData({
          isQuery: false
        })
        console.log("执行完成")
      }
    })
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
    //console.log("第" + currentTime + "次发送数据大小为：" + buf.byteLength)
    wx.writeBLECharacteristicValue({
      deviceId: app.BLEInformation.deviceId,
      serviceId: app.BLEInformation.writeServiceId,
      characteristicId: app.BLEInformation.writeCharaterId,
      value: buf,
      success: function(res) {
        if (currentTime <= loopTime) {
          // wx.showLoading({
          //   title: '传输中...',
          // })
        } else {
          wx.showToast({
            title: '已打印第' + currentPrint + '张成功',
          })
        }
        //console.log(res)
        that._savePickerOrders();

      },
      fail: function(e) {
        wx.showToast({
          title: '打印第' + currentPrint + '张失败',
          icon: 'none',
        })
        //console.log(e)
      },
      complete: function() {
        currentTime++
        if (currentTime <= loopTime) {
          that.setData({
            currentTime: currentTime
          })
          that.Send(buff)
        } else {
          if (currentPrint == printNum) {
            that.setData({
              looptime: 0,
              lastData: 0,
              currentTime: 1,
              isReceiptSend: false,
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
        wx.navigateBack({
          complete: (res) => {
            delta: 2
          },
        })
      }
    })
  },
/**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    关闭蓝牙连接
    wx.closeBLEConnection({
      deviceId: app.BLEInformation.deviceId,
      success: function(res) {
        console.log("关闭蓝牙成功")
      },
    })
  },




})