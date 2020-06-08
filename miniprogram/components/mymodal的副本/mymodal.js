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
    applyStandardName: {
      type: String,
      value: ""
    },
    applyGoodsName: {
      type: String,
      value: ""
    },
    applyRemark: {
      type: String,
      value: ""
    },
    item: {
      type: Object,
      value: ""
    },
    applyGoodsId: {
      type: String,
      value: ""
    },
    remarkContent: {
      type: String,
      value: ""
    },
    applyNumber: {
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
        applyNumber: this.data.applyNumber,
        applyStandardName: this.data.applyStandardName,
        applyGoodsName: this.data.applyGoodsName,
        applyGoodsId: this.data.applyGoodsId,
        applyRemark: this.data.remarkContent,
        applyPrice: this.data.price,

      })

      this.setData({
        show: false,
        applyNumber: "",
        applyGoodsName: "",
        applyGoodsId: "",
        applyRemark: "",
        remarkContent: ""
      })
     
    },

    standardchange: function(){
      this.triggerEvent('standardchange')
    },

    remark1: function(){
      this.triggerEvent('addremark')

      
    },

    remark(e) {
      // console.log(e)
      this.setData({
        bottom: 500,
        showInput: true
      })
    },

    getApplyNumber: function (e) {
      console.log(e)
      this.setData({
       
        applyNumber: e.detail.value
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
