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
    },
    applyDecimal: {
      type: String,
      value: "0"
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

    cancle() {
      this.setData({ show: false })
      this.triggerEvent('cancel')
    },

    confirm(e) {
      
      // console.log(e)
      console.log(this.data)
      console.log("modail-confirm ");
      var price = this.data.item.dgGoodsPrice + '.'+this.data.item.dgGoodsPriceDecimal;

      if(this.data.applyNumber + this.data.applyDecimal > 0){
        console.log("priceeee")
        
        this.triggerEvent('confirm', {
          applyNumber: this.data.applyNumber,
          applyDecimal: this.data.applyDecimal,
          applyStandardName: this.data.applyStandardName,
          applyGoodsName: this.data.item.nxGoodsEntity.nxGoodsName,
          applyGoodsId: this.data.item.nxGoodsEntity.nxGoodsId,
          applyRemark: this.data.remarkContent,
          applyPrice: price,
          goodsStandard: this.data.item.nxGoodsEntity.nxGoodsStandardname,
          nxGoodsFatherId: this.data.item.nxGoodsEntity.nxGoodsFatherId

        })

        this.setData({
          show: false,
          applyNumber: "",
          applyDecimal: "0",
          applyGoodsName: "",
          applyGoodsId: "",
          applyRemark: "",
          remarkContent: "",
          applyPrice: "",
          goodsStandard: "",
          nxGoodsFatherId: "",
        })
      }
     
     
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



    focusDecimal: function(e){
      console.log("focusDecimal");
      console.log(this.data.applyNumber)
      if(this.data.applyNumber == ""){
        this.setData({
          applyNumber: "0"
        })
      }
      this.setData({
        applyDecimal: ""

      })
    },

    clickDecimal: function (e) {
      console.log("inputDecimal")
      this.setData({
        applyDecimal: e.detail.value
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


    }





  },
  

  
  
})
