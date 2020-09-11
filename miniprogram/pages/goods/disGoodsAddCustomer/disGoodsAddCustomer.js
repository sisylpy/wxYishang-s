// pages/customerList/customerList.js
import {

  getUnDisGoodsDepartments,
  disSaveDepartDisGoods
} from '../../../lib/apiDistributer.js'

var load = require('../../../lib/load.js');




Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      disGoodsId: options.disGoodsId
    })
    var data  = {
      disId: options.disId,
      disGoodsId: options.disGoodsId,
    }

    load.showLoading("获取客户中")
    getUnDisGoodsDepartments(data).then(res =>{
      if(res){
        load.hideLoading();
        console.log(res);
        this.setData({
          addGoodsCustomerArr: res.result.data
        })
        
      }
    })
  },

  addDisGoodsToDepartment(e){
    var data = {
      nxDdgDepartmentFatherId: e.currentTarget.dataset.id,
      nxDdgDisGoodsId: this.data.disGoodsId
    }
    load.showLoading("保存商品")

    disSaveDepartDisGoods(data).then(res =>{
      if(res.result.code == 0){
        console.log(res);
        load.hideLoading();

        wx.navigateBack({
         delta: 1
        })

      }
    })

  },
  // 






})