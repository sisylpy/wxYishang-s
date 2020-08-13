// components/shareButton/mymodal.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //是否显示modal
    show: {
      type: Boolean,
      value: true
    },
   
    purGoodsId: {
      type: Number,
      value: ""
    },

    buyPrice: {
      type: String,
      value: ""
    },
   

   
  
   
    
   
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickMask() {
      this.setData({show: false})
    },

    cancel() {
      this.setData({ show: false })
      this.triggerEvent('cancel')
    },

    confirm(e) {
      
      this.triggerEvent('confirm', {
        buyPrice: this.data.buyPrice,
       
      })

      this.setData({
        show: false,
        purQuantity: "",
      })
     
    },

    getQuantity: function (e) {
      console.log(e)
      this.setData({
        buyPrice: e.detail.value
      })
    },


    changeStandard: function (e) {
      var name = e.currentTarget.dataset.name;
      console.log(e)
      this.triggerEvent('changeStandard', {
        applyStandardName: name

      })
      // this.setData({
      //   applyStandardName: name
      // })


    },

    },






  

  
  
})
