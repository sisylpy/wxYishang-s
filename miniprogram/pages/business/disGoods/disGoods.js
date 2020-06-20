// pages/business/catalogue/catalogue.js
import apiUrl from '../../../config.js'
import { getCommunityGoods, uploadDownGoods } from '../../../lib/apiBusiness.js'
const globalData = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    totalPage: 0,
    totalCount: 0,
    limit: 21,
    currentPage: 1,
    isLoading: false,
    abc:[
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],

   show: false,
  //  item:{
  //    "nxGoodsEntity.nxGoodsName": "西兰花",

  //  },

    applyArr: [],
    goodsList:[],



  },

  onShow:function(){
    // this._initData()

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
    })

    this.setData({
      fatherId: options.fatherId,
      fatherName: options.fatherName,
    })
    
    this._initData()
   
  },

  _initData(){

    var data = {
      limit: this.data.limit,
      page: this.data.currentPage,
      fatherId: this.data.fatherId,
      communityId: 1,
    }

    getCommunityGoods(data).
      then(res => {
        if (res) {
          console.log(res.result.page.list)
          this.setData({
            totalPage: res.result.page.totalPage,
            totalCount: res.result.page.totalCount,
            goodsList: res.result.page.list,
          })
        }
      })



      
  },

  getRemark: function(e){
    
    console.log(e);


  },

  // onReachBottom  onPullDownRefresh
  onReachBottom: function () {
    console.log("000000")
    let { currentPage, totalPage, isLoading } = this.data
    console.log(currentPage)
    console.log(totalPage)

    if (currentPage >= totalPage || isLoading) {
      console.log("coming??")
      return
    }
    this.setData({
      isLoading: true
    })


    // let { limit, fatherId } = this.data
    // currentPage = currentPage + 1;
    console.log("4444")
    var data = {
      limit: this.data.limit,
      page: this.data.currentPage + 1,
      fatherId: this.data.fatherId, 
    }
    console.log("11111111")
    getGoodsByFatherId(data)
      .then((res) => {
        console.log("onReachBottom")
        wx.hideLoading()
        if (typeof cb === 'function') {
          cb()
        }
        if (res.result) {
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
      })
  },

  addGoods: function(e){
    console.log(e)
    this.setData({
      show: true,
      item: e.currentTarget.dataset.item

    })

  },
  confirm:function(e){
    console.log(e);
    console.log("disGoods")

    var price = e.detail.price;
    var decimal = "";
    if (price.indexOf(".") != -1) {
      var temPrice = price.split('.')
      var price = temPrice[0];
      var decimal = temPrice[1];

    } else {
      decimal = 0;
    }

   console.log(this.data.item)
    var disGoodsId = this.data.item.disGoodsId;
    var dg = {
      disGoodsId: disGoodsId,
      dgGoodsPrice: price,
      dgGoodsPriceDecimal: decimal,
      dgStandardList: e.detail.standList,
    };

    uploadDownGoods(dg)
      .then(res => {
        if (res) {
          console.log(res)
          this._initData()

        }
      })

    

  },
  



})