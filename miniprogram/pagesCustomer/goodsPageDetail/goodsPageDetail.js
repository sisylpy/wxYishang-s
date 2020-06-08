// pagesCustomer/goodsPageDeatil/goodsPageDeatil.js


import apiUrl from '../../config.js'

const globalData = getApp().globalData;
import {
  getTemplate, saveEditItems, delateItem
} from '../../lib/apiCustomer.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectNumber: 0,
    edit: false,


  },
  onShow:function(){
   this._getData();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      nxTemplateId: options.nxTemplateId,
      url: apiUrl.server
    })

  var user =   wx.getStorageSync("userInfo");
  if(user){
    this.setData({
      user: user
    })
  }
  wx.setNavigationBarTitle({
    title:  '我的菜',
  })

    
  },

  _getData(){
    getTemplate(1)
      .then(res => {
        if (res) {
          console.log(res.result.data)
          this.setData({
            itemArr: res.result.data.nxOrderTemplateItemEntity,
            template: res.result.data,

          })
        }
      })
  },


// 
  editItem: function(e){
    var arr = this.data.itemArr;
    for(var i = 0; i < arr.length; i++){
      var edit = "itemArr["+ i +"].isEdit";
      var oneSelect = "itemArr[" + i + "].isSelected";
      this.setData({
        [edit]: true,
        [oneSelect]: false,
        showCar: false,

        edit: true, 
        selectNumber: 0     
      })

      wx.removeStorageSync("itemArr");

    }

  },

  selectOne: function (e) {
    var index = e.currentTarget.dataset.index;
    var oneSelect = "itemArr[" + index + "].isSelected";

    var item = this.data.itemArr[index];
    var amount = item.nxOtAmount;
    var newAmount = "itemArr[" + index + "].nxOtOrderAmount";
    
    var selectNumber = this.data.selectNumber;
    
    this.setData({
      [oneSelect]: true,
      [newAmount]: amount,
      selectNumber: selectNumber + 1
    })

  },


  showCar: function (e) {
    console.log(e);
    if (this.data.showCar) {
     
      this.setData({
        showCar: false,
      })
    } else {
      var itemArr = this.data.itemArr;
      var tempArr = [];
      for (var i = 0; i < itemArr.length; i++) {
        if (itemArr[i].isSelected) {
          var item = itemArr[i];
          tempArr.push(item);      
        }
      }
    
      this.setData({
        showCar: true,
        selectArr: tempArr

      })
    }
  },



  reduceItem: function (e) {
    var itemIndex = e.currentTarget.dataset.index;
    console.log(this.data.itemArr[itemIndex].nxDistributerGoodsEntity.dgGoodsMinWeight)

    var apply = "itemArr[" + itemIndex + "].nxOtOrderAmount";
    var number = this.data.itemArr[itemIndex].nxOtOrderAmount;
    if (number == this.data.itemArr[itemIndex].nxDistributerGoodsEntity.dgGoodsMinWeight) {
      wx.showToast({
        title: '不能小于起订量',
        icon: "none",
      })
      var index = e.currentTarget.dataset.index;
      var oneSelect = "itemArr[" + index + "].isSelected";
      var selectNumber = this.data.selectNumber;
      this.setData({
        [oneSelect]: false,
        selectNumber: selectNumber - 1,
      })

      //storage

      
    } else {

      this.setData({
        [apply]: (Number(number) - 0.1).toFixed(1),
      })
      wx.setStorageSync("itemArr", this.data.itemArr);

    }
  },

  addItem: function (e) {
    var itemIndex = e.currentTarget.dataset.index;
    var isEdit = this.data.itemArr[itemIndex].isEdit;
    if(isEdit){
      var otAmount = "itemArr[" + itemIndex + "].nxOtAmount";
      var otNumber = this.data.itemArr[itemIndex].nxOtAmount;
      this.setData({
        [otAmount]: (Number(otNumber) + 0.1).toFixed(1),
      })
    }else{
      var apply = "itemArr[" + itemIndex + "].nxOtOrderAmount";
      var number = this.data.itemArr[itemIndex].nxOtOrderAmount;
      this.setData({
        [apply]: (Number(number) + 0.1).toFixed(1),
      })
      wx.setStorageSync("itemArr", this.data.itemArr);
    }
    
  },
  // 
  delateItem:function(e){
    var index = e.currentTarget.dataset.index;
    var id = this.data.itemArr[index].nxOtItemId;
    delateItem(id)
     .then(res => {
       if(res) {
         console.log(res)
         this._getData();
         this.setData({
           edit: false
         })
       }
     })
    
    
  },

  addCarItem: function(e){
    var id = e.detail.id;

  },
  reduceCarItem: function(e){
    var id = e.detail.id;
    console.log(id);


  },
  saveCar: function(e){
   var itemArr = this.data.itemArr;
   
   for(var i = 0 ; i < itemArr.length; i++){
     if (itemArr[i].isSelected) {
       var value = wx.getStorageSync("applyArr");

       var item = itemArr[i];
       // 组装订货数据
       var apply = {
         nxOsGoodsId: item.nxDistributerGoodsEntity.dgGoodsId,
         nxOsQuantity: item.nxOtOrderAmount,
         nxOsStandard: item.nxDistributerGoodsEntity.nxGoodsEntity.nxGoodsStandardname,
         nxOsPrice: item.nxDistributerGoodsEntity.dgGoodsPrice,
         nxOsGoodsFatherId: item.nxDistributerGoodsEntity.dgGoodsFatherId,
         nxOsDisGoodsId: item.nxDistributerGoodsEntity.disGoodsId,
         nxGoodsEntity: {
           nxGoodsName: item.nxDistributerGoodsEntity.nxGoodsEntity.nxGoodsName,
           nxGoodsStandardName: item.nxDistributerGoodsEntity.nxGoodsEntity.nxGoodsStandardname,
         }
       }
       if(value){
         value.push(apply);
         wx.setStorageSync("applyArr", value);

       }else{
         console.log("new");
         console.log(apply)
         var arr = [];
         arr.push(apply);
         wx.setStorageSync("applyArr", arr);
       }
     }
   }
   wx.navigateBack({
     delta: 2
   })
   wx.removeStorageSync("itemArr");

  },


  addNewItem:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../addTemplateItem/addTemplateItem?id=' + id,
    })


},

  saveEditItems: function(e){
    var arr = this.data.itemArr;

    saveEditItems(arr)
     .then(res => {
       if(res) {
         console.log(res);
         this._getData();
         this.setData({
           edit: false
         })

       }
     })
  }







})