var load = require('../../lib/load.js');

var _animation; // 动画实体

const _ANIMATION_TIME = 300; // 动画播放一次的时长ms
const globalData = getApp().globalData;
var app = getApp()

let windowWidth = 0;
let itemWidth = 0;

import apiUrl from '../../config.js'
import {
  disGetTodayOrderCustomer,
  indexData,
  disGetToPlanPurchaseGoods,
  savePlanPurchase,
  disGetPurchaseGoods,
  getPurchaseGoodsAndPurchaseBatch,
  disGetAllCustomer
} from '../../lib/apiDepOrder.js'


import {
  getDisInfoByUserId,
} from '../../lib/apiBasic'

Page({

  /**
   * 页面的初始数
   */
  data: {
    itemIndex: 0,
    purItemIndex: 0,
    showmymodal: false,
    showBuyer: false,
    showPicker: false,
    showCustomer: false,
    pickAnimation: '',
    outAnimation: '',
    changeFirst: false,
    secondItemIndex: 0,

    indicatorDots: false,
    autoplay: false,
    interval: 2000,
    duration: 400,

    openIndex: "",
    limit: 200,
    page: 1,
    showIndex: -1,

    oneName: "添加客户",
    oneUrl: "../../images/logo.jpg",
    twoName: "微信进货",
    twoUrl: "../../images/logo.jpg",
    threeName: "客户下单",
    threeUrl: "../../images/add.jpg",

    // 
    sliderOffset: 0,
    sliderOffsets: [],
    sliderLeft: 0,
    tabs:["订单","上货","客户","我"],
    tab1Index:0,



  },



  onShow: function () {
    _animation = wx.createAnimation({
      duration: _ANIMATION_TIME,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50% 0'
    })

    
    if (this.data.itemIndex == 0) {
      this._getTodayCustomer();
    }
    if (this.data.itemIndex == 1) {
      this._getPlanPurchaseGoods();
    }
    if (this.data.itemIndex == 2) {
      this._getMyCustomer();
    }
   



  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // var value = wx.getStorageSync('disInfo');
    // if (value) {
    //   this.setData({
    //     disInfo: value,
    //     // disId: value.nxDistributerEntity.nxDistributerId,
    //     disName: value.nxDistributerEntity.nxDistributerName,
    //   })
    // }
    getDisInfoByUserId(1).then(res => {
      if (res) {
        console.log(res);
        wx.setStorageSync('disInfo', res.result.data)
        globalData.disId = res.result.data.nxDistributerEntity.nxDistributerId

      }
    })
    this.setData({
      disUserId: options.userId,

      disId: 1,
      disName: "经贸配送1",
    })

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      url: apiUrl.server,

    })
    var now = new Date();
    var day = now.getDay();
    var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    var week = weeks[day];
    var date = now.getDate();
    this.setData({
      week: week,
      date: date,
    })
    // this._getIndexPageData();
    this._getTodayCustomer();
    // this._getPlanPurchaseGoods();
   
    this.clueOffset();

  },
// //////////

  /**
   * 计算偏移量
   */
  clueOffset(){
    var that = this;



    wx.getSystemInfo({
      success: function (res) {
        itemWidth = Math.ceil(res.windowWidth / that.data.tabs.length);
        let tempArr = [];
        for (let i in that.data.tabs){
          console.log(i)
          tempArr.push(itemWidth*i);
        }
        // tab 样式初始化
        windowWidth = res.windowWidth;
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - 50) / 2,
          sliderOffsets: tempArr,
          sliderOffset: 0,
          sliderLeft: 0,
        });
      }
    });
  },

  /**
   * tabItme点击
   */
  onTab1Click(event){
    let index = event.currentTarget.dataset.index;
    this.setData({
      sliderOffset: this.data.sliderOffsets[index],
      tab1Index: index,
    })
  },

  /**
   * swiper-item 的位置发生改变
   */
  swiperTran(event){
    
    let dx = event.detail.dx;
    let index = event.currentTarget.dataset.index;
    if(dx>0){ //----->
       if(index<this.data.tabs.length-1){   //最后一页不能---->
          let ratio = dx/windowWidth;   /*滑动比例*/
          let newOffset = ratio*itemWidth+this.data.sliderOffsets[index];
          // console.log(newOffset,",index:",index);
         this.setData({
           sliderOffset: newOffset,
         })
       } 
    }else{  //<-----------
      if (index > 0) {    //最后一页不能<----
        let ratio = dx / windowWidth;   /*滑动比例*/
        let newOffset = ratio * itemWidth + this.data.sliderOffsets[index];
        console.log(newOffset, ",index:", index);
        this.setData({
          sliderOffset: newOffset,
        })
      }
    }

  },

  /**
   * current 改变时会触发 change 事件
   */
  swiperChange(event){
    // this.setData({
    //   sliderOffset: this.data.sliderOffsets[event.detail.current],
    //   tab1Index: event.detail.current,
    // })
  },
  /**
   * 动画结束时会触发 animationfinish 事件
   */
  animationfinish(event){
    this.setData({
      sliderOffset: this.data.sliderOffsets[event.detail.current],
      tab1Index: event.detail.current,
    })


    this.setData({
      tab1Index: event.detail.current
    });
    if (this.data.tab1Index == 1) {
      this._getPlanPurchaseGoods();
    }
    if (this.data.tab1Index == 2) {
      this._getMyCustomer();
    }
    if (this.data.tab1Index == 0) {
      this._getTodayCustomer();
    }
  },


  // /////

  _getMyCustomer() {
    load.showLoading("获取客户中")
    disGetAllCustomer(this.data.disId).then(res => {
      if (res) {
        load.hideLoading();

        console.log(res.result.data)
        this.setData({
          myCustomerArr: res.result.data
        })
      }
      load.hideLoading();

    })

  },


  _getTodayCustomer() {
    load.showLoading("获取今天订单中")
    disGetTodayOrderCustomer(this.data.disId).then(res => {
      if (res) {
        load.hideLoading();

        console.log(res.result.data);
        this.setData({
          customerArr: res.result.data,
        })
        if (res.result.data.length > 0) {
          this.setData({
            showCustomer: true,
          })
        }
      }
      load.hideLoading();

    })

  },

  _getPlanPurchaseGoods() {
    load.showLoading("获取进货商中")
    disGetToPlanPurchaseGoods(this.data.disId)
      .then(res => {
        console.log(res)
        if (res) {
          load.hideLoading();
          this.setData({
            planArr: res.result.data
          })
        }
        load.hideLoading();

      })
  },

  // 1, 进货单-获取进货单商品
  _getPurchaseGoods() {
    load.showLoading("获取数据中")
    getPurchaseGoodsAndPurchaseBatch(this.data.disId)
      .then(res => {
        console.log(res)
        if (res) {
          load.hideLoading();

          load.hideLoading();
          this.setData({
            purArr: res.result.data.goods,
            batchArr: res.result.data.batchs,
          })
        }
        load.hideLoading();

      })
  },
  _getIndexPageData: function () {

    //1，获取首页初始化数据

    load.showLoading("获取数据中")
    indexData(1)
      .then(res => {
        load.hideLoading();
        console.log(res)
        if (res.result.data.buyer.length > 0) {
          this.setData({
            buyerArr: res.result.data.buyer,
            showBuyer: true,

          })
        }
        if (res.result.data.picker.length > 0) {
          this.setData({
            pickerArr: res.result.data.picker,
            showPicker: true

          })
        }


        //初始化图片
        if (this.data.buyerArr.length > 0) {
          this.buyStartAnimationInterval(90);
        }
        if (this.data.pickerArr.length > 0) {
          this.pickStartAnimationInterval(90);
        }


      })
  },


  //点击出货单
  clickShowBuyer: function (e) {
    if (this.data.showBuyer) {
      this.buyStartAnimationInterval(0);
      this.setData({
        showBuyer: false
      })
    } else {
      this.buyStartAnimationInterval(90);
      this.setData({
        showBuyer: true
      })
    }
  },

  //点击拣货单
  clickShowPicker: function () {
    console.log("hai")
    if (this.data.showPicker) {
      this.pickStartAnimationInterval(0);
      this.setData({
        showPicker: false
      })
    } else {
      this.pickStartAnimationInterval(90);

      this.setData({
        showPicker: true
      })
    }

  },






  // // 滚动切换标签样式
  switchTab: function (e) {
    console.log(e)

    this.setData({
      itemIndex: e.detail.current
    });
    console.log(this.data.itemIndex);
    if (this.data.itemIndex == 1) {
      this._getPlanPurchaseGoods();
    }
    if (this.data.itemIndex == 2) {
      this._getMyCustomer();
    }
    if (this.data.itemIndex == 0) {
      this._getTodayCustomer();
    }

  },
  toIbook() {
    wx.navigateTo({
      url: '../business/ibookCover/ibookCover',
    })
  },



  switchSubTab: function (e) {
    this.setData({
      purItemIndex: e.detail.current
    });
  },

  // // 点击标题切换当前页时改变样式
  // swichNav: function (e) {
  //   var cur = e.target.dataset.current;
  //   if (this.data.currentTaB == cur) { return false; }
  //   else {
  //     this.setData({
  //       currentTab: cur
  //     })
  //   }
  // },




  /**
   * 打开店铺页面
   */
  toMyCustomer: function (e) {
    wx.navigateTo({
      url: '../restaurant/restaurantList/restaurantList',
    })
  },
  /**
   * 打开备货页面
   */
  toMyCode: function (e) {
    wx.navigateTo({
      url: '../restaurant/myCode/myCode',
    })
  },

  /**
   * 
   */
  toPayAndDeliverOrder: function (e) {
    wx.navigateTo({
      url: '../payAndDelivery/orderDepartment/orderDepartment?disId=' + this.data.distributerId,
    })
  },
  /**
   * 
   */
  toPickerPage: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '../weight/pickDepartment/pickDepartment?pickerUserId=' + e.currentTarget.dataset.id
    })
  },

  // toBuyerPage: function (e) {
  //   console.log(e);
  //   wx.navigateTo({
  //     url: '../buy/purchaseGoods/purchaseGoods?purchaseUserId=' + e.currentTarget.dataset.id
  //   })
  // },


  getCustomerOrder(e) {
    wx.navigateTo({
      url: '../payAndDelivery/issuePage/issuePage?depId=' + e.currentTarget.dataset.id,
    })

  },
  /**
   * 拣货单-图片旋转
   */
  pickStartAnimationInterval: function (angle) {
    _animation.rotate(angle).step()
    this.setData({
      pickAnimation: _animation.export()
    })
  },

  /**
   * 出货单-图片旋转
   */
  buyStartAnimationInterval: function (angle) {
    _animation.rotate(angle).step()
    this.setData({
      buyAnimation: _animation.export()
    })
  },


  setPrinter: function () {
    wx.navigateTo({
      url: '/pagesPicker/pIndex/pIndex',
    })
  },

  kanakn: function (e) {
    wx.navigateTo({
      url: '/pages/pur/purGoods/purGoods',
    })
  },

  toRestaurantList() {
    wx.navigateTo({
      url: '/pages/restaurant/restaurantList/restaurantList?id=' + this.data.distributerId,
    })
  },


  toChoicePrinter(e) {
    console.log("totootototo")
    wx.navigateTo({
      url: '../pSearchPrinter/pSearchPrinter',
    })
  },
  addMyCustomer() {
    wx.navigateTo({
      url: '../pagesRes/stepOne/stepOne',
    })

  },

  toOpenMyCustomer() {
    wx.navigateTo({
      url: '../customerList/customerList?disId=' + this.data.disId,
    })
  },


  



})