import Promise from './bluebird'
import apiUrl from '../config.js'

var load = require('./load.js');

//

// export const getPurchaseGoodsBatch = (data) => {
//   return new Promise((resolve, reject) => {
//     wx.request({
//       url: apiUrl.apiUrl + 'nxdistributerpurchasebatch/getPurchaseGoodsBatch/' + data,
//       method: 'GET',
//       success: (res) => {
//         resolve({ result: res.data })
//       },
//       fail: (e) => {
//         reject(e)
//       }
//     })
//   })
// }

// export const indexData = (data) => {
//   return new Promise((resolve, reject) => {
//     wx.request({
//       url: apiUrl.apiUrl + 'nxdepartmentorders/disGetIndexData/' + data,
//       method: 'GET',
//       success: (res) => {
//         resolve({ result: res.data })
//       },
//       fail: (e) => {
//         reject(e)
//       }
//     })
//   })
// }


// export const updatePurchaseGoodsByPurUserId = (data) => {
//   return new Promise((resolve, reject) => {
//     wx.request({
//       url: apiUrl.apiUrl + 'nxdistributerpurchasebatch/update',
//       method: 'POST',
//       data,
//       success: (res) => {
//         resolve({ result: res.data })
//       },
//       fail: (e) => {
//         reject(e)
//       }
//     })
//   })
// }


// export const updatePurchaseGoods = (data) => {
//   return new Promise((resolve, reject) => {
//     wx.request({
//       url: apiUrl.apiUrl + 'nxdistributerpurchasegoods/update' ,
//       method: 'POST',
//       data,
//       success: (res) => {
//         resolve({ result: res.data })
//       },
//       fail: (e) => {
//         reject(e)
//       }
//     })
//   })
// }

// export const purUserGetPurchaseGoods = (data) => {
//   return new Promise((resolve, reject) => {
//     wx.request({
//       url: apiUrl.apiUrl + 'nxdistributerpurchasegoods/purUserGetPurchaseGoods/' + data,
//       method: 'GET',
//       success: (res) => {
//         resolve({ result: res.data })
//       },
//       fail: (e) => {
//         reject(e)
//       }
//     })
//   })
// }


// export const downLoadYuyin = () => {
//   return new Promise((resolve, reject) => {
//     wx.downloadFile({
//       url: apiUrl.apiUrl + "nxdistributer/downLoadFragment/" + 38  ,
//       success: (res) => {
//         resolve({ result: res })
//       },
//       fail: (e) => {
//         reject(e)
//       }
//     })
//   })
// }


export const depGetWeeksApply = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentorders/depGetWeeksApply' ,
      method: 'POST',
      data: {
        weeks: data.weeks,
        depId:  data.depId
      },
      header:{
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"

      },
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e);
        load.hideLoading();
      }
    })
  })
}



export const depGetResGoods = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentdisgoods/depGetResGoods' ,
      method: 'POST',
      data: {
        depId: data.depId,
        fatherId: data.fatherId
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








export const downLoadYuyin = (data) => {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url:"https://grainservice.club:8081/hyzy/wx/downLoadNumber/" + data,
      success: (res) => {
        resolve({ result: res })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}



export const disGetDepTodayOrders = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentorders/disGetDepTodayOrders' ,
      method: 'GET',
      data:{
        depFatherId: data.depId,
        disId: data.disId
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

export const getSubDepartments = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartment/getSubDepartments/' + data,
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










export const saveBill = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentbill/save',
      method: 'POST',
      data,
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}









// ///////////////////////////////

/**
 * 获取客户商品列表
 * @param {} data 
 */
export const depGetDepGoods = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentdisgoods/depGetDepGoods' ,
      method: 'POST',
      data:{
        limit: data.limit,
        page: data.page,
        depId: data.depId,
        fatherId: data.fatherId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e);
        load.hideLoading();
      }
    })
  })
}

/**
 * 保存订单的数量和单价
 * @param {*} data 
 */
export const saveToFillContent = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentorders/saveToFillContent',
      method: 'POST',
      data,
      header: {
        "content-type": 'application/json'
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

/**
 * 打印销售单据
 * @param {*} data 
 */
export const printDepartmentOrders = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentbill/save',
      method: 'POST',
      data,
    
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

/**
 * 获取录入单价和数量订单
 * @param {*} data 
 */
export const getToFillDepOrders = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentorders/getToFillDepOrders' ,
      method: 'POST',
      data:{
        depFatherId: data.depFatherId,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e);
        load.hideLoading();
        wx.showToast({
          title: '请检查网络',
          icon: 'none'
        })
      }
    })
  })
}


/**
 * 获取客户送货单
 * @param {*} data 
 */
export const disGetBills = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentbill/disGetBills',
      method: 'POST',
      data,
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e);
        load.hideLoading();
        wx.showToast({
          title: '请检查网络',
          icon: 'none'
        })
      }
    })
  })
}

/**
 * 送货单完成结账
 * @param {*} data 
 */
export const checkDepBills = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentbill/checkDepBills' ,
      method: 'POST',
      data,
      header: {
        "content-type": 'application/json'
      },
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e);
        load.hideLoading();
        wx.showToast({
          title: '请检查网络',
          icon: 'none'
        })
      }
    })
  })
}

/**
 * 获取群商品类别列表
 * @param {*} data 
 */
export const depGetDepDisGoodsCata = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentdisgoods/depGetDepDisGoodsCata/' +data ,
      method: 'GET',
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e);
        load.hideLoading();
        wx.showToast({
          title: '请检查网络',
          icon: 'none'
        })
      }
    })
  })
}


/**
 * 获取群用户列表
 * @param {*} data 
 */
export const getDepUsers = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentuser/getDepUsers/' + data ,
      method: 'GET',
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e);
        load.hideLoading();
        wx.showToast({
          title: '请检查网络',
          icon: 'none'
        })
      }
    })
  })
}

/**
 * 打印拣货单
 * @param {*} data  订单列表
 */
export const distributionWeighing = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentorders/distributionWeighing',
      method: 'POST',
      data,
      header: {
        "content-type": 'application/json'
      },
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e);
        load.hideLoading();
        wx.showToast({
          title: '请检查网络',
          icon: 'none'
        })
      }
    })
  })
}



/**
 * page：order
 * 获取订货客户的订单
 * @param {*} data 
 */
export const disGetTodayOrderCustomer = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentorders/disGetTodayOrderCustomer/' + data,
      method: 'GET',
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e);
        load.hideLoading();
        wx.showToast({
          title: '请检查网络',
          icon: 'none'
        })
      }
    })
  })
}


