const request = require('../../request/index.js')

const apis = {
  // 搜索歌曲列表
  cloudSearch: data => request('/cloudsearch', 'post', data)
}

module.exports = apis
