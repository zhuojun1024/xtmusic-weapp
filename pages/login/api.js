const request = require('../../request/index.js')

const apis = {
  // 获取验证码
  sendCaptcha: data => request('/captcha/sent', 'post', data),
  // 验证码登录
  loginCellPhone: data => request('/login/cellphone', 'post', data),
  // 获取登录用户信息
  getAccountInfo: data => request('/user/account', 'post', data)
}

module.exports = apis
