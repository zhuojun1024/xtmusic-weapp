// 小程序开发api接口统一配置
const subDomain = '/api' // 子域名
const API_BASE_URL = 'https://www.i4896.com' // 主域名

const request = (url, method, data) => {
  let _url = API_BASE_URL + subDomain + url
  if (data && data.timestamp) {
    _url += '?timestamp=' + data.timestamp
  }
  const cookie = wx.getStorageSync('cookie')
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: {
        ...data,
        cookie
      },
      header: {
        'Content-Type': 'application/json'
      },
      success (request) {
        resolve(request.data)
      },
      fail (error) {
        reject(error)
      },
      complete () {
        // 加载完成
      }
    })
  })
}

/**
 * 小程序的promise没有finally方法，自己扩展下
 */
Promise.prototype.finally = function (callback) {
  var Promise = this.constructor
  return this.then(
    function (value) {
      Promise.resolve(callback()).then(
        function () {
          return value
        }
      );
    },
    function (reason) {
      Promise.resolve(callback()).then(
        function () {
          throw reason
        }
      )
    }
  )
}

module.exports = request
