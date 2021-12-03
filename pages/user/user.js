const api = require('./api')
Page({
  data: {
    userInfo: {}
  },
  onShow() {
    this.getTabBar().init()
    // 获取用户信息
    this.setData({ userInfo: wx.getStorageSync('userInfo') })
  },
  logout() {
    api.logout().finally(() => {
      wx.removeStorageSync('userInfo')
      wx.removeStorageSync('cookie')
      wx.reLaunch({
        url: '/pages/login/login',
      })
    })
  }
})