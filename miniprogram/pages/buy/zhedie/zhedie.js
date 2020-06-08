const globalData = getApp().globalData;

var load = require('../../../lib/load.js');
import { getToPurchaseGoods } from '../../../lib/apiOrders.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list1: [
      {
        listName: '列表1',
        item: [{
          itemName: '子列表1-1',
          content: '1-1中的内容',
          time: '2015-05-06'
        }, {
          itemName: '子列表1-2',
          content: '1-2中的内容',
          time: '2015-04-13'
        }, {
          itemName: '子列表1-3',
          content: '1-3中的内容',
          time: '2015-12-06'
        }]
      },
      {
        listName: '列表2',
        item: [{
          itemName: '子列表2-1',
          content: '2-1中的内容',
          time: '2017-05-06'
        }, {
          itemName: '子列表2-2',
          content: '2-2中的内容',
          time: '2015-08-06'
        }, {
          itemName: '子列表2-3',
          content: '2-3中的内容',
          time: '2015-11-06'
        }]
      }, {
        listName: '列表3',
        item: [{
          itemName: '子列表3-1',
          content: '3-1中的内容',
          time: '2015-05-15'
        }, {
          itemName: '子列表3-2',
          content: '3-2中的内容',
          time: '2015-05-24'
        }, {
          itemName: '子列表1-3',
          content: '3-3中的内容',
          time: '2015-05-30'
        }]
      }
    ]
  },

  //点击最外层列表展开收起
  listTap(e) {
    console.log('触发了最外层');
    let Index = e.currentTarget.dataset.parentindex,//获取点击的下标值
      list = this.data.list;
    list[Index].show = !list[Index].show || false;//变换其打开、关闭的状态
    if (list[Index].show) {//如果点击后是展开状态，则让其他已经展开的列表变为收起状态
      this.packUp(list, Index);
    }

    this.setData({
      list
    });
  },
  //点击里面的子列表展开收起
  listItemTap(e) {
    let parentindex = e.currentTarget.dataset.parentindex,//点击的内层所在的最外层列表下标
      Index = e.currentTarget.dataset.index,//点击的内层下标
      list = this.data.list;
    console.log(list[parentindex].goodsList, Index);
    list[parentindex].goodsList[Index].show = !list[parentindex].goodsList[Index].show || false;//变换其打开、关闭的状态
    if (list[parentindex].goodsList[Index].show) {//如果是操作的打开状态，那么就让同级的其他列表变为关闭状态，保持始终只有一个打开
      for (let i = 0, len = list[parentindex].goodsList.length; i < len; i++) {
        if (i != Index) {
          list[parentindex].goodsList[i].show = false;
        }
      }
    }
    this.setData({ list });
  },

  //让所有的展开项，都变为收起
  packUp(data, index) {
    for (let i = 0, len = data.length; i < len; i++) {//其他最外层列表变为关闭状态
      if (index != i) {
        data[i].show = false;
        for (let j = 0; j < data[i].goodsList.length; j++) {//其他所有内层也为关闭状态
          data[i].goodsList[j].show = false;
        }
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    getToPurchaseGoods(1)
    .then(res => {
      if(res) {
        console.log(res.result.data);
        this.setData({
          list: res.result.data
        })
      }
    })

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },





})