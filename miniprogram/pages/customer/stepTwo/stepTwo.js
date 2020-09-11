// miniprogram/pages/signe1/enterprisetype.js
const app = getApp()
const globalData = app.globalData;



Page({

  /**
   * 页面的初始数据
   */
  data: {
    second_height: 0,
    showNumber: false,
    selNumber: "",
    addFinished: false,
    value: 0,
    hasSubs: 0,
    focusIndex:0,
  
  },


  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    this.setData({
     
      second_height: globalData.windowHeight - globalData.windowWidth / 750 * 120 - (globalData.windowWidth / 750) * 94,
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      disId: options.disId,
      type: options.type,
    })

  },

   
  showNumber(e){
    console.log(e)
    this.setData({
      showNumber: true
    })
  },

  selIndex(e){
    console.log(e)
    var num = Number(e.currentTarget.dataset.index) + 1;
    var deps = [];
    for(var i = 0; i < num; i++) {
         var dep = {
          nxDepartmentFatherId: this.data.depId,
           nxDepartmentName: null,
           nxDepartmentType: this.data.type,
           nxDepartmentHasSubs: 0,
           nxDepartmentShowWeeks: 1,
           nxDepartmentSubAmount: 0,
           nxDepartmentIsGroupDep: 0,
          };
          deps.push(dep);
    }
    
    this.setData({
      selNumber: num,
      showNumber: false,
      departments: deps
    })

  },
  getDepartmentName(e){
    var name = e.detail.value;
    var index = e.currentTarget.dataset.index;
    console.log(name);
    var dep = this.data.departments[index];
    var depNameData = "departments["+index+"].nxDepartmentName"
    console.log(depNameData)
    this.setData({
      [depNameData]: name,
    })
    
    this._ifCanSave();

  },
   _ifCanSave(){
     var num  = this.data.departments.length;
     for (var i = 0; i < num; i++) {
       var name =  this.data.departments[i].nxDepartmentName;
       if(name == null || name.length == 0){
         this.setData({
          addFinished: false
         })
          return;
       }else{
         this.setData({
           addFinished: true,
         })
       }
     }
   },


   toGroupName() {
     wx.setStorageSync('deps', this.data.departments);
    
    wx.navigateTo({
      url: '../stepThree/stepThree?disId=' + this.data.disId + '&type=' + this.data.type,
    })
   },

   
   radioChange: function (e) {
    console.log(e);
    this.setData({
      hasSubs: e.detail.value,
      selNumber: "",
      focusIndex: 0,

    })  

  },

  hideNumber(){

    if(this.data.showNumber){
      this.setData({
        showNumber: false
      })
    }
  },

  clickConfirm(e){
    console.log(e);
      this.setData({
        focusIndex: e.currentTarget.dataset.index + 1,
      })
    
  }


  








  
})