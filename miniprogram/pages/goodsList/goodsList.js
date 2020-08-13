

var app = getApp();

import {disGetGoodsList, disSaveStandard} from '../../lib/apiibook'

const globalData = getApp().globalData;
import apiUrl from '../../config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置

  },
  // 滚动切换标签样式
  switchTab: function (e) {
    console.log(e)
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    console.log(e);
    var cur = e.target.dataset.current;
    if (this.data.currentTab == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
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
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
    this.setData({
      // disId: globalData.userInfo.nxDistributerEntity.nxDistributerId,
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      disId: 1,
      url: apiUrl.server,
      grandId: options.id,
    })

    this._getInitData();
  },

  _getInitData(){
    var data = {
      nxDgDistributeId : this.data.disId,
      nxDgNxGoodsGrandId: this.data.grandId,
    }
    disGetGoodsList(data).then(res => {
      if(res){
        console.log(res);
        this.setData({
          goodsList: res.result.data
        })
      }
    })



  },

  // footerTap: app.footerTap,

  
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

  toDetail(e){
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?disGoodsId=' + e.currentTarget.dataset.id,
    })

  }




})