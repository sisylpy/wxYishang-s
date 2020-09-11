var load = require('../../../lib/load.js');
const globalData = getApp().globalData;

import {
  getPurchaseGoods,
  copyPruchaseGoodsStatus,
  finishPruchaseGoodsStatus,
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
      this.setData({

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



      if (this.data.isShareing) { // 点击微信转发时候设置的状态
        var that = this;
        wx.showModal({
          title: '微信订货',
          content: '确定已经转发给了微信好友？',
          showCancel: true, //是否显示取消按钮
          cancelText: "没有", //默认是“取消”
          cancelColor: '#464545', //取消文字的颜色
          confirmText: "已转发", //默认是“确定”
          confirmColor: '#187e6e', //确定文字的颜色
          success: function (res) {
            if (res.cancel) {
              that._delateOrder(); // 如果点击“没有”，就删除点击微信转发时候保存的进货批次。
            }
          },
          fail: function (res) {
            wx.showToast({
              title: '请重新操作',
              icon: 'none'
            })
          },
          complete: function (res) {
            that.setData({
              isShareing: false,
            })
          },
        })
      }

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

    // 点击选中
    selectPurchaseGoods(e) {
      var index = e.currentTarget.dataset.index;
      var purGoodsId = e.currentTarget.dataset.id;
      var purGoods = this.data.purArr[index];
      var selArr = this.data.selectedArr;
      if (purGoods.isSelected) {
        //1，改变选中状态
        var purGoodsData = "purArr[" + index + "].isSelected";
        this.setData({
          [purGoodsData]: false
        })
        //2，删除已选数组
        if (selArr.length > 0) {
          for (var i = 0; i < selArr.length; i++) {
            if (selArr[i].nxDistributerPurchaseGoodsId == purGoodsId) {
              selArr.splice(i, 1);
            }
          }
          this.setData({
            selectedArr: selArr
          })
        }
      } else {
        var purGoodsData = "purArr[" + index + "].isSelected";
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
    copyText: function (e) {

      this.setData({
        type: 1 //复制 进货的状态是1
      })

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


    // 完成
    finishIndependent() {
      this.setData({
        type: 3, //完成进货的状态是3
      })

      this._updatePruchaseGoodsStatus(this.data.type);
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
      if (this.data.type == 3) {
        finishPruchaseGoodsStatus(this.data.selectedArr).then(res => {
          if (res.result.code == 0) {
            this._getPurchaseGoods();
          }
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
  }

})