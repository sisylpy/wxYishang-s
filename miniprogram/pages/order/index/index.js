// pages/order/order.js

const globalData = getApp().globalData;
var app = getApp()
var load = require('../../../lib/load.js');
var esc = require("../../../utils/GPutils/esc.js");

import apiUrl from '../../../config.js'

import {
  disGetTodayOrderCustomer,
  distributionWeighing,
} from '../../../lib/apiDepOrder.js'


Component({
  pageLifetimes: {

    show() {

      //tabBar
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }

      //login页面存储的信息
      var value = wx.getStorageSync('userInfo');
      if (value) {
        this.setData({
          disId: value.nxDistributerEntity.nxDistributerId,
          userInfo: value,
        })

        wx.setNavigationBarTitle({
          "title": value.nxDistributerEntity.nxDistributerName,
        })

        this._getTodayCustomer();
      }



      // 1, 拣货单打印状态检查
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

      // 2，打印初始化参数
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
        printerNum: numList[0],
        looptime: 0,
        currentTime: 1,
        lastData: 0,
        returnResult: "",
        buffIndex: 0,
        printNumIndex: 0,
        currentPrint: 1,
        isReceiptSend: false,
        isLabelSend: false,

        printTimes: 0,

      })


      var now = new Date();
      var day = now.getDay();
      var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
      var week = weeks[day];
      var date = now.getDate();

      this.setData({
        week: week,
        date: date,
        windowWidth: globalData.windowWidth * globalData.rpxR,
        windowHeight: globalData.windowHeight * globalData.rpxR,
        url: apiUrl.server,
        showOperation: false,
      })

    },

    /**
     * 关闭页面
     */
    hide() {
      wx.closeBLEConnection({
        deviceId: app.BLEInformation.deviceId,
        success: function (res) {
          console.log("关闭蓝牙成功")
        },
      })
    },

  },

  methods: {

    /**
     * 获取客户订单
     */
    _getTodayCustomer() {
      load.showLoading("获取今天订单中")
      disGetTodayOrderCustomer(this.data.disId).then(res => {
        if (res.result.code == 0) {
          load.hideLoading();
          console.log(res.result.data);
          this.setData({
            customerArr: res.result.data,
          })
          //创建节点选择器
          var that = this;
          var query = wx.createSelectorQuery();
          //选择id
          query.select('#mjltest').boundingClientRect()
          query.exec(function (res) {
            //res就是 所有标签为mjltest的元素的信息 的数组
            console.log(res);
            //取高度
            console.log(res[0].height);
            that.setData({
              maskHeight: res[0].height
            })
          })
        } else {
          load.hideLoading();
          wx.showToast({
            title: '获取订单失败',
          })
        }
      })

    },


    openOperation(e) {
      this.setData({
        showOperation: true,
        customerIndex: e.currentTarget.dataset.index,
        depHasSubs: e.currentTarget.dataset.has,
        depFatherId: e.currentTarget.dataset.id,
        depName: e.currentTarget.dataset.name,
      })
    },

    toOpenMyCustomer() {
      wx.navigateTo({
        url: '../customerList/customerList?disId=' + this.data.disId,
      })
    },

    toInputWeight() {
      wx.navigateTo({
        url: '../writeWeight/writeWeight?id=' + this.data.depFatherId +
          '&depHasSubs=' + this.data.depHasSubs,
      })
    },
    toInputPrice() {
      wx.navigateTo({
        url: '../writePrice/writePrice?id=' + this.data.depFatherId + '&depHasSubs=' + this.data.depHasSubs,
      })
    },

    toSetPrint() {
      wx.navigateTo({
        url: '../pSearchPrinter/pSearchPrinter',
      })
    },

    hideMask() {
      this.setData({
        showOperation: false,
      })
    },

    toIssuePage() {
      wx.navigateTo({

        url: '../issuePage/issuePage?depFatherId=' + this.data.depFatherId + '&depHasSubs=' + this.data.depHasSubs + '&depName=' + this.data.depName + '&disId=' + this.data.userInfo.nxDistributerEntity.nxDistributerId + '&userId=' + this.data.userInfo.nxDiuDistributerId,
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

      var printTimes = that.data.printTimes;

      if (printTimes > 0) {
        that.getSeviceId();
      } else {
        wx.showLoading({
          title: '正在连接',
        })

        wx.createBLEConnection({
          deviceId: app.BLEInformation.deviceId,
          success: function (res) {
            that.getSeviceId()
          },
          fail: function (e) {
            wx.showModal({
              title: '提示',
              content: '连接失败',
              showCancel: false
            })
            // console.log(e)
            wx.hideLoading()
          },
          complete: function (e) {
            console.log(e)
          }
        })

      }

    },

    getSeviceId: function () {
      var that = this
      // console.log("app.BLEInformation.deviceId")
      // console.log(app.BLEInformation.deviceId)
      wx.getBLEDeviceServices({
        deviceId: app.BLEInformation.deviceId,
        success: function (res) {
          that.setData({
            services: res.services
          })
          that.getCharacteristics()
        },
        fail: function (e) {
          // console.log(e)
        },
        complete: function (e) {
          // console.log(e)
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
          // console.log(res)
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

      command.setSelectJustification(1) //居中
      command.setCharacterSize(17); //设置倍高倍宽
      command.setText("拣货单");
      command.setPrint(); //打印并换行
      command.setSelectJustification(0) //设置居左 
      command.setCharacterSize(0);
      command.setText("日期: " + that.data.date + "日  " + that.data.week );
      command.setPrint(); //打印并换行

      var customer = that.data.customerArr[that.data.customerIndex];
      var depName = customer.depName;
      command.setText("客户: " + depName);
      command.setPrint();
      command.setSelectJustification(0) //设置居左
      command.setText("商品")
      command.setAbsolutePrintPosition(168)
      command.setText("订货")
      command.setAbsolutePrintPosition(242)
      command.setText("数量")
      command.setAbsolutePrintPosition(310)
      command.setPrint();
      command.setText("-------------------------------")
      command.setPrint();
      if (that.data.depHasSubs == 0) {
        var ordersArr = that.data.customerArr[that.data.customerIndex].depOrders;
        for (var i = 0; i < ordersArr.length; i++) {
          var goodsName = ordersArr[i].nxDistributerGoodsEntity.nxDgGoodsName;
          var quantity = ordersArr[i].nxDoQuantity;
          var standard = ordersArr[i].nxDoStandard;
          command.setCharacterSize(1);
          command.setText(goodsName + "  ");
          command.setText(quantity  + standard);          
          command.setPrint();
          var orderRemark = ordersArr[i].nxDoRemark;
          if(orderRemark !== "null" && orderRemark.length > 0){
            command.setCharacterSize(0);
            command.setText("备注:" + orderRemark + "");
            command.setPrint();
          }
        }
        that.setData({
          pickOrderArr: that.data.customerArr[that.data.customerIndex].depOrders
        })

      }
      if (that.data.depHasSubs == 1) {

        var arr = that.data.customerArr[that.data.customerIndex].subDeps;
        var temp = [];
        for (var i = 0; i < arr.length; i++) {

          //部门名称
          var subDepName = arr[i].nxDepartmentName;
          command.setCharacterSize(0);
          command.setText("部门: " + subDepName);
          command.setPrint();
          command.setText("*******************************");
          command.setPrint();
          var ordersArr = arr[i].nxDepartmentOrdersEntities;
          for (var j = 0; j < ordersArr.length; j++) {
            //获取pickOrderArr
            temp.push(ordersArr[j]);
            //获取打印
            var goodsName = ordersArr[j].nxDistributerGoodsEntity.nxDgGoodsName;
            var quantity = ordersArr[j].nxDoQuantity;
            var standard = ordersArr[j].nxDoStandard;
            command.setCharacterSize(1);
            command.setText(goodsName + "  ");
            command.setText(quantity + "" + standard);
            command.setPrint();
            var orderRemark = ordersArr[i].nxDoRemark;
            if(orderRemark !== "null" && orderRemark.length > 0){
              command.setCharacterSize(0);
              command.setText("备注:" + orderRemark + "");
              command.setPrint();
            }
          }
          command.setPrint();
          command.setPrint();

        }
        that.setData({
          pickOrderArr: temp
        })
      }

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

          
          var times = that.data.printTimes;
          that.setData({
            showOperation: false,
            printTimes: times + 1,
          })

          if(currentTime == loopTime){
            that._savePickerOrders();
          }
        

        },
        fail: function (e) {
          wx.showToast({
            title: '打印第' + currentPrint + '张失败',
            icon: 'none',
          })
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

      // 修改订单状态
      // that._savePickerOrders();
    },

    _savePickerOrders() {

      // load.showLoading("保存订单中")
      console.log("save orders.........")

      // distributionWeighing(this.data.pickOrderArr)
      //   .then(res => {
      //     load.hideLoading();
      //     console.log(res)
      //     if (res.result.code == 0) {
      //       wx.showToast({
      //         title: 'chenggong',
      //       })
      //       this._getTodayCustomer();

      //     }
      //   })
    },



  toOpenPrint(){
    wx.navigateToMiniProgram({
      appId: 'wx1c1fa5f0e3c6affd',
      path: 'pages/customerList/customerList?disId=' + this.data.userInfo.nxDistributerEntity.nxDistributerId + '&userId=' + this.data.userInfo.nxDiuDistributerId,
      envVersion: 'develop',  //release
      success(res) {
       
      }
    })

  },

  toEditHome(){
    wx.navigateTo({
      url: '../../homeEdit/homeEdit',
    })
  },


// methods
  },





})