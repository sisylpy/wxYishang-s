// pages/goodsDetail/goodsDetail.js

var app = getApp();

import {disGetGoodsDetail, disSaveStandard,disUpdateStandard} from '../../lib/apiibook'

const globalData = getApp().globalData;
import apiUrl from '../../config.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAdd: false,
    showEdit: false,


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      // disId: globalData.userInfo.nxDistributerEntity.nxDistributerId,
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      disId: 1,
      url: apiUrl.server,
      disGoodsId: options.disGoodsId,
      // disGoodsId: 1,
    })

    this._getGoodsDetail()

  },

  _getGoodsDetail(){
    disGetGoodsDetail(this.data.disGoodsId).then(res => {
      if(res) {
        console.log(res);
        this.setData({
          goods: res.result.data,
        })
      }
    })
   

  },


  addStandard(e){
    this.setData({
      showAdd: true,
      nxGoodsName: e.currentTarget.dataset.name

    })
},

editStandard(e){
  this.setData({
    showEdit: true,
    nxGoodsName: e.currentTarget.dataset.name,
    item: e.currentTarget.dataset.item
  })

},

confirmAdd: function(e){
  console.log(e);
  console.log("+=======")

  var data = {
    nxDsDisGoodsId: this.data.goods.nxDistributerGoodsId,
    nxDsStandardName: e.detail.standardName,
    
  }
  disSaveStandard(data).
    then(res => {
      if (res) {
        this._getGoodsDetail();
      }
    }) 
},

confirmEdit(e){
  var data = {
    nxDistributerStandardId: this.data.item.nxDistributerStandardId,
    nxDsStandardName: e.detail.standardName,
  }

  disUpdateStandard(data).
    then(res => {
      if (res) {
        this._getGoodsDetail();
      }
    })






}




})