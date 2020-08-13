// pages/customerOrder/searchGoods/searchGoods.js

import {
  queryGoodsByQuickSearch,
} from '../../../lib/apiibook'
import {
  saveOrder,
  getDepGoodsInfo,
  getFatherDep,
  queryDisGoodsByQuickSearch
} from '../../../lib/apiDistributer'
const globalData = getApp().globalData;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchStr: "",
    input: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    this.setData({
      depId: options.depId,
      hassubs: options.hassubs,
      disId: globalData.userInfo.nxDistributerEntity.nxDistributerId,

    })


  },


  getGoodsName(e) {
    var name = e.detail.value;
    queryDisGoodsByQuickSearch(name).then(res => {
      if (res) {
        console.log(res.result.data)
        this.setData({
          goodsArr: res.result.data
        })
      }
    })
  },


  purchaseGoods: function (e) {
    console.log(e)
    var data = {
      nxGoodsId: e.currentTarget.dataset.id,
      nxDepId: this.data.depId
    }
    getDepGoodsInfo(data).then(res => {
      if (res) {
        console.log(res.result.data)
        this.setData({
          item: res.result.data
        })
      }
    })

    this.setData({
      show: true,
      item: e.currentTarget.dataset.item,
      applyStandardName: e.currentTarget.dataset.standard,
      selIndex: e.currentTarget.dataset.index,

    })
  },


  changeStandard: function (e) {
    console.log(e.detail.applyStandardName)

    this.setData({
      applyStandardName: e.detail.applyStandardName
    })
  },

  confirm: function (e) {

    var nxDoDepartmentId = "";
    var nxDoDepartmentFatherId = "";

    console.log(e);
    if (this.data.hassubs == 0) {
      nxDoDepartmentFatherId = 0;

    }
    if (this.data.hassubs == 1) {
      nxDoDepartmentFatherId = this.data.fatherDep.nxDepartmentId


    }
    var dg = {
      nxDoNxGoodsId: e.detail.applyGoodsId,
      nxDoNxGoodsFatherId: e.detail.nxGoodsFatherId,
      nxDoQuantity: e.detail.applyNumber,
      nxDoStandard: e.detail.applyStandardName,
      nxDoRemark: e.detail.applyRemark,
      nxDoDepartmentId: this.data.depId,
      nxDoDistributerId: this.data.disId,
      nxDoDepartmentFatherId: nxDoDepartmentFatherId,
      nxDoDepartmentGoodsId: this.data.item.nxDepartmentGoodsId,
      nxDoDepartmentGoodsPrice: this.data.item.nxDepartmentGoodsPrice,
    };


    console.log(dg);


    saveOrder(dg).then(res => {
      if (res) {
        this.setData({
          searchStr: "",
          goodsArr: [],
          input: true

        })



      }
    })

  },

  addStandard: function (e) {
    this.setData({
      showAdd: true,
      nxGoodsId: e.currentTarget.dataset.id,
      item: e.currentTarget.dataset.item,
      itemIndex: e.currentTarget.dataset.index,

    })


  },

  confirmAdd: function (e) {
    console.log(e);
    console.log("+=======")


    var id = this.data.item.nxGoodsId;
    var index = this.data.itemIndex;

    var data = {
      stGoodsId: id,
      nxStandardName: e.detail.standardName,
    }
    saveStandard(data).
    then(res => {
      if (res) {
        console.log(res)
        var standardlist = this.data.goodsList[index].nxGoodsStandardEntities;
        console.log(this.data.goodsList[index]);
        standardlist.push(res.result.data);
        console.log(standardlist);
        var up = "goodsList[" + index + "].nxGoodsStandardEntities"

        this.setData({
          [up]: standardlist
        })

      }
    })
  }






})