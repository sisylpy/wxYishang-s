// pages/purchase/purchase.js
var load = require('../../lib/load.js');

let windowWidth = 0;
let itemWidth = 0;
const globalData = getApp().globalData;
import {

  delatePurchaseBatch,
  getPurchaseGoodsAndPurchaseBatch,
  savePurchaseBatchType,
} from '../../lib/apiDepOrder.js'

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
      //swiper-item 选择状态
      // if (globalData.tab1Index == null) {
      //   this.setData({
      //     tab1Index: 0,
      //   })
      // } else {
      //   this.setData({
      //     tab1Index: globalData.tab1Index,
      //   })
      // }

      //初始值
      this.setData({

        selectedArr: [],
        windowWidth: globalData.windowWidth * globalData.rpxR,
        windowHeight: globalData.windowHeight * globalData.rpxR,
        scale: globalData.scale,
      })
      var value = wx.getStorageSync('userInfo');
      if(value){

        this.setData({
          disId: value.nxDistributerEntity.nxDistributerId,
          userInfo: value

        })

        wx.setNavigationBarTitle({
          "title": value.nxDistributerEntity.nxDistributerName,
        })

      }

     
      this._getPurchaseGoods();

      if (this.data.isShareing) {
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
              that._delateOrder();
             


            } else {
              //点击确定

            }
          },
          fail: function (res) {

          }, //接口调用失败的回调函数
          complete: function (res) {
            that.setData({
              isShareing: false,
            })
          }, //接口调用结束的回调函数（调用成功、失败都会执行）

        })


      }
    },

    // ./show
  },


  methods: {
    onPageScroll(t) {
      var a = this;
      console.log(t.scrollTop)
      a.setData({
        scrollTop: t.scrollTop
      })
    },

    // 添加上货商品
    toApplyGoods() {
      wx.navigateTo({
        url: '../purchaseCome/purchaseCome',
      })
    },


    // 1, 进货单-获取进货单商品
    _getPurchaseGoods() {
      load.showLoading("获取数据中")
      getPurchaseGoodsAndPurchaseBatch(this.data.disId)
        .then(res => {
          console.log(res)
          if (res) {
            load.hideLoading();
            this.setData({
              purArr: res.result.data.goods,
              batchArr: res.result.data.batchs,
              selectedArr: []
            })
          }
          load.hideLoading();

        })
    },

    // 选择商品
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



    //3ge fangfa
    // 1， copy
    copyText: function (e) {
      console.log(e)
      //1,get Arr
      var copyArr = this._getSelectedArr();
      this.setData({
        selectedArr: copyArr,
        type: 1
      })

      //2, get copyText
      var temp = "";
      for (var i = 0; i < copyArr.length; i++) {
        if (copyArr[i].isSelected) {
          var name = copyArr[i].nxGoodsEntity.nxGoodsName;
          var quantity = copyArr[i].nxDpgQuantity;
          var standard = copyArr[i].nxDpgStandard;
          var str = name + "  " + quantity + standard + '\n';
          temp = temp + str;

        }
      }
      wx.setClipboardData({
        data: temp,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {

              // console.log("sucess")
              // wx.showToast({
              //   title: '复制成功'
              // })

            }
          })
        },
      })

      this._savePurchaseBatch(1);
    },


    // public
    _savePurchaseBatch(type) {
      var data = {
        nxDpbType: type,
        nxDpbPurUserId: 1,
        nxDpbDistributerId: this.data.disId,
        nxDPGEntities: this.data.selectedArr
      }
      console.log("heeristhedata!!!!")
      console.log(data);
      savePurchaseBatchType(data).then(res => {
        if (res) {
          if (this.data.type == 1 || this.data.type == 3) {
            this._getPurchaseGoods();

          }

          if (this.data.type == 2) {
            this.setData({
              purchaseId: res.result.data,
            })
          }
        }
      })
    },

    // 3. finished
    finishIndependent() {
      //1,get Arr
      var finishArr = this._getSelectedArr();
      this.setData({
        selectedArr: finishArr,
      })
      this._savePurchaseBatch(3);

    },




    // public
    _getSelectedArr() {
      var arr = this.data.purArr;
      var orderTemp = [];
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].isSelected) {
          orderTemp.push(arr[i]);
        }
      }
      return orderTemp;
    },

    toShare() {
      var selArr = this._getSelectedArr();
      this.setData({
        selectedArr: selArr,
        isShareing: true,
        type: 2,
      })

      this._savePurchaseBatch(2);
    },


    onShareAppMessage(res) {
      console.log(res)
      let that = this;



      const obj = {
        title: "发送给好友",
        path: '/pages/buy/friendShare/friendShare?purchaseId=' + this.data.purchaseId,
        success: function (res) {
          console.log(res, "转发成功")
        },
        fail: function (res) {
          wx.showToast({
            title: '发送失败',
            icon: 'none'
          })
        }
      }

      return obj;

    },

    _delateOrder() {
      delatePurchaseBatch(this.data.purchaseId).then(res => {
        if (res) {
          console.log(res)
          this._getPurchaseGoods();
        }
      })

    },




    // ./methods






  }

})