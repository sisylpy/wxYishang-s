const globalData = getApp().globalData;
import {
  getPurchaserGoods,
} from '../../../lib/apiOrders.js'
//

Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyArr: [
      {
        goodsName: "黄瓜",
        status: 0,
        planPurchase: 30,
        todayQuantity: 20,
        ckApplysEntities: [
          {
            applyNumber: 40,
            applyStandardName: "jin",
            storeEntity: {
              outLabel: "outLabel"
            }


          }
        ]
      },

      {
        goodsName: "黄瓜1",
        status: 1,
        planPurchase: 30,
        todayQuantity: 20,
        ckApplysEntities: [
          {
            applyNumber: 40,
            applyStandardName: "jin",
            storeEntity: {
              outLabel: "outLabel"
            }


          }
        ]
      },
      {
        goodsName: "黄瓜2",
        status: 2,
        planPurchase: 30,
        todayQuantity: 20,
        ckApplysEntities: [
          {
            applyNumber: 40,
            applyStandardName: "jin",
            storeEntity: {
              outLabel: "outLabel"
            }


          }
        ]
      },
      {
        goodsName: "黄瓜3",
        status: 3,
        planPurchase: 30,
        todayQuantity: 20,
        ckApplysEntities: [
          {
            applyNumber: 40,
            applyStandardName: "jin",
            storeEntity: {
              outLabel: "outLabel"
            }


          }
        ]
      }

    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      purchaseUserId: options.purchaseUserId
    })

    var data = {
      purchaserUserId: this.data.purchaseUserId,
      status: 2,
    }
    getPurchaserGoods(data)
    .then(res => {
      console.log(res.result.data)
      this.setData({
        applyArr: res.result.data
      })

    })



  },


  finished: function (e) {

    var index = e.currentTarget.dataset.index;
    console.log(index)
    let status = this.data.applyArr[index]['status'];
    var goods = this.data.applyArr[index];
    var newGoods = {
      goodsId: goods.goodsId,
      status: 2
    }

    console.log(newGoods)

    updateGoods(newGoods)
      .then(res => {
        if (res.result.code == 0) {
          this.setData({
            ['applyArr[' + index + '].status']: 2
          })
        }
      })

  },


  show: function (e) {
    var index = e.currentTarget.dataset.index;
    if (this.data.applyArr[index].status == "2") {
      this.setData({
        ['applyArr[' + index + '].status']: 3
      })
    } else if (this.data.applyArr[index].status == "3") {
      this.setData({
        ['applyArr[' + index + '].status']: 2
      })
    }

  }




})