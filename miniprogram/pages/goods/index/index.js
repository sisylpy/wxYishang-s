

const globalData = getApp().globalData;
import apiUrl from '../../../config.js'
import {getDisGoodsCata} from '../../../lib/apiDistributer'



Component({
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 2
        })
      }

      

      this.setData({
        // disId: globalData.userInfo.nxDistributerEntity.nxDistributerId,
        windowWidth: globalData.windowWidth * globalData.rpxR,
        windowHeight: globalData.windowHeight * globalData.rpxR,
        url: apiUrl.server,
      })

      var value = wx.getStorageSync('userInfo');
      if(value){

        this.setData({
          disId: value.nxDistributerEntity.nxDistributerId,
          userInfo: value

        })

        wx.setNavigationBarTitle({
          "title": value.nxDistributerEntity.nxDistributerName,
        })

      }
      
      getDisGoodsCata(this.data.disId).then(res => {
        if(res.result.code == 0){
          console.log(res)
          this.setData({
            goodsList: res.result.data,
          })
        }
      })




    }
  },

  methods: {

    showOrHide(e){
      var greatIndex = e.currentTarget.dataset.greatindex;
      var grandIndex = e.currentTarget.dataset.grandindex;
      for( var i = 0; i < this.data.goodsList.length; i ++){
       
        for(var j = 0; j < this.data.goodsList[i].fatherGoodsEntities.length; j++){
          var itemShow = "goodsList["+ i+"].fatherGoodsEntities["+ j+"].isShow";
         
           if (i != greatIndex || j != grandIndex) {
            this.setData({
              [itemShow]: false
            })         
           }    
        }  
      }

   
      var show = this.data.goodsList[greatIndex].fatherGoodsEntities[grandIndex].isShow;
      var itemShow = "goodsList["+ greatIndex+"].fatherGoodsEntities["+ grandIndex+"].isShow";
      this.setData({
        [itemShow]: !show
      })

    },

    toIbooks(){
      wx.navigateTo({
        url: '../ibookCover/ibookCover',
      })
    },


    toGoodsList(e){
      console.log(e);
      var id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../goodsList/goodsList?id=' + id + '&name=' + e.currentTarget.dataset.name,
      })


    },




  },
  





})
