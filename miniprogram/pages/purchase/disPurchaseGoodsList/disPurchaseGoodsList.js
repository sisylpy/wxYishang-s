


const globalData = getApp().globalData;
var load = require('../../../lib/load.js');

import {
  disGetDisGoodsListByFatherId,
  savePlanPurchase} 
  from '../../../lib/apiDistributer'

Page({
  
  /**
   * 页面的初始数据
   */

   data: {


    totalPage: 0,
    totalCount: 0,
    limit: 20,
    currentPage: 1,
    isLoading: false,
    disPlanPurchaseGoods: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      fatherId: options.fatherId,
     
      
    })

    var userInfo = wx.getStorageSync('userInfo');
    if(userInfo){
      this.setData({
        disId: userInfo.nxDiuDistributerId,
        userId: userInfo.nxDistributerUserId,
      })
    }

    this._getInitData();


  },



  _getInitData(){

    load.showLoading("获取商品中")
    disGetDisGoodsListByFatherId(this.data.fatherId).then(res =>{
      if(res.result.code == 0){
        load.hideLoading();
        this.setData({
          goodsList: res.result.data,
        })
      }else{
        load.hideLoading();
        wx.showToast({
          title: '获取商品失败',
          icon: 'none'
        })
      }
    })
  },

 
  //保存进货商品
  addPlanPurchse(e) {
  
    this.setData({
      goodsId: e.currentTarget.dataset.id,
      disPlanPurchaseGoods: true,
      item: e.currentTarget.dataset.item,
      applyStandardName: e.currentTarget.dataset.standard,
    })

  },

  changeStandard: function (e) {
    console.log(e.detail.applyStandardName)

    this.setData({
      applyStandardName: e.detail.applyStandardName
    })
  },

  confirm(e){
    console.log(e);
    var goodsId = this.data.goodsId;
    var fatherGoodsId = this.data.fatherId;
    var plan = e.detail.plan;
    var applyStandardName = e.detail.applyStandardName;

    var purGoods = {
      nxDpgDisGoodsId: goodsId,
      nxDpgDisGoodsFatherId: fatherGoodsId,
      nxDpgQuantity: plan,
      nxDpgStandard:  applyStandardName,
      nxDpgDistributerId: this.data.disId,
      nxDepartmentOrdersEntities: []
    }
    load.showLoading("保存进货商品")
    savePlanPurchase(purGoods).then(res => {
      if (res.result.code == 0) {
        load.hideLoading();
       wx.showToast({
         title: '保存成功',
       })
      }else{
        load.hideLoading();
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    })

  },



})