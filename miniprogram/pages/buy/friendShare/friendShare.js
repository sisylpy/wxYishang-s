// pages/storeApplys/storeApplys.js

const globalData = getApp().globalData;
import {
  getPurchaseGoodsBatch,
  updatePurchaseGoods
} from '../../../lib/apiDepOrder'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    limit: 20,
    page: 1,



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      batchId: 90,
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
    })
    
    getPurchaseGoodsBatch(90)
      .then(res => {
        if (res) {
          console.log(res);
          this.setData({
            batch: res.result.data

          })
        }
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#49174a',
        animation: {
          duration: 200,
          timingFunc: 'easeIn'
        }
      })

  },

  getQuantity(e){
    var index = e.currentTarget.dataset.index;

    var amount = "batch.nxDPGEntities["+ index + "].nxDpgBuyQuantity";
    this.setData({

     [amount]: e.detail.value

    })
    this._updatePurchaseGoods(index);

  },

  getPrice(e){
    console.log(e);
    var index = e.currentTarget.dataset.index;

    var price = "batch.nxDPGEntities["+ index + "].nxDpgBuyPrice";
    this.setData({

     [price]: e.detail.value

    })
    this._updatePurchaseGoods(index);
  },

  _updatePurchaseGoods(i){
    var item  = this.data.batch.nxDPGEntities[i];
    updatePurchaseGoods(item).then(res => {
      if(res){
        console.log(res)
      }
    })
    
  }


})