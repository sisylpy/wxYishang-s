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




  },

  /**
   * 组件的初始数据
   */
  data: {

    plan: ""

  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickMask() {
      this.setData({
        show: false
      })
    },

    cancle() {
      this.setData({
        show: false
      })
      this.triggerEvent('cancle')
    },

    confirm(e) {

      if (this.data.plan.length > 0) {
        this.triggerEvent('confirm', {
          plan: this.data.plan,
        })

        this.setData({
          show: false,
          plan: "",
        })
      }
    },

    getPlan: function (e) {
      if (e.detail.value.length > 0) {
        this.setData({
          plan: e.detail.value
        })
      }

    },



  },










})