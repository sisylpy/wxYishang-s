// pagesRes/disGoodsCata/disGoodsCata.js



const app = getApp()
const globalData = getApp().globalData;

var load = require('../../lib/load.js');


import {
  getDisGoodsList
} from '../../lib/apiRestruant'
import {savePlanPurchase} from '../../lib/apiDepOrder'
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
    console.log(globalData.groupInfo)

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      disId: 1,
      fatherId: options.fatherId,
      // depFatherId: globalData.groupInfo.groupInfo.nxDepartmentId,

      // fatherId: 111
      
    })

    this._getInitData();


  },




  _getInitData(){

    var data = {
    
      nxDgNxGoodsFatherId: this.data.fatherId,
      nxDgDistributeId: this.data.disId,
      // depFatherId: this.data.depFatherId
    }

    getDisGoodsList(data).then(res =>{
      if(res){
        console.log(res.result.data);
        this.setData({
          goodsList: res.result.data,
        })
      }
    })
  },

 
  //保存进货商品
  addPlanPurchse(e) {
    console.log(e);
  
   
    var item  = this.data.goodsList[e.currentTarget.dataset.index];

    this.setData({
      goodsId: e.currentTarget.dataset.id,
      disPlanPurchaseGoods: true,
      item: item,
      standard: e.currentTarget.dataset.standard,

    })

   


  },

  confirm(e){
    console.log(e);
    var goodsId = this.data.goodsId;
    var fatherGoodsId = this.data.fatherId;
    var plan = e.detail.plan;
    var standard = e.detail.standard;

    var purGoods = {
      nxDpgNxGoodsId: goodsId,
      nxDpgNxGoodsFatherId: fatherGoodsId,
      nxDpgQuantity: plan,
      nxDpgStandard:  standard,
      nxDpgDistributerId: 1,
      nxDepartmentOrdersEntities: []
    }
    savePlanPurchase(purGoods).then(res => {
      if (res) {
        console.log(res);
        // this._getPlanPurchaseGoods();
      }
    })

  },



})