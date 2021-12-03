const request = require('../../request/index.js')

const apis = {
  // 获取登录用户信息
  getAccountInfo: data => request('/user/subcount', 'post', data),
}

module.exports = apis
