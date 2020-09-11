// miniprogram/pages/signe1/enterprisetype.js
const app = getApp()
const globalData = app.globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    second_height: 0,
    selected:false,
    items: [
      { name: '1', value: '餐馆'},
      { name: '2', value: '单位、学校、幼儿园食堂',},
      { name: '3', value: '生鲜超市' },
      { name: '4', value: '美食城' },
      { name: '5', value: '其它' },
    ]
  },

  radioChange: function (e) {
    console.log(e);
    this.setData({
      type:e.detail.value,
      selected:true
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
    })

  },


  toNext(){
    wx.navigateTo({
      url: '../stepTwo/stepTwo?type=' + this.data.type,
    })
   
   

  },





  








  
})