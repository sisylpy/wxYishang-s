// pages/customerPage/customerPage.js
const globalData = getApp().globalData;

import apiUrl from '../../../config.js'

let windowWidth = 0;
let itemWidth = 0;
import {
  disGetBills, 
  checkDepBills,
  depGetDepDisGoodsCata,
  getDepUsers

} from '../../../lib/apiDepOrder'

Page({

  /**
   * 页面的初始数据
   */
  data: {

    sliderOffset: 0,
    sliderOffsets: [],
    sliderLeft: 0,
    tabs:["送货单","送货单和账款","订货商品","群用户"],
    tab1Index:0,
    selAmount: 0,
    itemIndex: 0,

    total: 0,
    selectArr: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      url: apiUrl.server,
      depId: options.depId,
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
      itemIndex: index,
      
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
    if (this.data.tab1Index == 0) {

      this._getBills();
    }
    if (this.data.tab1Index == 1) {
      // this._getMyCustomer();
    }
    if (this.data.tab1Index == 2) {
      this._getResGoodsCata();
    }
    if (this.data.tab1Index == 3) {
      this._getGroupUsers();
    }
  },


  _getGroupUsers(){

    getDepUsers(this.data.depId).then(res =>{
      if(res.result){
        this.setData({
          userArr: res.result.data,
        })
      }
    })
  },

  // /////
_getResGoodsCata(){
depGetDepDisGoodsCata(this.data.depId).then(res =>{
  if(res){
    this.setData({
      depGoodsArr: res.result.data
    })
  }
})
},

 _getBills(){
   var data = {
    nxDbDisId : this.data.disId,
    nxDbDepId : this.data.depId
   }

  disGetBills(data).then(res => {
    if(res){
      console.log(res);
      this.setData({
        billArr: res.result.data,
      })
    }
  })
 },

 toGoodsList(e){
  wx.navigateTo({
    url: '../resGoodsList/resGoodsList?fatherId=' + e.currentTarget.dataset.id 
    +'&fatherName=' + e.currentTarget.dataset.name + '&depId=' + this.data.depId ,
  })

},

 selectBill(e){

  var index = e.currentTarget.dataset.index;
  var isSelect = e.detail.value;
  var item  = this.data.billArr[index];
  var selectArr  = this.data.selectArr;
  
  if(isSelect){
    selectArr.push(item);
    this.setData({
      selectArr: selectArr
    })
  }else{
    selectArr.splice(selectArr.findIndex(item => item.nxDepartmentBillId === item.nxDepartmentBillId), 1);
    this.setData({
      selectArr: selectArr
    })
  }
  this._countTotal();
 },

 _countTotal(){
   var selectArr = this.data.selectArr;
   var temp = 0;
   for(var i = 0; i < selectArr.length; i++){
     var itemTotal = Number(selectArr[i].nxDbTotal);
     console.log(selectArr[i]);
     console.log(Number(selectArr[i].nxDbTotal));
     temp = temp + itemTotal;
     console.log(temp);
   }
   this.setData({
     total: temp.toFixed(1),
     selAmount: selectArr.length
   })
   
 },

 checkBills(){

    checkDepBills(this.data.selectArr).then (res =>{
      if(res.result.code == 0){
        console.log(res);
        wx.showToast({
          title: '结账成功',
        })
      }
    })
 },

 /**
  * 打开商品页面
  */
 toGoodsList(e){

  wx.navigateTo({
    url: '../resGoodsList/resGoodsList?fatherId=' + e.currentTarget.dataset.id + '&fatherName='
      + e.currentTarget.dataset.name + '&depId=' + this.data.depId,
  })

 },
 showOrHide(e){
   console.log(e);
  var greatIndex = e.currentTarget.dataset.greatindex;
  var grandIndex = e.currentTarget.dataset.grandindex;
  for( var i = 0; i < this.data.depGoodsArr.length; i ++){
   
    for(var j = 0; j < this.data.depGoodsArr[i].fatherGoodsEntities.length; j++){
      var itemShow = "depGoodsArr["+ i+"].fatherGoodsEntities["+ j+"].isShow";
     
       if (i != greatIndex || j != grandIndex) {
        this.setData({
          [itemShow]: false
        })         
       }    
    }  
  }

  var show = this.data.depGoodsArr[greatIndex].fatherGoodsEntities[grandIndex].isShow;
  var itemShow = "depGoodsArr["+ greatIndex+"].fatherGoodsEntities["+ grandIndex+"].isShow";
  this.setData({
    [itemShow]: !show
  })
},






})