// pages/business/catalogue/catalogue.js
import apiUrl from '../../../config.js'
import {
  disGetIbookGoods,
  downDisGoods,
  saveStandard,
  updateStandard,
  getStandardList,
  deleteStandard,
  queryGoodsByQuickSearch
} from '../../../lib/apiibook.js'
const globalData = getApp().globalData;
var load = require('../../../lib/load.js');

Page({

  onShow(){
    if(this.data.fatherId){
      this._initData();
    }

  },
  /**
   * 页面的初始数据
   */
  data: {
    totalPage: 0,
    totalCount: 0,
    limit: 20,
    currentPage: 1,
    isLoading: false,
    url: apiUrl.server,
    addStandard: false,

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

    wx.setNavigationBarColor({
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
      if (res.result.code == 0) {
        load.hideLoading();
        this.setData({
          totalPage: res.result.page.totalPage,
          totalCount: res.result.page.totalCount,
          goodsList: res.result.page.list,
        })

        //创建节点选择器
        var that = this;
        var query = wx.createSelectorQuery();
        //选择id
        query.select('#mjltest').boundingClientRect()
        query.exec(function (res) {
          that.setData({
            maskHeight: res[0].height * globalData.rpxR
          })
        })
      } else {
        load.hideLoading();
        wx.showToast({
          title: '获取商品失败',
          icon: 'none'
        })
      }
    })
  },


  // onReachBottom  onPullDownRefresh
  onReachBottom: function () {
    console.log("000000")
    let {
      currentPage,
      totalPage,
      isLoading
    } = this.data


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
      disId: this.data.disId,
    }
    load.showLoading("获取商品中")
    disGetIbookGoods(data)
      .then((res) => {
        wx.hideLoading()

        if (res.result.code == 0) {
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

            //创建节点选择器
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
        } else {
          load.hideLoading();
          wx.showToast({
            title: '获取商品失败',
            icon: 'none'
          })
        }
      })
  },

  downloadGoods: function (e) {

    this.setData({
      item: e.currentTarget.dataset.item,
      itemIndex: e.currentTarget.dataset.index,
    })
    //1,
    var greatGrand = wx.getStorageSync('greatGrandFather');
    console.log(greatGrand)
    var greatGrandId = "";
    var greatGrandName = "";
    if (greatGrand) {
      greatGrandId = greatGrand.greatGrandId;
      greatGrandName = greatGrand.greatGrandName;
    }
    //2,
    var grand = wx.getStorageSync('grandFather');
    var grandId = "";
    var grandName = "";
    console.log(grand)
    if (grand) {
      grandId = grand.grandId;
      grandName = grand.grandName;
      // grandImg = grand.grandImg;
    }


    var dg = {
      nxDgDistributerId: this.data.disId,
      nxDgNxGoodsId: this.data.item.nxGoodsId,
      nxDgGoodsName: this.data.item.nxGoodsName,
      nxDgNxFatherId: this.data.fatherId,
      nxDgNxFatherImg: this.data.fatherImg,
      nxDgNxFatherName: this.data.fatherName,
      nxDgGoodsDetail: this.data.item.nxGoodsDetail,
      nxDgGoodsStandardname: this.data.item.nxGoodsStandardname,
      nxDgGoodsPinyin: this.data.item.nxGoodsPinyin,
      nxDgGoodsPy: this.data.item.nxGoodsPy,
      nxDgNxGrandId: grandId,
      nxDgNxGrandName: grandName,
      nxDgNxGreatGrandId: greatGrandId,
      nxDgNxGreatGrandName: greatGrandName,
      nxDgPullOff: 0,
      nxStandardEntities: this.data.item.nxGoodsStandardEntities


    };
    load.showLoading("保存商品")
    downDisGoods(dg)
      .then(res => {
        if (res.result.code == 0) {
          load.hideLoading();

          console.log(res)
          var itemIndex = this.data.itemIndex;
          var item = this.data.goodsList[itemIndex];
          var up = "goodsList[" + itemIndex + "].isDownload"
          this.setData({
            [up]: 1,
          })
        } else {
          load.hideLoading();
          wx.showToast({
            title: '获取商品失败',
            icon: 'none'
          })
        }
      })
  },


  /**
   * 点击+
   * @param {} e 
   */
  addStandard: function (e) {
    this.setData({
      itemStandard: "",
      editStandard:false,
      standardName: "",
      item: e.currentTarget.dataset.item,
      index: e.currentTarget.dataset.index,
      showAdd: true,
      depGoodsName: e.currentTarget.dataset.item.nxGoodsName,
    })
  },

  /**
   * 点击订货单位
   * @param {*} e 
   */
  clickStandard(e) {
    this.setData({
      showStandard: true,
      showOperation: true,
      index: e.currentTarget.dataset.index,
      item: e.currentTarget.dataset.item,
      depGoodsName: e.currentTarget.dataset.name,
      standardName: e.currentTarget.dataset.standardname,
      itemStandard: e.currentTarget.dataset.standard,
    })
  },

  /**
   * 规格弹窗点击确认
   * @param {*} e 
   */
  confirmStandard: function (e) {
    if (this.data.editStandard) {
      this._updateStandard(e);
    } else {
      this._saveStandard(e);
    }
    this.setData({
      standardName: "",
      depGoodsName: "",
      itemStandard: "",
      editStandard: false,
      showStandard: false,
    })

  },

  _updateStandard(e) {

    var data = {
      nxStandardId: this.data.itemStandard.nxStandardId,
      nxStandardName: e.detail.standardName,
    }
    load.showLoading("更新规格")
    updateStandard(data).
    then(res => {
      if (res) {
        console.log(res)
        load.hideLoading();
        this._updateGoods();
      } else {
        load.hideLoading();
        wx.showToast({
          title: '更新规格失败',
          icon: 'none'
        })
      }
    })
  },


  /**
   * 保存规格
   * @param {*} e 
   */
  _saveStandard(e) {
    var data = {
      nxSGoodsId: this.data.item.nxGoodsId,
      nxStandardName: e.detail.standardName,
    }
    saveStandard(data).
    then(res => {
      if (res.result.code == 0) {
        var standardlist = this.data.goodsList[this.data.index].nxGoodsStandardEntities;
        standardlist.push(res.result.data);
        var up = "goodsList[" + this.data.index + "].nxGoodsStandardEntities"
        this.setData({
          [up]: standardlist,
        })
      } else {
        load.hideLoading();
        wx.showToast({
          title: '获取商品失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 弹窗获取页面高度
   * @param {*} e 
   */
  getFocus(e) {
    var height = e.detail.myHeight;
    this.setData({
      myHeight: (globalData.windowHeight - height) * globalData.rpxR
    })
  },


  /**
   * 关闭操作面板
   */
  hideMask() {
    this.setData({
      showOperation: false,
      // standardName: "",
      // depGoodsName: "",
      // itemStandard: "",
      // item: "",
      
      // editStandard: false,
    })
  },

  /**
   * 取消 按钮
   */
  cancle() {
    this.setData({
      standardName: "",
      depGoodsName: "",
      itemStandard: "",
      item: "",
      editStandard: false,
    })
  },

  /**
   * 点击订货单位后，选择-“修改”
   * todo
   */
  edit() {
    this.setData({
      showAdd: true,
      editStandard: true,
      showOperation: false
    })
  },

  /**
   * 点击订货单位后，选择-“删除”
   * todo
   */
  delete() {
    var depStandardId = this.data.itemStandard.nxStandardId;
    deleteStandard(depStandardId).then(res => {
      if (res.result.code == 0) {
        this._updateGoods();
      } else {
        wx.showToast({
          title: res.result.msg,
          icon: 'none'
        })
      }
    })
  },


  _updateGoods() {
    console.log("update.......")
    getStandardList(this.data.item.nxGoodsId).then(res => {
      console.log(res)
      if (res.result.code == 0) {
        console.log(this.data.index + "this.data.index");
        var up = "goodsList[" + this.data.index + "].nxGoodsStandardEntities"
        this.setData({
          [up]: res.result.data,
          standardName: "",
          depGoodsName: "",
          itemStandard: "",
          item: "",
          editStandard: false,
        })
      } else {

      }
    })
  },





  /**
   * 打开添加新商品页面
   */
  toAdd() {
    wx.navigateTo({
      url: '../addNxGoods/addNxGoods?fatherId=' + this.data.fatherId,
    })

  },
  editGoods(e){
    wx.navigateTo({
      url: '../addNxGoods/addNxGoods?nxGooodsId=' +  e.currentTarget.dataset.id + '&editGoods=true',
    })
  },

  // 

  getSearchString(e){
    console.log(e.detail.value)
    this.setData({
      isSearching: true,
    })

    if(e.detail.value.length > 0) {

      queryGoodsByQuickSearch(e.detail.value).then(res =>{
        if(res.result.code == 0){
          if(res.result.data.length > 0){
            this.setData({
              searchArr: res.result.data,
            })
          }else{
            this.setData({
              searchArr: [],
              isSearching:false
            })
          }
        }
      })
    }else{
      this.setData({
        searchArr: [],
        isSearching:false
      })
    }
   

  },






})