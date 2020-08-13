// pages/customer/customer.js

const QRCode = require('../../lib/weapp-qrcode.js')
import rpx2px from '../../lib/rpx2px.js'
let qrcode;
// 300rpx 在6s上为 150px
const qrcodeWidth = rpx2px(140);
const qrcodeHeight = rpx2px(140);
const globalData = getApp().globalData;
import {
  disGetAllCustomer,

} from '../../lib/apiDepOrder.js'

Component({
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 3
        })
      }

      console.log(globalData)
      this.setData({
        rpxRcale: globalData.rpxR
      })

      var value = wx.getStorageSync('userInfo');
      if (value) {

        this.setData({
          disId: value.nxDistributerEntity.nxDistributerId,
          userInfo: value,

        })

        wx.setNavigationBarTitle({
          "title": value.nxDistributerEntity.nxDistributerName,
        })

      }


      new QRCode('myQrcode', {
        // usingIn: this,
        // text: "https://grainservice.club/nongxinle/api/nxdepartment/depRegist/?disId=" + this.data.disId,
        text: "https://grainservice.club/nongxinle/api/nxdepartment/depRegist/1",
        // image: '/images/1.jpg',
        width: 70,
        height: 70,
        padding: 12,

        correctLevel: QRCode.CorrectLevel.L,
        callback: (res) => {
          console.log(res.path);
        }
      });



      disGetAllCustomer(this.data.disId).then(res => {
        if (res) {
          console.log(res.result.data)
          this.setData({
            myCustomerArr: res.result.data
          })
        }
      })


    }
  },

  methods: {

    toCustomerPage(e) {
      wx.navigateTo({
        url: '../customerPage/customerPage?depId=' + e.currentTarget.dataset.id,
      })
    },
    toAddMyCustomer() {
      wx.navigateTo({
        url: '../pagesRes/stepOne/stepOne',
      })
    },


  },






})