const request = require('../../request/index.js')

const apis = {
  // 获取用户歌单
  getPlayList: data => request('/user/playlist', 'post', data)
}

module.exports = apis
