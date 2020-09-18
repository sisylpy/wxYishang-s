// pagesOrder/rIndex/rIndex.js

const globalData = getApp().globalData;
var app = getApp()

import apiUrl from '../../../config.js'
import {disGetDepTodayOrders, depGetWeeksApply} from '../../../lib/apiDepOrder'


Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onShow: function(){

    if(this.data.depId){
      this._getDepAppys();
      
    }


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      depId: options.depId,
      depFatherId: options.depFatherId,
      
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      url: apiUrl.server,
      
    })
    
     //login页面存储的信息
     var value = wx.getStorageSync('userInfo');
     if (value) {
       this.setData({
         disId: value.nxDistributerEntity.nxDistributerId,
         userInfo: value,
       })

       wx.setNavigationBarTitle({
         "title": value.nxDistributerEntity.nxDistributerName,
       })

       this._getDepAppys();
      }


    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#1e82b4',
      animation: {
        duration: 200,
        timingFunc: 'easeIn'
      }
    })
    


  },
  _getDepAppys(){
    var data = {
      disId: this.data.disId,
      depId: this.data.depFatherId,
    }

    disGetDepTodayOrders(data).then(res =>{
      if(res){ 
        console.log(res);
        this.setData({
          applyArr: res.result.data,
        })
        var that = this;
        var query = wx.createSelectorQuery();
        //选择id
        query.select('#mjltest').boundingClientRect()
        query.exec(function (res) {
          that.setData({
            maskHeight: res[0].height * globalData.rpxR
          })
        })
      }
    })
  },


  /**
   * 打开操作面板
   * @param {}} e 
   */
  openOperation(e) {
    this.setData({
      showOperation: true,
      applyItem: e.currentTarget.dataset.item,
    })
  },
/**
 * 关闭操作面板
 */
  hideMask() {
    this.setData({
      showOperation: false,
    })
  },



  
/**
 * 点击弹窗的“关闭”按钮
 */
  cancle() {
  
    this.setData({
      show: false,
      editApply: false,
      applyItem: "",
      item: "",
      applyNumber: "",
      applyStandardName: "",
      depStandardArr: [],

    })
  },


  /**
   * 修改配送商品申请
   */
  editApply() {
    var applyItem = this.data.applyItem;
    this.setData({
      show: true,
      showOperation: false,
      applyStandardName: applyItem.nxDoStandard,
      item: this.data.applyItem.nxDepartmentDisGoodsEntity,
      editApply: true,
      applyNumber: applyItem.nxDoQuantity,
      applyRemark:applyItem.nxDoRemark,

    })
  },



// 
  toQuickOrder(){
    wx.navigateTo({
      url: '../searchGoods/searchGoods?depId=' + this.data.depId  +'&depFatherId=' + this.data.depFatherId ,
    })
  },


  
  






})