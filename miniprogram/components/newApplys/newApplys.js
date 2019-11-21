// components/newApplys/newApplys.js
const globalData = getApp().globalData;
import { changeApplysToMarketPurchase } from '../../lib/apiOrder.js'
var load = require('../../lib/load.js');

var _animation; // 动画实体

const _ANIMATION_TIME = 300; // 动画播放一次的时长ms

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    newApplys: {
      type: Array,
      value: ''
    }, 
     
  },

  /**
   * 组件的初始数据
   */
  data: {
    operationAnimation: '',

  },

  ready: function () {
    // _animation = wx.createAnimation({
    //   duration: _ANIMATION_TIME,
    //   timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
    //   delay: 0,
    //   transformOrigin: '50% 50% 0'
    // })

    _animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: 0
    });
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR
    })


  },
  /**
   * 组件的方法列表
   */
  methods: {

//点击商品后面的小点，从底部弹出操作按钮页面
    operateGoods: function(e) {
      console.log(e);
      var index = e.currentTarget.dataset.index;
      var goodsIndex = e.currentTarget.dataset.goodsindex;
      var applys = this.data.newApplys[index].goodsList[goodsIndex].applys;
     this.setData({
       applys: applys
     })
      
      this._animationShow();
     
    },
    
    _animationShow: function(){
      var height = -240;
      _animation.translate(0, height / 750 * this.data.windowWidth).step()
      this.setData({
        ani: _animation.export(),
      })
    },
    _animationHide: function () {
      console.log("hide....")
      var height = 240;
      _animation.translate(0, height / 750 * this.data.windowWidth).step()
      this.setData({
        ani: _animation.export(),
      })
    },

    //点击操作按钮“市场采购”
  marketPurchase: function (e) {
    var that = this;
    load.showLoading("获取数据中")
      var data = this.data.applys
      changeApplysToMarketPurchase(data)
        .then(res => {
          load.hideLoading();
          console.log(res)

          if (res.result.code == 0) {
            that._animationHide();
            this.triggerEvent("getTodayApplys")

          }
        })


    },

  },






})
