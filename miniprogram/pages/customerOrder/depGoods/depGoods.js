// pagesOrder/depGoods/depGoods.js


import {getDepGoodsByOrderTime, saveOrderArr} from '../../../lib/apiRestruant'
import apiUrl from '../../../config'
const globalData = getApp().globalData;
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectNumber: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#1e82b4',
      animation: {
        duration: 200,
        timingFunc: 'easeIn'
      }
    })

    wx.setNavigationBarTitle({
      "title": "前厅订货商品",
    })
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      url: apiUrl.server,
    })


    var value = wx.getStorageSync('depInfo');
    if(value){
      this.setData({
        depInfo: value,
      })
    }
    var user = wx.getStorageSync('userInfo');
    if(user){
      this.setData({
        userInfo: user,
      })
    }

    var data = {
      nxDgDepartmentId: 2,
      nxDgNxGoodsFatherId: options.fatherGoodsId
    }
    var data = {
      nxDgDepartmentId: 2,
      nxDgNxGoodsFatherId: 111
    }

    getDepGoodsByOrderTime(6).then(res => {
      if(res) {
        console.log(res.result.data)
        this.setData({
          itemArr: res.result.data,
        })
      }
    })

  },
// 


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
  console.log(e);
  var index = e.currentTarget.dataset.index;
  var goodsIndex = e.currentTarget.dataset.goodsindex;

  var oneSelect = "itemArr[" + index + "].depGoods[" + goodsIndex + "].isSelected";

  var goodsItem = this.data.itemArr[index].depGoods[goodsIndex];
  console.log(goodsItem);
  var quantity = goodsItem.nxDgOrderQuantity;
  var standard = goodsItem.nxDgOrderStandard;
  var editQuantity = "itemArr[" + index + "].depGoods[" + goodsIndex + "].nxDgOrderEditQuantity";
  var editStandard = "itemArr[" + index + "].depGoods[" + goodsIndex + "].nxDgOrderEditStandard";
  var editRemark = "itemArr[" + index + "].depGoods[" + goodsIndex + "].nxDgOrderEditRemark";
  var selectNumber = this.data.selectNumber;
  
  this.setData({
    [oneSelect]: true,
    [editQuantity]: quantity,
    [editStandard]: standard,
    selectNumber: selectNumber + 1
  })

},
delOne(e){
  console.log(e);
  var index = e.currentTarget.dataset.index;
  var goodsIndex = e.currentTarget.dataset.goodsindex;

  var oneSelect = "itemArr[" + index + "].depGoods[" + goodsIndex + "].isSelected";

  var goodsItem = this.data.itemArr[index].depGoods[goodsIndex];
  console.log(goodsItem);
  // var quantity = goodsItem.nxDgOrderQuantity;
  // var standard = goodsItem.nxDgOrderStandard;
  var editQuantity = "itemArr[" + index + "].depGoods[" + goodsIndex + "].nxDgOrderEditQuantity";
  var editStandard = "itemArr[" + index + "].depGoods[" + goodsIndex + "].nxDgOrderEditStandard";
  // var editRemark = "itemArr[" + index + "].depGoods[" + goodsIndex + "].nxDgOrderEditRemark";
  var selectNumber = this.data.selectNumber;
  
  this.setData({
    [oneSelect]: false,
    [editQuantity]: null,
    [editStandard]: null,
    selectNumber: selectNumber - 1
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
  console.log(e);
  var index = e.currentTarget.dataset.index;
  var goodsIndex = e.currentTarget.dataset.goodsindex;

  var goodsItem = this.data.itemArr[index].depGoods[goodsIndex];
  console.log(goodsItem);
  // var quantity = goodsItem.nxDgOrderQuantity;
  // var standard = goodsItem.nxDgOrderStandard;
  var editQuantity = "itemArr[" + index + "].depGoods[" + goodsIndex + "].nxDgOrderQuantity";
  var quantity = Number(this.data.itemArr[index].depGoods[goodsIndex].nxDgOrderQuantity) - 1;
  // var editStandard = "itemArr[" + index + "].depGoods[" + goodsIndex + "].nxDgOrderStandard";
  // var editRemark = "itemArr[" + index + "].depGoods[" + goodsIndex + "].nxDgOrderEditRemark";
  var selectNumber = this.data.selectNumber;
  
  this.setData({
    [editQuantity]: quantity,
  })
  if(quantity == 0){
    var oneSelect = "itemArr[" + index + "].depGoods[" + goodsIndex + "].isSelected";
     this.setData({
      [oneSelect]: false,

     })
  }

},

addItem: function (e) {
  var index = e.currentTarget.dataset.index;
  var goodsIndex = e.currentTarget.dataset.goodsindex;

  var goodsItem = this.data.itemArr[index].depGoods[goodsIndex];
  console.log(goodsItem);
  // var quantity = goodsItem.nxDgOrderQuantity;
  // var standard = goodsItem.nxDgOrderStandard;
  var editQuantity = "itemArr[" + index + "].depGoods[" + goodsIndex + "].nxDgOrderQuantity";
  var quantity = Number(this.data.itemArr[index].depGoods[goodsIndex].nxDgOrderQuantity) + 1;
  // var editStandard = "itemArr[" + index + "].depGoods[" + goodsIndex + "].nxDgOrderStandard";
  // var editRemark = "itemArr[" + index + "].depGoods[" + goodsIndex + "].nxDgOrderEditRemark";
  var selectNumber = this.data.selectNumber;
  
  this.setData({
    [editQuantity]: quantity,
  })
  if(quantity == 100){
    wx.showToast({
      title: '输入数量不能超过1000',
    })
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



toIbookCover(){
  // console.log("haihaia")
  wx.navigateTo({
    url: '/pagesOrder/ibookCover/ibookCover',
  })

},

saveOrders(){
  var arr  = this.data.itemArr;
  var orderArr = [];
  for(var i = 0; i < arr.length; i++){
    var goodsArr = arr[i].depGoods;
    for(var j = 0; j < goodsArr.length; j++ ){
      var goods = arr[i].depGoods[j];
      var sel = goods.isSelected;
      if(sel){
        var order = {
          nxDoNxGoodsId: goods.nxDgNxGoodsId,
          nxDoNxGoodsFatherId: goods.nxDgNxGoodsFatherId,
          nxDoQuantity: goods.nxDgOrderQuantity,
          nxDoStandard: goods.nxDgOrderStandard,
          nxDoRemark: goods.nxDgOrderEditRemark,
          nxDoDepartmentId: this.data.depInfo.nxDepartmentId,
          nxDoDepartmentFatherId: this.data.depInfo.fatherDepartmentEntity.nxDepartmentId,
          nxDoDistributerId: this.data.depInfo.fatherDepartmentEntity.nxDepartmentDisId,
          nxDoOrderUserId: this.data.userInfo.nxDepartmentUserId,
        }
        orderArr.push(order);
      }
      

      


    }
  }


  //jiekou
  saveOrderArr(orderArr).then(res => {
    if(res){
      console.log(res);
      wx.navigateBack({
        complete: (res) => {
          delta: 1
        },
      })
    }
  })

},






})