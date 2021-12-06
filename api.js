const request = require('/request/index.js')

const apis = {
  // 获取登录用户信息
  getAccountInfo: data => request('/user/account', 'post', data),
  // 获取歌曲播放地址
  getMusicUrl: data => request('/song/url', 'post', { br: 192000, ...data })
}

module.exports = apis
