const app = getApp()
const globalData = app.globalData;
import { saveOneCustomer, } from '../../../lib/apiDistributer'

Page({
  data: {
    inputed: false,
    nxDepartmentEntities: [],
    nxDepartmentHasSubs: 0,
  },

  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      type: options.type,
    })

    var value = wx.getStorageSync('userInfo');
    
    if(value){
      this.setData({
        disId: value.nxDistributerEntity.nxDistributerId,
        userInfo: value
      })
    } 
          
  },



  //群名称输入
  bindKeyInput: function (e) {
    
    if(e.detail.value.length > 0){
      this.setData({
        inputValue: e.detail.value,
        inputed: true,
      })
    }else{
      this.setData({
        inputValue: "" ,
        inputed: false  
      })
    }
   
  },



toSave(e){

  var value = wx.getStorageSync('deps');

  if(value){
    this.setData({
      nxDepartmentEntities: value,
    })
  }
  var dep = {  
    nxDdDistributerId:this.data.disId,
    nxDepartmentEntity: {
      nxDepartmentFatherId: 0,
      nxDepartmentName: this.data.inputValue,
      nxDepartmentType: this.data.type,
      nxDepartmentDisId: this.data.disId,
      nxDepartmentIsGroupDep: 1,
      nxDepartmentShowWeeks: 1,
      nxDepartmentSubAmount: this.data.nxDepartmentEntities.length,
      nxDepartmentEntities: this.data.nxDepartmentEntities
    }
   
    
  }

  saveOneCustomer(dep).then(res => {
    if(res.result.code == 0) {
      console.log(res)
      
        wx.navigateBack({
          delta: 3
        })
        wx.removeStorageSync("deps");
  
    }
  })
},


})