// pages/business/catalogue/catalogue.js
import apiUrl from '../../../config.js'
import { 
  getIbookGoodsByFatherId, 
  downGoods,
  saveStandard,
  getStandardList
  } from '../../../lib/apiibook.js'
const globalData = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {

    totalPage: 0,
    totalCount: 0,
    limit: 5,
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
      disId: 1,
    }

    getIbookGoodsByFatherId(data).
      then(res => {
        if (res) {
          this.setData({
            totalPage: res.result.page.totalPage,
            totalCount: res.result.page.totalCount,
            goodsList: res.result.page.list,

          })
        }
      })




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

    var data = {
      limit: this.data.limit,
      page: this.data.currentPage + 1,
      fatherId: this.data.fatherId,
      disId: 1,
    }
    getIbookGoodsByFatherId(data)
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

  downloadGoods: function (e) {
    console.log(e)
    
    // wx.navigateTo({
    //   url: '../newModelPage/newModelPage',
    // })
    this.setData({
      show: true,
      item: e.currentTarget.dataset.item,
      itemIndex: e.currentTarget.dataset.index,
    })
  },


  confirm: function (e) {

 console.log(e);

    var price = e.detail.price;
    var decimal = "";
    if (price.indexOf(".") != -1 ){
      var temPrice = price.split('.')
      var price = temPrice[0];
      var decimal = temPrice[1];

    }else{
        decimal = 0;
    }
   
    var dg = {
      dgDistributeId: 1,
      dgGoodsId: this.data.item.nxGoodsId,
      
      dgGoodsFatherSort: this.data.sort,
      dgGoodsFatherName: this.data.fatherName,
      dgGoodsFatherId: this.data.fatherId,
      dgGoodsFatherImg: this.data.fatherImg,
      dgGoodsPrice: price,
      dgGoodsPriceDecimal : decimal,
      dgStandardList: this.data.item.nxGoodsStandardEntities,
      dgGoodsFatherColor: this.data.color,
      dgGoodsFilePath: this.data.item.nxGoodsFile,

    };

    downGoods(dg)
    .then(res => {
      if(res) {
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