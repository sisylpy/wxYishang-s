const app = getApp()
const globalData = app.globalData;
import {saveDepartment} from  '../../../lib/apiRestruant';


Page({
  data: {
    second_height: 0,
    inputed: false,
    disId : 1,

  },

  onLoad: function (options) {
    this.setData({
      userId: options.id,
      url : options.url,
  
      second_height: globalData.windowHeight - globalData.windowWidth / 750 * 120 - (globalData.windowWidth / 750) * 94,
      userId: options.id,
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,

    })
   
    
  },



  //群名称输入
  bindKeyInput: function (e) {
    if(e.detail.value)
    this.setData({
      inputValue: e.detail.value,
      inputed: true,
    })
  },

  signe (){

    var dep = {
      nxDepUserId: this.data.userId,
      nxDepartmentName: this.data.inputValue,
      nxDepartmentFatherId: 0,
      nxDepartmentType: 1,
      nxDepartmentDisId: this.data.disId
    }
    saveDepartment(dep).then(res => {
      if(res) {
        // wx.navigateTo({
        //   url: '../resIndex/resIndex',
        // })
        console.log(globalData.socket)
        var ids =  wx.getStorageSync('socketIds');
        console.log(ids);

        globalData.socket.emit('finished', ids );

        // globalData.socket.on('finished', function(d) {
         
        //   console.log("begingkgngi2344")
         
      
        
        // })



        
      }
    })



  },


})