const request = require('../../request/index.js')

const apis = {
  // 获取歌词
  getLyric: data => request('/lyric', 'post', data),
}

module.exports = apis
