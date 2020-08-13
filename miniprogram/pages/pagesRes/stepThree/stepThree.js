const app = getApp()
const globalData = app.globalData;
import { saveOneCustomer, } from '../../../lib/apiRestruant'

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
    if(e.detail.value)
    this.setData({
      inputValue: e.detail.value,
      inputed: true,
    })
  },



toSave(){
  var value = wx.getStorageSync('deps');

  if(value){
    this.setData({
      nxDepartmentEntities: value,
      nxDepartmentHasSubs: 1,

    })
  }
  var dep = {  
    nxDdDistributerId:this.data.disId,
    nxDepartmentEntity: {
      nxDepartmentName: this.data.inputValue,
      nxDepartmentFatherId: 0,
      nxDepartmentType: this.data.type,
      nxDepartmentDisId: this.data.disId,
      nxDepartmentHasSubs: this.data.nxDepartmentHasSubs,
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
        wx.clearStorageSync("deps");
  
    }
  })
},


})