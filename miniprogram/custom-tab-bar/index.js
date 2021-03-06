
Component({
  data: {
    // selected: 0,
    color: "#7A7E83",
    selectedColor: "#147062",
    list: [{
      pagePath: "/pages/order/index/index",
      iconPath: "/images/back.png",
      selectedIconPath: "/images/goods.jpg",
      text: "订单"
    }, {
      pagePath: "/pages/purchase/index/index",
      iconPath: "/images/biao.png",
      selectedIconPath: "/images/add.jpg",
      text: "上货"
    }, {
      pagePath: "/pages/goods/index/index",
      iconPath: "/images/logo.jpg",
      selectedIconPath: "/images/addGroup.jpg",
      text: "商品"
    }, {
      pagePath: "/pages/customer/index/index",
      iconPath: "/images/logo.jpg",
      selectedIconPath: "/images/addGroup.jpg",
      text: "客户"
    }]
  },
  attached() {

  },
  methods: {
    switchTab(e) {
      var that = this;

      console.log("tap!!!!")
      console.log(e);
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      that.setData({
        selected: data.index
      })
    }
  }
})