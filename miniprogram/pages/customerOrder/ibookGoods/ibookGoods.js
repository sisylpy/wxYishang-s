// pages/business/catalogue/catalogue.js
import apiUrl from '../../../config.js'
import { 
  restrauntGetGoodsByFatherId, 
  saveStandard,
  getStandardList,
  
  } from '../../../lib/apiibook.js'
  // import {saveOrder,getDepGoodsInfo } from '../../../lib/apiRestraunt'
  import {saveOrder,getDepGoodsInfo  } from '../../../lib/apiRestruant'
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
    var value = wx.getStorageSync('depInfo');
    var userValue = wx.getStorageSync('userInfo');
    if(userValue){
      this.setData({
        userInfo: userValue
      })
    }
    if(value) {
      this.setData({
        depInfo: value,
      })
    }
  

    this._initData()

  },

  _initData() {

    var data = {
      limit: this.data.limit,
      page: this.data.currentPage,
      fatherId: this.data.fatherId,
    }

    restrauntGetGoodsByFatherId(data).
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

  purchaseGoods: function (e) {
    console.log(e)
    var data = {
      nxGoodsId: e.currentTarget.dataset.id,
      nxDepId: 2
    }
    getDepGoodsInfo(data).then(res =>{
      if(res) {
        console.log(res.result.data)
        this.setData({
          item: res.result.data
        })
      }
    })
    this.setData({
      show: true,
      item: e.currentTarget.dataset.item,
      applyStandardName: e.currentTarget.dataset.standard,
      selIndex: e.currentTarget.dataset.index,
    
    })
  },


  changeStandard:function(e) {
    console.log(e.detail.applyStandardName)
    
    this.setData({
      applyStandardName: e.detail.applyStandardName
    })
  },

  confirm: function (e) {

 console.log(e);   
 
    var dg = {
      nxDoNxGoodsId: e.detail.applyGoodsId,
      nxDoNxGoodsFatherId: e.detail.nxGoodsFatherId,
      nxDoQuantity: e.detail.applyNumber,
      nxDoStandard: e.detail.applyStandardName,
      nxDoRemark: e.detail.applyRemark,
      nxDoDepartmentId: this.data.depInfo.nxDepartmentId,
      nxDoDistributerId: this.data.depInfo.fatherDepartmentEntity.nxDepartmentDisId,
      nxDoDepartmentFatherId: this.data.depInfo.fatherDepartmentEntity.nxDepartmentId,
      nxDoOrderUserId: this.data.userInfo.nxDepartmentUserId,
      nxDoDepartmentGoodsId:  this.data.item.nxDepartmentGoodsId,
    };

    saveOrder(dg).then(res =>{
      if(res){
        console.log(res)
        var itemIndex = this.data.selIndex;
        var item = this.data.goodsList[itemIndex];
        var up = "goodsList[" + itemIndex + "].isDownload"
        this.setData({
          [up]: 1,
        })
      }
    })
    // downGoods(dg)
    // .then(res => {
    //   if(res) {
    //     console.log(res)
    //     var itemIndex = this.data.itemIndex;
    //     var item = this.data.goodsList[itemIndex];
    //     var up = "goodsList[" + itemIndex + "].isDownload"
    //     this.setData({
    //       [up]: 1,
    //     })
    //   }
    // })
  },

  addStandard: function(e){
    this.setData({
      showAdd: true,
      nxGoodsId: e.currentTarget.dataset.id,
      item: e.currentTarget.dataset.item,
      itemIndex: e.currentTarget.dataset.index,

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