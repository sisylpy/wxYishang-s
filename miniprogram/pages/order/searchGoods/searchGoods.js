// pages/customerOrder/searchGoods/searchGoods.js

import {
  saveOrder,  
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
    var value = wx.getStorageSync('userInfo');
    if (value) {

      this.setData({
        disId: value.nxDistributerEntity.nxDistributerId,
        userInfo: value,

      })
    };
    this.setData({
      depId: options.depId,
      depFatherId: options.depFatherId,

    })
    if(options.depFatherId == 0){
      this.setData({
        depFatherId: options.depId,
      })
    }

    


  },


  getGoodsName(e) {
    var name = e.detail.value;
    var data ={
      str: e.detail.value,
      disId: this.data.disId
    }
    if(name.length > 0){
      queryDisGoodsByQuickSearch(data).then(res => {
        if (res) {
          console.log(res.result.data)
          this.setData({
            goodsArr: res.result.data
          })
        }
      })

    }
   
  },


  purchaseGoods: function (e) {
   

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

  

    console.log(e);
   
    var now = new Date();
    var day = now.getDay();
      var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
      var week = weeks[day];

    // var dg = {
    //   nxDoNxGoodsId: e.detail.applyGoodsId,
    //   nxDoNxGoodsFatherId: e.detail.nxGoodsFatherId,
    //   nxDoQuantity: e.detail.applyNumber,
    //   nxDoStandard: e.detail.applyStandardName,
    //   nxDoRemark: e.detail.applyRemark,
    //   nxDoDepartmentId: this.data.depId,
    //   nxDoDistributerId: this.data.disId,
    //   nxDoDepartmentFatherId: this.data.depFatherId,
    //   nxDoDepDisGoodsId: this.data.item.nxDepDisGoodsId,
    //   nxDoDepDisGoodsPrice: this.data.item.nxDepDisGoodsPrice,
    //   nxDoGoodsType: 0,
    //   nxDoApplyWhatDay: week,


    // };

    var dg = {
      nxDoOrderUserId: this.data.userInfo.nxDepartmentUserId,
      nxDoNxGoodsId: this.data.item.nxDgNxGoodsId,
      nxDoNxGoodsFatherId: this.data.item.nxDgNxFatherId,
      nxDoDepartmentId: this.data.depId,
      nxDoDistributerId: this.data.disId,
      nxDoDepartmentFatherId: this.data.depFatherId,
      nxDoDisGoodsId: this.data.item.nxDistributerGoodsId,
      nxDoDisGoodsFatherId: this.data.item.nxDgDfgGoodsFatherId,
      // nxDoDepartmentGoodsId: this.data.item.nxDepartmentGoodsId,
      // nxDoDepartmentGoodsPrice: this.data.item.nxDepartmentGoodsPrice,
      nxDoQuantity: e.detail.applyNumber,
      nxDoStandard: e.detail.applyStandardName,
      nxDoRemark: e.detail.applyRemark,
      nxDoGoodsType: 0,
      nxDoApplyWhatDay: week,
      nxDoIsAgent: 1,

    }


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