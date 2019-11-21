import Promise from './bluebird'
const QQ_MAP_KEY = 'ZVXBZ-D6JKU-4IRVY-2OHZB-RCSVK-LQFU6'
import apiUrl from '../config.js'

const globalData = getApp().globalData;


//获取申请列表
export const myApplys = (store) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'ckapplys/getApplys',
      method: 'POST',
      data: store,
      success: (res) => {
        resolve({result: res.data})
      },
      fail: (e)=> {
          reject(e)
      }
    })
  })
}




// 保存订货申请
export const saveApply = (apply) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'ckapplys/save/',
      method: 'POST',
      header: {
        "content-type": 'application/json'
      },
      data: apply,
      success: (res) => {
        resolve({ result: res.data })
        console.log(res.data);
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

// 获取类别列表
export const cateList = () => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'ckgoods/cateList/',
      method: 'GET',
      success: (res) => {
        resolve({ result: res.data })
        console.log(res.data);
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

// 获取商品列表
export const goodsList = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'ckgoods/goodsList/',
      method: 'POST',
      data: { "page": data.page, "limit": data.limit, "fatherId": data.fatherId },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data })
        console.log(res.data);
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}


// 登录
export const login = (store) => {
  console.log("login./////");
  console.log(store);
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'storeLogin',
      data: store,
      method: 'POST',
      // header: {
      //   "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      // },
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}
