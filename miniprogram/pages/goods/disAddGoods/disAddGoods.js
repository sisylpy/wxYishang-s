// pages/goodsDetail/goodsDetail.js

var app = getApp();

import {
  disSaveDisGoods,
} from '../../../lib/apiDistributer'

const globalData = getApp().globalData;
import apiUrl from '../../../config.js'
var load = require('../../../lib/load.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAdd: false,
    showEdit: false,
    standardArr: []
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      // disId: globalData.userInfo.nxDistributerEntity.nxDistributerId,
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      // disId: 2,
      url: apiUrl.server,
      fatherId: options.fatherId,
      fatherName: options.fatherName,
      // fatherId: 6,
      // fatherName: "根茎类",
      // disGoodsId: 1,
    })
    var value = wx.getStorageSync('userInfo');
    if(value){
      this.setData({
        userInfo: value
      })
    }
  },


  getGoodsName(e){
    this.setData({
      goodsName: e.detail.value,
    })


  },
  getStanardName(e){
    this.setData({
      standardName: e.detail.value
    })
    var data = {
      nxDsStandardName: e.detail.value,
    }
    var arr = this.data.standardArr;
    arr.push(data);
    this.setData({
      standardArr: arr,
    })
  },
  addStandard(e) {
    this.setData({
      showAdd: true,
      nxGoodsName: this.data.goodsName
    })
  },

  editStandard(e) {
    this.setData({
      showEdit: true,
      nxGoodsName: e.currentTarget.dataset.name,
      item: e.currentTarget.dataset.item
    })

  },

  confirmAdd: function (e) {
    console.log(e);
    console.log("+=======")

    var data = {
      nxDsStandardName: e.detail.standardName,
    }
    var arr = this.data.standardArr;
    arr.push(data);
    this.setData({
      standardArr: arr,
    })

    
  },

  confirmEdit(e) {
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
  },

  saveDisGoods(){
    
    var standardArr = this.data.standardArr;
    standardArr.splice(0,1);   

   var data = {
    nxDgDistributerId: this.data.userInfo.nxDistributerEntity.nxDistributerId,
    nxDgDfgGoodsFatherId: this.data.fatherId,
    nxDgGoodsName: this.data.goodsName,
    nxDgGoodsStandardname: this.data.standardName,
    distributerStandardEntities: standardArr,
    nxDgPullOff: 0,

   }
    disSaveDisGoods(data).then(res =>{
      if(res.result.code == 0){
       wx.navigateBack({
         delta: 1,
       })


      }

    })
  }
  




})