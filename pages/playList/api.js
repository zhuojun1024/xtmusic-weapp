const request = require('../../request/index.js')

const apis = {
  // 获取歌单歌曲列表
  getAllTrack: data => request('/playlist/track/all', 'post', { limit: 100, ...data }),
  // 获取歌曲播放地址
  getMusicUrl: data => request('/song/url', 'post', { br: 192000, ...data })
}

module.exports = apis
