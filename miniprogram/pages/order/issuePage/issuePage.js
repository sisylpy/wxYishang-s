// miniprogram/pages/order/ordersPage/paymentPage/paymentPage.js


var load = require('../../../lib/load.js');

const globalData = getApp().globalData;
var app = getApp()

var tsc = require("../../../utils/GPutils/encoding-indexes");
var esc = require("../../../utils/GPutils/esc.js");
// var encode = require("../../../utils/GPutils/encoding.js");

var dateUtils = require('../../../utils/dateUtil');


import {
  getToFillDepOrders,
  printDepartmentOrders
} from '../../../lib/apiDepOrder'

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
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
      // oneTimeData: 0,
      returnResult: "",

      // buffSize: [],
      buffIndex: 0,
      // printNum: [],
      printNumIndex: 0,
      // printerNum: 1,
      currentPrint: 1,
      isReceiptSend: false,
      isLabelSend: false,
  },

  onShow: function () {
    var deviceId = app.BLEInformation.deviceId
    if (deviceId !== null) {
      this.setData({
        setSuccess: true
      })
    } else {
      this.setData({
        setSuccess: false
      })
    }
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

    // 
    var todayDate = dateUtils.formatDate(new Date());

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
      todayDate: todayDate,
      disId: options.disId,
      userId: options.userId,
      depFatherId: options.depFatherId,
      depHasSubs: options.depHasSubs,
      depName: options.depName
      
    })

   

    var data = {
      disId: this.data.disId,
      depFatherId: this.data.depFatherId,
    }

    getToFillDepOrders(data)
      .then(res => {
        if (res) {
          console.log(res.result.data);
          var arr = res.result.data;
          var total = 0;
          var finished = 0;

          if (this.data.depHasSubs == 0) {
            for (var i = 0; i < arr.length; i++) {
              var subtotal = Number(arr[i].nxDoSubtotal);
              if (subtotal > 0 && subtotal !== null) {
                total = (total + subtotal);
                finished = finished + 1;
              }
            }
            this.setData({
              applyArr: res.result.data,
              total: total.toFixed(1),
              finished: finished,
            })
          }
          if (this.data.depHasSubs == 1) {
            var totalAmount = 0;

            for (var i = 0; i < arr.length; i++) {

              for (var j = 0; j < arr[i].depOrders.length; j++) {
                totalAmount = totalAmount + 1;

                var subtotal = Number(arr[i].depOrders[j].nxDoSubtotal);
                if (subtotal > 0 && subtotal !== null) {
                  total = (total + subtotal);
                  finished = finished + 1;
                }
              }
            }

            this.setData({
              depArr: res.result.data,
              total: total.toFixed(1),
              finished: finished,
              totalAmount: totalAmount
            })
          }


        }

      })

  },






  toSetPrint() {
    wx.navigateTo({
      url: '../pSearchPrinter/pSearchPrinter',
    })
  },


  // ///================================




  printBLEData: function (e) {
    var that = this
   
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
      },
      fail: function (e) {
        wx.showModal({
          title: '提示',
          content: '连接失败',
          showCancel: false
        })
        console.log(e)
        wx.hideLoading()
      },
      complete: function (e) {
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
      },
      fail: function (e) {
        console.log(e)
      },
      complete: function (e) {
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
      },
      fail: function (e) {
        console.log(e)
      },
      complete: function (e) {
        console.log("write:" + app.BLEInformation.writeCharaterId)
        console.log("read:" + app.BLEInformation.readCharaterId)
        console.log("notify:" + app.BLEInformation.notifyCharaterId)
      }
    })
  },

  receiptTest: function () { //票据测试

    var that = this;

    var command = esc.jpPrinter.createNew();
    command.init()
    command.setSelectJustification(1)
    command.setCharacterSize(17);
    command.setText("销售单");
    command.setPrint();
    command.setPrint();
    command.setPrint();
    command.setSelectJustification(0) //设置居左   
    command.setCharacterSize(0);
    command.setText("日期: " + that.data.todayDate);
    command.setPrint();  
    command.setText("客户: " + that.data.depName);
    command.setPrint();
    command.setPrint();
    command.setText("商品")
    command.setAbsolutePrintPosition(168)
    command.setText("数量")
    command.setAbsolutePrintPosition(242)
    command.setText("单价")
    command.setAbsolutePrintPosition(310)
    command.setText("小计")
    command.setPrint();
    command.setText("--------------------------------")
    command.setPrint();
    if (that.data.depHasSubs == 0) {
      var ordersArr = that.data.applyArr;
      for (var i = 0; i < ordersArr.length; i++) {
        var goodsName = ordersArr[i].nxDistributerGoodsEntity.nxDgGoodsName;
        var weight = "";
        if(ordersArr[i].nxDoWeight !== null){
          weight = ordersArr[i].nxDoWeight;
        }else{
          weight = ""
        }
        var price = "";
        if(ordersArr[i].nxDoPrice !== null){
          price = ordersArr[i].nxDoPrice;
        }else{
          price = ""
        }
        var subTotal = "";
        if(ordersArr[i].nxDoSubtotal !== null){
          subTotal = ordersArr[i].nxDoSubtotal;
        }else{
          subTotal = ""
        }
        command.setText(goodsName);
        command.setAbsolutePrintPosition(168)
        command.setText(weight);
        command.setAbsolutePrintPosition(242);
        command.setText(price);
        command.setAbsolutePrintPosition(310) // 318
        command.setText(subTotal);
        command.setPrint();
      } 
    }

    if (that.data.depHasSubs == 1) {
      var arr = that.data.depArr;
      var temp = [];
      for (var i = 0; i < arr.length; i++) {
        var subName = arr[i].depName;
        command.setText("部门:#" + subName);
        command.setPrint();
        var ordersArr = arr[i].depOrders;
        for (var j = 0; j < ordersArr.length; j++) {
          //获取接口订单
          temp.push(ordersArr[j])
          //获取打印数据
          var goodsName = ordersArr[j].nxDistributerGoodsEntity.nxDgGoodsName;
          var weight = "";
        if(ordersArr[j].nxDoWeight !== null){
          weight = ordersArr[j].nxDoWeight;
        }else{
          weight = ""
        }
        var price = "";
        if(ordersArr[j].nxDoPrice !== null){
          price = ordersArr[j].nxDoPrice;
        }else{
          price = ""
        }
        var subTotal = "";
        if(ordersArr[j].nxDoSubtotal !== null){
          subTotal = ordersArr[j].nxDoSubtotal;
        }else{
          subTotal = ""
        }
          command.setText(goodsName);
          command.setAbsolutePrintPosition(168)
          command.setText(weight);
          command.setAbsolutePrintPosition(242);
          command.setText(price);
          command.setAbsolutePrintPosition(310)
          command.setText(subTotal);
          command.setPrint();
        } 
      }
      //接口数据
      that.setData({
        printOrderArr: temp,
      })
    }

    // command.setText(this.data.sendContent);
    command.setPrint() //打印并换行     
    command.setText("-------------------------------")
    command.setPrint();
    command.setSelectJustification(2)
    command.setText(that.data.total + "元");
    command.setPrint();
    command.setPrint();
    command.setPrint();
    command.setPrint();
    command.setPrint();
    command.setPrint();
    command.setPrint();

    that.prepareSend(command.getData()) //准备发送数据

  },


  prepareSend: function (buff) { //准备发送，根据每次发送字节数来处理分包数量
   
    var that = this
    var time = that.data.oneTimeData;
   

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

  queryStatus: function () { //查询打印机状态
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
      success: function (res) {
        console.log("发送成功")
        that.setData({
          isQuery: true
        })
      },
      fail: function (e) {
        wx.showToast({
          title: '发送失败',
          icon: 'none',
        })
        console.log(e)
        return;
      },
      complete: function () {

      }
    })

    wx.notifyBLECharacteristicValueChange({
      deviceId: app.BLEInformation.deviceId,
      serviceId: app.BLEInformation.notifyServiceId,
      characteristicId: app.BLEInformation.notifyCharaterId,
      state: true,
      success: function (res) {
        wx.onBLECharacteristicValueChange(function (r) {
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
      fail: function (e) {
        wx.showModal({
          title: '打印机状态',
          content: '获取失败',
          showCancel: false
        })
        console.log(e)
      },
      complete: function (e) {
        that.setData({
          isQuery: false
        })
        console.log("执行完成")
      }
    })
  },


  Send: function (buff) { //分包发送
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
      success: function (res) {
        if (currentTime == loopTime) {
          that._savePrintOrders();
        } 
      },
      fail: function (e) {
        wx.showToast({
          title: '打印第' + currentPrint + '张失败',
          icon: 'none',
        })
        // console.log(e)
      },
      complete: function () {
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
      }
    })

  },


  _savePrintOrders() {

    console.log("save.......................")
   var orderArr =  [];
    if(this.data.depHasSubs == 1){
      orderArr = this.data.printOrderArr;
      // var depArr = this.data.depArr;
      // for(var i = 0; i < depArr.length; i++){
      //   var arr = depArr[i].depOrders;

      //   for(var j = 0; j < arr.length; j++){
      //     var item  = arr[j];
      //     orderArr.push(item);
      //   }
      // }
    }else{
      orderArr = this.data.applyArr;
    }


    load.showLoading("保存订单中")
    var bill = {
      nxDbDisId: this.data.disId,
      nxDbDepId: this.data.depFatherId,
      nxDbTotal: this.data.total,
      nxDbIssueUserId: this.data.userId,
      nxDepartmentOrdersEntities: orderArr,

    }

    printDepartmentOrders(bill)
      .then(res => {
        load.hideLoading();
        console.log(res)
        if (res.result.code == 0) {
          wx.showToast({
            title: '打印成功',
          })
          // this._getTodayCustomer();
          // wx.navigateBack({
          //   delta: 2
          // })

        }
      })
  },

  // ============================================

  onHide(){
    wx.closeBLEConnection({
      deviceId: app.BLEInformation.deviceId,
      success: function (res) {
        console.log("关闭蓝牙成功")
      },
    })
  },
  





})