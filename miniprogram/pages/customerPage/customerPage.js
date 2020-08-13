// pages/customerPage/customerPage.js
const globalData = getApp().globalData;

import apiUrl from '../../config.js'

let windowWidth = 0;
let itemWidth = 0;
import {disGetBills, } from '../../lib/apiDepOrder'

Page({

  /**
   * 页面的初始数据
   */
  data: {

    sliderOffset: 0,
    sliderOffsets: [],
    sliderLeft: 0,
    tabs:["送货单","送货单和账款","群部门","群用户"],
    tab1Index:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      url: apiUrl.server,
      depId: options.id,
      disId: 1,


    })
    this.clueOffset();
    this._getBills();


  },



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

      this._getBills();
    }
    if (this.data.tab1Index == 2) {
      // this._getMyCustomer();
    }
    if (this.data.tab1Index == 0) {
      // this._getTodayCustomer();
    }
  },


  // /////


 _getBills(){

  disGetBills(this.data.disId).then(res => {
    if(res){
      console.log(res);
      this.setData({
        billArr: res.result.data,
      })
    }
  })
 }





})