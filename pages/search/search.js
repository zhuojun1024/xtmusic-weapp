import Notify from '@vant/weapp/notify/notify'
import api from './api'
Page({
  data: {
    keyword: undefined,
    currentMusicId: undefined,
    offset: 0,
    total: 0,
    data: [],
    timer: undefined
  },
  // 生命周期函数--监听页面显示
  onShow: function () {
    this.getTabBar().init()
    this.setMusicInfo()
    this.setData({ timer: setInterval(this.setMusicInfo.bind(this), 500) })
    if (this.data.data.length === 0) {
      this.cloudSearch()
    }
  },
  // 生命周期函数--监听页面卸载
  onUnload: function () {
    clearInterval(this.data.timer)
  },
  setMusicInfo () {
    const musicInfo = getApp().globalData.musicInfo
    if (musicInfo) {
      this.setData({ currentMusicId: musicInfo.id })
    }
  },
  onScrollToLower () {
    const { offset, total } = this.data
    if (offset * 30 < total) {
      this.setData({
        offset: offset + 1
      })
      this.cloudSearch()
    }
  },
  onSearch () {
    this.setData({
      offset: 0,
      total: 0,
      data: []
    })
    this.cloudSearch()
  },
  cloudSearch () {
    const timestamp = new Date().getTime()
    const params = {
      keywords: this.data.keyword || '热门歌曲',
      limit: 30,
      offset: this.data.offset * 30,
      timestamp
    }
    wx.showLoading({ title: '加载中' })
    api.cloudSearch(params).then(res => {
      if (res.code === 200) {
        const data = res.result.songs || []
        const total = res.result.songCount || 0
        this.setData({
          data: this.data.data.concat(data.map(item => {
            item.ar = item.ar.map(item => item.name).join('、')
            return item
          })),
          total
        })
      } else {
        throw res.msg
      }
    }).catch(e => {
      Notify('搜索失败：' + e)
    }).finally(() => {
      wx.hideLoading()
    })
  },
  getMusicUrl (e) {
    const id = e.currentTarget.dataset.id
    const record = this.data.data.find(item => item.id === id)
    this.setData({ currentMusicId: id })
    getApp().globalData.musicList = this.data.data
    getApp().getMusicUrl(record)
  }
})