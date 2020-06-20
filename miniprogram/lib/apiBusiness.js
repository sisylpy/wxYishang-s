import Promise from './bluebird'
import apiUrl from '../config.js'






export const addNewStandard = (filePathList, nxStandardName, nxStandardScale, nxStandardError,
  nxSGoodsId) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: apiUrl.apiUrl + 'nxstandard/save',
      filePath: filePathList[0],
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        nxStandardName: nxStandardName,
        nxStandardScale: nxStandardScale,
        nxStandardError: nxStandardError,
        nxSGoodsId: nxSGoodsId,

      },
      success: function (res) {
        resolve({ result: res.data })
      },
      fail: function (e) {
        reject(e)
      },

    })
  })
}

//indexData
export const indexData = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxorders/communityGetIndexData/' + data,
      method: 'GET',
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}


// 微信支付提醒
export const sendCrl = () => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'test/send',
      method: 'GET',      
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

export const jscode2session = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'wx/jscode2session',
      method: 'POST',
      data: 
      {"code": data},
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



//
// export const getGoodsInfo = (data) => {
//   return new Promise((resolve, reject) => {
//     wx.request({
//       url: apiUrl.apiUrl + 'nxcommunitygoods/getGoodInfoByDistribuerId',
//       method: 'POST',
//       data: {
//         "goodsId": data.goodsId,
//         "disId": data.disId,
//       },
//       header: {
//         "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
//       },      
//       success: (res) => {
//         resolve({ result: res.data })
//       },
//       fail: (e) => {
//         reject(e)
//       }
//     })
//   })
// }



//uploadDownGoods
export const uploadDownGoods = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxcommunitygoods/updateDgGoods',
      method: 'POST',
      data: data,
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}




//
export const getCommunityGoods = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxcommunitygoods/getCommunityGoods',
      method: 'POST',
      data: {
        "fatherId": data.fatherId,
        "limit": data.limit,
        "page": data.page,
        "communityId": data.communityId,
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




//getDgCateList
export const cgCataList = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxcommunityfathergoods/getCgCateList/' + data,
      method: 'GET',
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}



