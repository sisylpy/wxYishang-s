import Promise from './bluebird'
const QQ_MAP_KEY = 'ZVXBZ-D6JKU-4IRVY-2OHZB-RCSVK-LQFU6'
import apiUrl from '../config.js'

const globalData = getApp().globalData;


//changeApplysToMarketPurchase

//把新申请改为市场采购状态
export const changeApplysToMarketPurchase = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'ckapplys/wx/changeApplysToMarketPurchase/',
      method: 'POST',
      data,
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

//获取出货部门按商品显示的申请
export const getApplyGoodsStatusByDepId = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'ckapplys/wx/getApplyGoodsStatusByDepId/'+data,
      method: 'GET',
      
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


//获取拣货单分店的商品fatherlist
export const queryFatherGoodsByPickStores = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'ckapplys/queryFatherGoodsByPickStores/',
      method: 'POST',
      data:{
        "depId": data.depId,
        "status": data.status,
        "storeArr": data.storeArr
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}


//获取申请列表
export const getPickStoreList = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'ckapplys/wx/getPickStoreList/'+ data,
      method: 'GET',
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



//获取申请列表
export const saveStockRecords = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'ckstockrecord/save/',
      method: 'POST',
      data,
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


//获取申请列表
export const getEnterApplyByPageNumber = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'ckapplys/wx/getEnterApplyByPageNumber/',
      method: 'POST',
      data: { "status": data.status, "depId": data.depId, "pageNumber": data.pageNumber },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}


//获取商品列表
export const getGoodsList = (data) => {
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
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}


//获取申请列表
export const getSortList = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'ckapplys/wx/getSorts/',
      method: 'POST',
      data: {"status": data.status, "depId": data.depId},
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({result: res.data})
      },
      fail: (e)=> {
          reject(e)
      }
    })
  })
}



