const request = require('../../request/index.js')

const apis = {
  // 注销登录
  logout: data => request('/logout', 'post', data)
}

module.exports = apis
