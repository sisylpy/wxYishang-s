// pages/goodsDetail/goodsDetail.js

var app = getApp();

import {
  saveNxGoods,
  editNxGoods,
  getNxGoodsInfo,
} from '../../../lib/apiibook'

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
    standardArr: [],
    editGoods:false
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
      editGoods: options.editGoods,
      nxGooodsId: options.nxGooodsId,
     
    })

    var value = wx.getStorageSync('userInfo');
    if(value){
      this.setData({
        userInfo: value
      })
    }

    if(this.data.editGoods){
      this._getGoodsInfo();

    }
  },

  _getGoodsInfo(){
     getNxGoodsInfo(this.data.nxGooodsId).then(res =>{
       if(res){
         console.log(res);
         this.setData({
           goods: res.result.data,
         })
       }
     })


  },

  getGoodsContent(e){
    
    if(this.data.editGoods){
      if(e.currentTarget.dataset.type == 0){
        var brand = "goods.nxGoodsBrand";
        this.setData({
          [brand]: e.detail.value
        })
      } if(e.currentTarget.dataset.type == 1){
        var place = "goods.nxGoodsPlace";
        this.setData({
          [place]: e.detail.value
        })
      } if(e.currentTarget.dataset.type == 2){
        var detail = "goods.nxGoodsDetail";
        this.setData({
          [detail]: e.detail.value
        })
      } if(e.currentTarget.dataset.type == 3){
        var name = "goods.nxGoodsName";
        this.setData({
          [name]: e.detail.value
        })
      } if(e.currentTarget.dataset.type == 4){
        var stand = "goods.nxGoodsStandardname";
        this.setData({
          [stand]: e.detail.value
        })
      } 
    }



    
  },

  getStanardName(e){
    if(this.data.editGoods){
      var standard = "goods.nxGoodsStandardname";
      this.setData({
        [standard]: e.detail.value
      })
    }else{
      this.setData({
        standardName: e.detail.value
      })
    }
  },

 
  /**
    * 保存商品
    */
  saveNxGoods(){
  
    var standardArr = this.data.standardArr;
    standardArr.splice(0,1);   
   var data = {
    nxGoodsFatherId: this.data.fatherId,
    nxGoodsName: this.data.goodsName,
    nxGoodsStandardname: this.data.standardName,
    nxGoodsStandardEntities: standardArr,
    nxGoodsBrand: "",
    nxGoodsPlace: "",    
   }

   saveNxGoods(data).then(res =>{
      if(res.result.code == 0){
        console.log(res)
       wx.navigateBack({
         delta: 1,
       })
      }
    })
  },

  /**
   * 修改商品
   */
  editNxGoods(){
    editNxGoods(this.data.goods).then(res =>{
      if(res.result.code == 0){
        wx.navigateBack({
          delta: 1,
        })
      }
    })
    
  },


  




})