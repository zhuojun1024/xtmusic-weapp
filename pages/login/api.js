const request = require('../../request/index.js')

const apis = {
  // 获取验证码
  sendCaptcha: data => request('/captcha/sent', 'post', data),
  // 验证码登录
  loginCellPhone: data => request('/login/cellphone', 'post', data)
}

module.exports = apis
