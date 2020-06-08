// pages/business/catalogue/catalogue.js
import apiUrl from '../../config.js'
import { getDistributerGoods, getGoodsInfo } from '../../lib/apiBusiness.js'
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
  //    "nxGoodsName": "西兰花",

  //  },
   // applyStandardName:"斤",
    applyArr: [],
    goodsList:[],



  },

  onShow:function(){
    var value = wx.getStorageSync("applyArr");
   if(value) {
     this.setData({
       applyArr: value,
       applyNumber: value.length,

     })
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
    })
    
    this._initData()
    this._getDataAndTime();

   
  },
  _initData() {

    var data = {
      limit: this.data.limit,
      page: this.data.currentPage,
      fatherId: this.data.fatherId,
      disId: 1,
    }

    getDistributerGoods(data).
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



  _getDataAndTime() {

    var date = new Date();
    var min = date.getMinutes();

    date.setMinutes(min + 30);

    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var hours = date.getHours();
    if (hours >= 0 && hours <= 9) {
      hours = "0" + hours;
    }
    var minutes = date.getMinutes();
    if (minutes >= 0 && minutes <= 9) {
      minutes = "0" + minutes;
    }
    var seconds = date.getSeconds();
    if (seconds >= 0 && seconds <= 9) {
      seconds = "0" + seconds;
    }
    var currentdatetime = date.getFullYear() + seperator1 + month + seperator1 + strDate +
      " " + hours + seperator2 + minutes +
      seperator2 + seconds;

    var currentdate = month + seperator1 + strDate;
    console.log(currentdate)
    this.setData({
      date: currentdate
    })
    wx.setNavigationBarTitle({
      title: currentdate + "价目表"
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
      disId: 1,
    }
    console.log("11111111")
    getDistributerGoods(data)
      .then((res) => {
        console.log("onReachBottom")
        wx.hideLoading()
        if (typeof cb === 'function') {
          cb()
        }
        if (res.result) {
          console.log(res.result)
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
    console.log(e.currentTarget.dataset.standard)
    
    var data = {
      goodsId: e.currentTarget.dataset.id,
      disId: 1,
    }

    getGoodsInfo(data)
      .then(res =>{
        if(res){
          console.log(res.result.data);
          this.setData({
            show: true,
            item: res.result.data,
            applyStandardName: e.currentTarget.dataset.standard,
            applyGoodsId: e.currentTarget.dataset.id

          })
        }
      })




   

  },


  


  changeStandard:function(e) {
    var apply = {
      goodsId: e.detail.applyGoodsId,
      applyNumber: e.detail.applyNumber,
      applyGoodsName: e.detail.applyGoodsName,
      applyRemark: e.detail.applyRemark,
      applyStandardName: e.detail.applyStandardName
    };
    this.setData({
      applyStandardName: e.detail.applyStandardName
    })
  },

  confirm:function(e){
    console.log(e);

    var apply = {
      nxOsGoodsId: e.detail.applyGoodsId,
      nxOsQuantity: e.detail.applyNumber,
      nxOsRemark: e.detail.applyRemark,
      nxOsStandard: e.detail.applyStandardName,
      nxOsPrice: e.detail.applyPrice,
      nxOsStandard: e.detail.goodsStandard,
      nxGoodsFatherId: e.detail.nxGoodsFatherId,
      nxGoodsEntity:{
        nxGoodsName: e.detail.applyGoodsName,
      }

    }
    var applyArr = this.data.applyArr;
    if(applyArr){      
      applyArr.push(apply);
      wx.setStorageSync("applyArr", applyArr);
      this.setData({
        applyArr: applyArr,
        applyNumber: applyArr.length,
      })
    }
    wx.navigateBack({
      delta: 1
    })
    

  },
  



})