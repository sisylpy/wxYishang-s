import Promise from './bluebird'
import apiUrl from '../config.js'



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

export const delatePurchaseBatch = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdistributerpurchasebatch/delatePurchaseBatch/' + data,
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

// export const ttt = (data) => {
//   return new Promise((resolve, reject) => {
//     wx.request({
//       url: apiUrl.apiUrl + 'nxdepartmentorders/ttt/' + data,
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

export const disGetBills = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentbill/disGetBills/' + data,
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

export const departmentGetTodayOrders = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentorders/departmentGetTodayOrders/' + data,
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


export const disGetAllCustomer = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdistributerdepartment/disGetAllCustomer/' + data,
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



export const disGetTodayOrderCustomer = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentorders/disGetTodayOrderCustomer/' + data,
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



export const getPrintPickerData = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartment/getPrintPickerData' ,
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


export const updatePurchaseGoods = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdistributerpurchasegoods/update' ,
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

export const purUserGetPurchaseGoods = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdistributerpurchasegoods/purUserGetPurchaseGoods/' + data,
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


export const getDisOrderDepartments = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentorders/getDisOrderDepartments/' + data,
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

export const saveDepartmentOrderFillContent = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentorders/saveDepartmentOrderFillContent',
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

export const getToFillDepOrders = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentorders/getToFillDepOrders' ,
      method: 'POST',
      data:{
        depId: data.depId,
        fatherDepId: data.fatherDepId,
        depHasSubs:  data.depHasSubs,
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

export const getPickerDepartments = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentorders/getPickerDepartments/' + data,
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


export const indexData = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentorders/disGetIndexData/' + data,
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
//拣货分派
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
        reject(e)
      }
    })
  })
}

export const getUnPickerOrder = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentorders/getUnPickerOrder/' + data,
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

export const updatePurchaseGoodsByPurUserId = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdistributerpurchasebatch/update',
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

export const getPurchaseGoodsAndPurchaseBatch = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdistributerpurchasegoods/getPurchaseGoodsAndPurchaseBatch/' + data,
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


export const getPurchaseGoodsBatch = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdistributerpurchasebatch/getPurchaseGoodsBatch/' + data,
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

export const savePurchaseBatchType = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdistributerpurchasebatch/save',
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

export const disGetPurchaseGoods = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdistributerpurchasegoods/getPurchaseGoods/' + data,
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

//计划进货数量
export const savePlanPurchase = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdistributerpurchasegoods/savePlanPurchase',
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


export const disGetToPlanPurchaseGoods = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentorders/disGetToPlanPurchaseGoods/' + data,
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


