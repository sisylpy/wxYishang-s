const globalData = getApp().globalData;
import {
  purUserGetPurchaseGoods,update
} from '../../../lib/apiDepOrder.js'
//

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBuyPrice: false,
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

    this._getInitData();
    
    



  },

  _getInitData(){
    purUserGetPurchaseGoods(1)
    .then(res => {
      console.log(res.result.data)
      this.setData({
        applyArr: res.result.data
      })

    })
  },


  finished: function (e) {

    var id = e.currentTarget.dataset.id;
    console.log(id)
    this.setData({
      showBuyPrice: true,
      purGoodsId: id,
    })
   

  },

  savePrice(e){

    console.log(e)

    var newGoods = {
      nxDistributerPurchaseGoodsId: this.data.purGoodsId,
      nxDpgStatus: 2,
      nxDpgBuyPrice: e.detail.buyPrice,


    }

    update(newGoods)
      .then(res => {
        if (res.result.code == 0) {
          
          this._getInitData();

        }
      })
  }






})