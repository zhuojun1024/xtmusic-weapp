const api = require('./api')
Page({
  data: {
    userInfo: {}
  },
  onShow() {
    this.getTabBar().init()
    this.getAccountInfo()
  },
  getAccountInfo () {
    api.getAccountInfo().then(res => {
      console.log(res)
    }).catch(e => {
      
    })
  },
  logout() {
    wx.removeStorageSync('userInfo')
    wx.reLaunch({
      url: '/pages/login/login',
    })
  }
})