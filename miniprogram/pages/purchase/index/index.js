var load = require('../../../lib/load.js');
const globalData = getApp().globalData;
var app = getApp()
var esc = require("../../../utils/GPutils/esc.js");
var dateUtils = require('../../../utils/dateUtil');


import {
  getPurchaseGoods,
  copyPruchaseGoodsStatus,
  finishPruchaseGoodsStatus,
  printPurchaseGoodsStatus,
  savePurchaseBatchType,
  delatePurchaseBatch,
} from '../../../lib/apiDistributer.js'

Component({
  pageLifetimes: {

    show() {
      //tabbar-item
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }

      //初始值
      var todayTime = dateUtils.formatTime(new Date());

      this.setData({
        todayTime: todayTime,
        selectedArr: [],
        windowWidth: globalData.windowWidth * globalData.rpxR,
        windowHeight: globalData.windowHeight * globalData.rpxR,
        scale: globalData.scale,
        batchId: null,
      })

      var value = wx.getStorageSync('userInfo');
      if (value) {
        this.setData({
          disId: value.nxDistributerEntity.nxDistributerId,
          userInfo: value,
          userId: value.nxDistributerUserId,
        })

        wx.setNavigationBarTitle({
          "title": value.nxDistributerEntity.nxDistributerName,
        })
      }



      // if (this.data.isShareing) { // 点击微信转发时候设置的状态
      //   var that = this;
      //   wx.showModal({
      //     title: '微信订货',
      //     content: '确定已经转发给了微信好友？',
      //     showCancel: true, //是否显示取消按钮
      //     cancelText: "没有", //默认是“取消”
      //     cancelColor: '#464545', //取消文字的颜色
      //     confirmText: "已转发", //默认是“确定”
      //     confirmColor: '#187e6e', //确定文字的颜色
      //     success: function (res) {
      //       if (res.cancel) {
      //         that._delateOrder(); // 如果点击“没有”，就删除点击微信转发时候保存的进货批次。
      //       }
      //     },
      //     fail: function (res) {
      //       wx.showToast({
      //         title: '请重新操作',
      //         icon: 'none'
      //       })
      //     },
      //     complete: function (res) {
      //       that.setData({
      //         isShareing: false,
      //       })
      //     },
      //   })
      // }


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

       

      this._getPurchaseGoods(); // 获取初始化进货商品

    },

  },
  // ./show



  methods: {

    onPageScroll(t) {
      var a = this;
      console.log(t.scrollTop)
      a.setData({
        scrollTop: t.scrollTop
      })
    },

    /**
     * 打开申请商品列表
     */
    toApplyGoods() {
      wx.navigateTo({
        url: '../purchaseCome/purchaseCome',
      })
    },


    // 1, 进货单-获取进货单商品
    _getPurchaseGoods() {
      load.showLoading("获取数据中")
      getPurchaseGoods(this.data.disId)
        .then(res => {
          console.log(res)
          if (res.result.code == 0) {
            load.hideLoading();
            this.setData({
              purArr: res.result.data,
              // batchArr: res.result.data.batchs,
              selectedArr: []
            })
          } else {
            load.hideLoading();
            wx.showToast({
              title: '获取商品失败',
              icon: 'none'
            })
          }

        })
    },

    // 点击父类选中
    selectPurchaseFatherGoods(e) {

      var fatherIndex = e.currentTarget.dataset.index;
      var father = this.data.purArr[fatherIndex];
      var purGoodsArr = this.data.purArr[fatherIndex];
      var selArr = this.data.selectedArr;
      console.log(father + "father.....")
      if (father.isSelected) {
        //所有子商品都改变不选择
        var goodsArr = this.data.purArr[fatherIndex].nxDistributerPurchaseGoodsEntities;
        for (var i = 0; i < goodsArr.length; i++) {
          goodsArr[i].isSelected = false;
          console.log(goodsArr[i]);
        }

        var self = "purArr["+ fatherIndex+"].isSelected";
        var arr = "purArr[" + fatherIndex + "].nxDistributerPurchaseGoodsEntities";

        this.setData({
          [arr]: goodsArr,
          [self]: false
        })

      } else {

        //所有子商品都选中
        //所有子商品都改变不选择
        var goodsArr = this.data.purArr[fatherIndex].nxDistributerPurchaseGoodsEntities;
        for (var i = 0; i < goodsArr.length; i++) {
          goodsArr[i].isSelected = true;
          console.log(goodsArr[i]);
        }

        var self = "purArr["+ fatherIndex+"].isSelected";
        var arr = "purArr[" + fatherIndex + "].nxDistributerPurchaseGoodsEntities";

        this.setData({
          [arr]: goodsArr,
          [self]: true
        })


      }

    },

    // 点击选中
    selectPurchaseGoods(e) {
      var fatherIndex = e.currentTarget.dataset.fatherindex;
      var index = e.currentTarget.dataset.index;
      var purGoodsId = e.currentTarget.dataset.id;
      var purGoods = this.data.purArr[fatherIndex].nxDistributerPurchaseGoodsEntities[index];
      var selArr = this.data.selectedArr;
      if (purGoods.isSelected) {
        //1，改变选中状态
        var purGoodsData = "purArr[" + fatherIndex + "].nxDistributerPurchaseGoodsEntities["+ index + "].isSelected";
        this.setData({
          [purGoodsData]: false
        })
        //2，删除已选数组
        if (selArr.length > 0) {
          selArr.splice(selArr.findIndex(item => item.nxDistributerPurchaseGoodsId === purGoodsId), 1);

          this.setData({
            selectedArr: selArr
          })
        }
      } else {
        var purGoodsData = "purArr[" + fatherIndex + "].nxDistributerPurchaseGoodsEntities["+index+"].isSelected";
          this.setData({
          [purGoodsData]: true
        })
        //2，添加已选数组
        selArr.push(purGoods);
        this.setData({
          selectedArr: selArr
        })
      }
    },



    //复制
    changePurchaseStatus: function (e) {
      if(e.currentTarget.dataset.type == 1){
        //fuzhi
        this.setData({
          type: 1 //复制 进货的状态是1
        })
        this._copyText();
      }
      if(e.currentTarget.dataset.type == 2){
        //fuzhi
        this.setData({
          type: 2 //复制 进货的状态是1
        })
        this._updatePruchaseGoodsStatus(this.data.type);

      }
      if(e.currentTarget.dataset.type == 3){
        //fuzhi
        this.setData({
          type: 3 //复制 进货的状态是1
        })
        this._updatePruchaseGoodsStatus(this.data.type);

      }

     

      
    },

    _copyText(){
      //复制进货商品内容
      var temp = "";
      var copyArr = this.data.selectedArr;
      for (var i = 0; i < copyArr.length; i++) {
        if (copyArr[i].isSelected) {
          var name = copyArr[i].nxDistributerGoodsEntity.nxDgGoodsName;
          var quantity = copyArr[i].nxDpgQuantity;
          var standard = copyArr[i].nxDpgStandard;
          var str = name + "  " + quantity + standard + '\n';
          temp = temp + str;
        }
      }

      // 复制板
      var that = this;
      wx.setClipboardData({
        data: temp,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              //修改进货商品状态
              that._updatePruchaseGoodsStatus(that.data.type);
            }
          })
        },
      })
    },



    // 复制和完成改变进货商品状态
    _updatePruchaseGoodsStatus() {
      if (this.data.type == 1) {
        copyPruchaseGoodsStatus(this.data.selectedArr).then(res => {
          if (res.result.code == 0) {
            this._getPurchaseGoods();
          }
        })
      }
      if (this.data.type == 2) {
        //打印
        this._printPurchaseGoods(); 
      }
      if (this.data.type == 3) {
        finishPruchaseGoodsStatus(this.data.selectedArr).then(res => {
          if (res.result.code == 0) {
            this._getPurchaseGoods();
          }
        })
      }
    },


    // 打印命令
    _printPurchaseGoods() {
      if (this.data.setSuccess) {
        // 打印
        this.printBLEData(); 
      } else {
       //设置打印机
        wx.navigateTo({
          url: '../pSearchPrinter/pSearchPrinter',
        })
      }
    },







    /////////到此为止！！！！！！！

    // 微信转发
    // toShare() {
    //   this.setData({
    //     isShareing: true,
    //   })
    //   var data = {
    //     nxDpbType: 2,
    //     nxDpbPurUserId: this.data.userId,
    //     nxDpbDistributerId: this.data.disId,
    //     nxDPGEntities: this.data.selectedArr
    //   }
    //   savePurchaseBatchType(data).then(res => {
    //     if (res.result.code == 0) {
    //       this.setData({
    //         abc: res.result.data,
    //         batchId: res.result.data,
    //       })
    //     }
    //   })
    // },


    /**
     * !!!分享这里获取不到batchId，这里有问题，下一个版本再解决
     * @param {*} res 
     */
    // onShareAppMessage(res) {
    //   return {
    //     title: this.data.batchId,
    //     path: '/pages/buy/friendShare/friendShare?batchId=' + this.data.batchId,
    //     success: function (res) {
    //       // 转发成功
    //       console.log(res)
    //     },
    //     fail: function (res) {
    //       // 转发失败
    //       console.log(res)
    //     }
    //   }
    // },

    //如果没有转发微信，则删除转发前添加的采购批次
    // _delateOrder() {
    //   delatePurchaseBatch(this.data.batchId).then(res => {
    //     if (res) {
    //       console.log(res)
    //       this._getPurchaseGoods();
    //     }
    //   })

    // },




    // ./methods



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
      command.setText("进货单");
      command.setPrint(); //打印并换行
      command.setPrint(); //打印并换行
      command.setSelectJustification(0) //设置居左 
      command.setCharacterSize(0);
      command.setText("时间: " + that.data.todayTime  );
      command.setPrint(); //打印并换行

      
      // command.setSelectJustification(0) //设置居左
      // command.setText("商品")
      // command.setAbsolutePrintPosition(168)
      // command.setText("进货")
      // command.setAbsolutePrintPosition(242)
      // command.setPrint();
      command.setText("-------------------------------")
      command.setPrint();
        var arr = that.data.selectedArr;
        for (var i = 0; i < arr.length; i++) {
          var goodsName = arr[i].nxDistributerGoodsEntity.nxDgGoodsName;
          var quantity = arr[i].nxDpgQuantity;
          var standard = arr[i].nxDpgStandard;
          command.setCharacterSize(1);
          command.setText(goodsName + "  ");
          command.setText(quantity + " " + standard);
          command.setPrint();

          for(var j = 0; j < arr[i].nxDepartmentOrdersEntities.length; j++){
            var order = arr[i].nxDepartmentOrdersEntities[j];
            var orderDep = order.nxDepartmentEntity.nxDepartmentName;
            var orderQuantity = order.nxDoQuantity;
            var oderStandard = order.nxDoStandard;
            command.setCharacterSize(0);
            command.setText("  " + orderDep + " ");
            command.setText(orderQuantity + oderStandard);
            var orderRemark = order.nxDoRemark;
            if(orderRemark !== "null" && orderRemark.length > 0){
              console.log(orderRemark + "orderRemarkkkekekek")
              command.setText("(" + orderRemark + ")");
            }
             command.setPrint();
          }
         
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
            that._printData();
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

  _printData(){
    var that = this;
    printPurchaseGoodsStatus(this.data.selectedArr).then(res => {
      if (res.result.code == 0) {

        wx.showToast({
          title: '打印完成',
        })
        wx.closeBLEConnection({
          deviceId: app.BLEInformation.deviceId,
          success: function (res) {
            console.log("关闭蓝牙成功")
          },
        })

        //
        that._getPurchaseGoods();

      }
    })
  },



    // methods


  }

})