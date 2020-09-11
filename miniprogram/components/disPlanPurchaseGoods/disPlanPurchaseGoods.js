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
   
    applyStandardName: {
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

    cancle() {
      this.setData({ show: false })
      this.triggerEvent('cancle')
    },

    confirm(e) {
      
      // console.log(e)
      console.log(this.data)
      console.log("modail-confirm ")
      this.triggerEvent('confirm', {
        plan: this.data.plan,
        applyStandardName: this.data.applyStandardName,
       
      })

      this.setData({
        show: false,
        price: "",
        standList: [],
      })
     
    },

    getPlan: function (e) {
      console.log(e)
      this.setData({
       
        plan: e.detail.value
      })
    },


    standardchange: function(){
      var name = e.currentTarget.dataset.name;
      console.log(e)
      this.triggerEvent('changeStandard', {
        applyStandardName: name

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
