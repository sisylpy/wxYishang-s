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
   
    item: {
      type: Object,
      value: ""
    },
    price: {
      type: String,
      value: ""
    }
   

   
  
   
    
   
  },

  /**
   * 组件的初始数据
   */
  data: {
    showInput: false,
    
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
      
      // console.log(e)
      console.log(this.data)
      console.log("modail-confirm ")
      this.triggerEvent('confirm', {
        price: this.data.price,
        standList: this.data.item.nxGoodsStandardEntities
      })

      this.setData({
        show: false,
        price: "",
        standList: [],
      })
     
    },

    getPrice: function (e) {
      console.log(e)
      this.setData({
       
        price: e.detail.value
      })
    },

    onbindfocus:function(e){
     this.setData({
       bottom: e.detail.height,
     })
    },

    addRemark: function (e) {
      this.setData({
        applyRemark: e.detail.value
      })

    },

    getRemark: function(e) {
      var remark = this.data.applyRemark
      this.setData({
        bottom: 0,
        showInput: false,
        remarkContent: remark,
      })
      // this.triggerEvent('getRemark');
    },









  },
  

  
  
})
