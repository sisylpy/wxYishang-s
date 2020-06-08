// pages/business/catalogue/catalogue.js
import apiUrl from '../../config.js'
import { getDistributerGoods } from '../../lib/apiBusiness.js'
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
    showCar: false,
    applyArr: [],
    goodsList:[],
    fatherId: 111,
    show: false,
    showOne: false,
    index: 0,
    state: 0,



  },

  onShow:function(){
    var index = this.data.index;
    var state = this.data.state;
    var amount = this.data.selectAmount;
    if(index > 0 && state ==1) {
      console.log("you gegnxin")
      var isSelect = "goodsList[" + index +"].isSelected";
      var amount = "goodsList["+ index +"].dgGoodsOrderAmount";
      this.setData({
        [isSelect]: true,
        state: 0,
        index: 0,
        [amount]:amount
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
      digitBoardHeight: globalData.digitBoardHeight * globalData.rpxR
    })

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#20afb8',
      animation: {
        duration: 200,
        timingFunc: 'easeIn'
      }
    })
    this.setData({
      // fatherId: options.fatherId,
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

  

  // onReachBottom  onPullDownRefresh
  onReachBottom: function () {
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




  

  showGoodsPage: function(e){
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;

    this.setData({
      index: index
    })
  
    if (type == 0){
      wx.navigateTo({
        url: '../zeroGoodsPage/zeroGoodsPage?disGoodsId=' + id + '&name=' + name,
      })
    }else if(type == 1){
      wx.navigateTo({
        url: '../oneGoodsPage/oneGoodsPage?disGoodsId=' + id +'&name='+name,
      })
    }
  },

 


})