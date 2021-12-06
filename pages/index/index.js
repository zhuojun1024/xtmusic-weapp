import Notify from '@vant/weapp/notify/notify'
import api from './api'
Page({
  data: {
    playList: []
  },
  onShow: function () {
    this.getTabBar().init()
    if (this.data.playList.length === 0) {
      this.getPlayList()
    }
  },
  toPlayListPage (e) {
    const data = e.currentTarget.dataset
    wx.navigateTo({ url: '/pages/playList/playList?id=' + data.id })
  },
  getPlayList () {
    const userInfo = getApp().globalData.userInfo || {}
    wx.showLoading({ title: '加载中' })
    api.getPlayList({ uid: userInfo.userId }).then(res => {
      if (res.code === 200) {
        this.setData({ playList: res.playlist })
      } else {
        throw res.message
      }
    }).catch(e => {
      Notify('获取用户歌单失败：', e)
      console.error('获取用户歌单失败：', e)
    }).finally(() => {
      wx.hideLoading()
    })
  }
})