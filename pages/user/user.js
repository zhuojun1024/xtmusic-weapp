const api = require('./api')
Page({
  data: {
    userInfo: {}
  },
  onShow() {
    this.getTabBar().init()
    // 获取用户信息
    this.setData({ userInfo: getApp().globalData.userInfo || {} })
  },
  logout() {
    api.logout().finally(() => {
      // 停止播放
      wx.getBackgroundAudioManager().stop()
      // 移除cookie
      wx.removeStorageSync('cookie')
      // 前往登录页
      wx.reLaunch({
        url: '/pages/login/login',
      })
    })
  }
})