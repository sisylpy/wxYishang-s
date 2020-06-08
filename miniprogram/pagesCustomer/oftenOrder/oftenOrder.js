
import apiUrl from '../../config.js'
import userTime from '../../lib/userTime.js'
const globalData = getApp().globalData;
import {
  dgCataList
} from '../../lib/apiBusiness.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showmymodal: false,
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    search: false, // 
    firstItem: false, //是否显示第一个
    isblur: false, //搜索页面键盘是否关闭
    applystandard: "",
    goodsamount: "",
    oftenGoods:[
      {
        "fatherName": "根茎类",
        "goodsList": [
          {
            "nxGoodsName": "土豆",
            "nxOrderNumber": "2",
            "nxOrderStandardName" : "个",
            "nxOrderDate": '03-21',
            "nxOrderRemark": "要大的"
          },
          {
            "nxGoodsName": "土豆",
            "nxOrderNumber": "2",
            "nxOrderStandardName": "个",
            "nxOrderDate": '03-21',
            "nxOrderRemark": "要大的"
          },
          {
            "nxGoodsName": "土豆",
            "nxOrderNumber": "2",
            "nxOrderStandardName": "个",
            "nxOrderDate": '03-21',
            "nxOrderRemark": "要大的"
          },
          
        ],
      },
      {
        "fatherName": "叶菜类",
        "goodsList": [
          {
            "nxGoodsName": "菠菜",
            "nxOrderNumber": "1",
            "nxOrderStandardName": "捆",
            "nxOrderDate": '03-23',
            "nxOrderRemark": ""
          },
          {
            "nxGoodsName": "菠菜",
            "nxOrderNumber": "1",
            "nxOrderStandardName": "捆",
            "nxOrderDate": '03-23',
            "nxOrderRemark": ""
          },
          {
            "nxGoodsName": "菠菜",
            "nxOrderNumber": "1",
            "nxOrderStandardName": "捆",
            "nxOrderDate": '03-23',
            "nxOrderRemark": ""
          },
          {
            "nxGoodsName": "菠菜",
            "nxOrderNumber": "1",
            "nxOrderStandardName": "捆",
            "nxOrderDate": '03-23',
            "nxOrderRemark": ""
          },

        ],
      },
      {
        "fatherName": "葱姜蒜椒",
        "goodsList": [
          {
            "nxGoodsName": "土豆",
            "nxOrderNumber": "2",
            "nxOrderStandardName": "个",
            "nxOrderDate": '03-21',
            "nxOrderRemark": "要大的"
          },
          {
            "nxGoodsName": "土豆",
            "nxOrderNumber": "2",
            "nxOrderStandardName": "个",
            "nxOrderDate": '03-21',
            "nxOrderRemark": "要大的"
          },
          {
            "nxGoodsName": "土豆",
            "nxOrderNumber": "2",
            "nxOrderStandardName": "个",
            "nxOrderDate": '03-21',
            "nxOrderRemark": "要大的"
          },

        ],
      },
      {
        "fatherName": "鲜菌类",
        "goodsList": [
          {
            "nxGoodsName": "菠菜",
            "nxOrderNumber": "1",
            "nxOrderStandardName": "捆",
            "nxOrderDate": '03-23',
            "nxOrderRemark": ""
          },
          {
            "nxGoodsName": "菠菜",
            "nxOrderNumber": "1",
            "nxOrderStandardName": "捆",
            "nxOrderDate": '03-23',
            "nxOrderRemark": ""
          },
          {
            "nxGoodsName": "菠菜",
            "nxOrderNumber": "1",
            "nxOrderStandardName": "捆",
            "nxOrderDate": '03-23',
            "nxOrderRemark": ""
          },
          {
            "nxGoodsName": "菠菜",
            "nxOrderNumber": "1",
            "nxOrderStandardName": "捆",
            "nxOrderDate": '03-23',
            "nxOrderRemark": ""
          },

        ],
      },
      {
        "fatherName": "鱼类",
        "goodsList": [
          {
            "nxGoodsName": "土豆",
            "nxOrderNumber": "2",
            "nxOrderStandardName": "个",
            "nxOrderDate": '03-21',
            "nxOrderRemark": "要大的"
          },
          {
            "nxGoodsName": "土豆",
            "nxOrderNumber": "2",
            "nxOrderStandardName": "个",
            "nxOrderDate": '03-21',
            "nxOrderRemark": "要大的"
          },
          {
            "nxGoodsName": "土豆",
            "nxOrderNumber": "2",
            "nxOrderStandardName": "个",
            "nxOrderDate": '03-21',
            "nxOrderRemark": "要大的"
          },

        ],
      },
      {
        "fatherName": "肉类",
        "goodsList": [
          {
            "nxGoodsName": "菠菜",
            "nxOrderNumber": "1",
            "nxOrderStandardName": "捆",
            "nxOrderDate": '03-23',
            "nxOrderRemark": ""
          },
          {
            "nxGoodsName": "菠菜",
            "nxOrderNumber": "1",
            "nxOrderStandardName": "捆",
            "nxOrderDate": '03-23',
            "nxOrderRemark": ""
          },
          {
            "nxGoodsName": "菠菜",
            "nxOrderNumber": "1",
            "nxOrderStandardName": "捆",
            "nxOrderDate": '03-23',
            "nxOrderRemark": ""
          },
          {
            "nxGoodsName": "菠菜",
            "nxOrderNumber": "1",
            "nxOrderStandardName": "捆",
            "nxOrderDate": '03-23',
            "nxOrderRemark": ""
          },

        ],
      },

     
      
    ]


  },


  /**
   * 滚动切换标签样式
   */
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current,
      value: "",
      isblur: false,
      cateid: 1,
      catename: "genjing",
    });
    this.checkCor();
    this.checkSearch(e);
  },

  
  /**
   * 点击标题切换当前页时改变样式
   */
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  /**
   * 判断当前滚动超过一屏时，设置tab标题滚动条。
   */
  checkCor: function () {
    if (this.data.currentTab > 3) {
      this.setData({
        scrollLeft: 350
      })
    } else {
      this.setData({
        scrollLeft: 0
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
      nxCustomerUserId: 1,
    })

  },
  

  /**
   * 取消
   */
  cancel: function () {
    this.setData({
      hidden: true
    });
  },

  /**
   * 监听查询
   */
  tofirst: function (e) {
    this.setData({
      firstItem: true,
      typeName: "",
      searchlist: [],
      value: ""
    })
  },
  /**
   * 查询页面高度
   */
  blur: function (e) {
    this.setData({
      isblur: true,
    })
  },






})