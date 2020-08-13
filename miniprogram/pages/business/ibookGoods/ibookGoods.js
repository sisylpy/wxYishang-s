// pages/business/catalogue/catalogue.js
import apiUrl from '../../../config.js'
import { 
  disGetIbookGoods, 
  downDisGoods,
  saveStandard,
  getStandardList
  } from '../../../lib/apiibook.js'
const globalData = getApp().globalData;
var load = require('../../../lib/load.js');

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
    

    show: false,
   
    applyStandardName: "斤",
    applyArr: [],
    goodsList: [],
    url: apiUrl.server,
    addStandard: false,


  },

  onShow: function () {
    var addStandard = this.data.addStandard;
    var index = this.data.itemIndex;

    if (addStandard){
      console.log("save success");
      getStandardList(this.data.nxGoodsId)
        .then(res =>{
          if(res){
            console.log(res.result.data);
            var standardlist = this.data.goodsList[index].nxGoodsStandardEntities;
            // console.log(this.data.goodsList[index]);
            // standardlist.push(res.result.data);
            // console.log(standardlist);
            var up = "goodsList[" + index + "].nxGoodsStandardEntities"

            this.setData({
              [up]: res.result.data
            })
          }
        })

    }else{
      console.log("no save!")
    }
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
    })

    var value = wx.getStorageSync('userInfo');
    if (value) {

      this.setData({
        disId: value.nxDistributerEntity.nxDistributerId,
        userInfo: value,

      })

    
    }
    this.setData({
      fatherId: options.fatherId,
      fatherName: options.fatherName,
      fatherImg: options.img,
      color: options.color,
      sort: options.sort,
    })

    wx.setNavigationBarTitle({
      title: options.fatherName
    })
    
    wx.setNavigationBarColor ({
      frontColor: '#ffffff', 
      backgroundColor: options.color, 
      animation: { 
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  

    this._initData()

  },

  _initData() {

    var data = {
      limit: this.data.limit,
      page: this.data.currentPage,
      fatherId: this.data.fatherId,
      disId: this.data.disId,
    }
    load.showLoading("获取商品中")
    disGetIbookGoods(data).
      then(res => {
        if (res) {
          load.hideLoading();
          this.setData({
            totalPage: res.result.page.totalPage,
            totalCount: res.result.page.totalCount,
            goodsList: res.result.page.list,

          })
        }
        load.hideLoading();

      })




  },

 
  // onReachBottom  onPullDownRefresh
  onReachBottom: function () {
    console.log("000000")
    let { currentPage, totalPage, isLoading } = this.data
   

    if (currentPage >= totalPage || isLoading) {
      console.log("coming??")
      return
    }
    this.setData({
      isLoading: true
    })

    var data = {
      limit: this.data.limit,
      page: this.data.currentPage + 1,
      fatherId: this.data.fatherId,
      disId: 1,
    }
    load.showLoading("获取商品中")

    disGetIbookGoods(data)
      .then((res) => {
        wx.hideLoading()
        if (typeof cb === 'function') {
          cb()
        }
        if (res.result) {
          load.hideLoading();

          var goodsList = res.result.page.list;
          if (goodsList.length > 0) {
            var currentPage = this.data.currentPage; // 获取当前页码
            currentPage += 1; // 加载当前页面的下一页数据
            var now = this.data.goodsList;
            var newdata = now.concat(goodsList)
            this.setData({
              goodsList: newdata,
              currentPage,
              isLoading: false,
              totalPage: res.result.page.totalPage,
              totalCount: res.result.page.totalCount,
            })
          }
        }
        load.hideLoading();

      })
  },

  downloadGoods: function (e) {
    console.log(e)
    
    // wx.navigateTo({
    //   url: '../newModelPage/newModelPage',
    // })
    this.setData({
      item: e.currentTarget.dataset.item,
      itemIndex: e.currentTarget.dataset.index,
    })
    //1,
    var greatGrand = wx.getStorageSync('greatGrandFather');
    console.log(greatGrand)
    var greatGrandId = "";
    var greatGrandName = "";
    if(greatGrand){
      greatGrandId = greatGrand.greatGrandId;
      greatGrandName  = greatGrand.greatGrandName;
    }
//2,
var grand = wx.getStorageSync('grandFather');
    var grandId = "";
    var grandName = "";
    var grandImg = "";
    console.log(grand)
    if(grand){
      grandId = grand.grandId;
      grandName  = grand.grandName;
      grandImg = grand.grandImg;
    }
    
    console.log(greatGrandId)
    var dg = {
     
      nxDgDistributeId: this.data.disId,
      nxDgNxGoodsId: this.data.item.nxGoodsId,
      nxDgNxGoodsFatherId: this.data.fatherId,
      nxDgNxGoodsGrandId: grandId,
      nxDgNxGoodsFatherName: this.data.fatherName,
      nxDgNxGoodsFatherImg: this.data.fatherImg,
      nxDgGoodsName: this.data.item.nxGoodsName,
      nxDgGoodsDetail : this.data.item.nxGoodsDetail,
      nxDgGoodsStandardname: this.data.item.nxGoodsStandardname,
      nxDgGoodsPinyin: this.data.item.nxGoodsPinyin,
      nxDgGoodsPy: this.data.item.nxGoodsPy,
      nxDgGreatGrandFatherId: greatGrandId,
      nxDgGreatGrandFatherName: greatGrandName,
      nxDgGrandFatherName: grandName,
      nxDgGrandFatherImg: grandImg,
      nxStandardEntities: this.data.item.nxGoodsStandardEntities
      

    };
    load.showLoading("保存商品")
    downDisGoods(dg)
    .then(res => {
      if(res) {
        load.hideLoading();

        console.log(res)
        var itemIndex = this.data.itemIndex;
        var item = this.data.goodsList[itemIndex];
        var up = "goodsList[" + itemIndex + "].isDownload"
        this.setData({
          [up]: 1,
        })
      }
    })

  },



  addStandard: function(e){
    this.setData({
      // showAdd: true,
      nxGoodsId: e.currentTarget.dataset.id,
      item: e.currentTarget.dataset.item,
      itemIndex: e.currentTarget.dataset.index,

    })

    wx.navigateTo({
      url: '../newStandard/newStandard?id=' + e.currentTarget.dataset.id,
    })






  },

  confirmAdd: function(e){
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