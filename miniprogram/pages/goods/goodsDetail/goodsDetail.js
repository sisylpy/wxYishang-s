
import {
  disGetGoodsDetail,
  disSaveStandard,
  disUpdateStandard,
  disGoodsUpdate
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


  },

  onShow: function(){
    this._getGoodsDetail()


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
      fatherName: options.fatherName,
      // disGoodsId: 1,
    })

    this._getGoodsDetail()

  },

  _getGoodsDetail() {
    load.showLoading("获取商品信息")
    disGetGoodsDetail(this.data.disGoodsId).then(res => {
      if (res) {
        load.hideLoading();
        this.setData({
          goods: res.result.data.goodsInfo,
          departmentArr: res.result.data.departmentArr,
        })
      }
    })


  },


  addStandard(e) {
    this.setData({
      showAdd: true,
      nxGoodsName: e.currentTarget.dataset.name

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
  switchChange(e) {
    var pullOff = "goods.nxDgPullOff"
    if (e.detail.value) {
      this.setData({
        [pullOff]: 1
      })
    } else {
      this.setData({
        [pullOff]: 0
      })
    }
    disGoodsUpdate(this.data.goods)
    .then(res =>{
      if(res.result.code == 0){
        wx.showToast({
          title: '修改成功',
        })
      }
    })



  },

  showAddGoodsDepartments() {
    wx.navigateTo({
      url: '../disGoodsAddCustomer/disGoodsAddCustomer?disGoodsId=' + this.data.disGoodsId + '&disId=' + this.data.disId ,
    })

  }





})