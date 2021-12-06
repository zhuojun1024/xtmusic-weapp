import Notify from '@vant/weapp/notify/notify'
import api from './api'
Page({
  data: {
    id: undefined,
    currentMusicId: undefined,
    data: [],
    timer: undefined
  },
  onLoad: function (options) {
    this.setData({ id: options.id })
    this.getAllTrack(options.id)
    // 获取当前播放的音乐id
    this.setMusicInfo()
    this.setData({ timer: setInterval(this.setMusicInfo.bind(this), 500) })
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
  scrollToLower () {
    console.log('滚动到底部')
  },
  getMusicUrl (e) {
    const id = e.currentTarget.dataset.id
    const record = this.data.data.find(item => item.id === id)
    this.setData({ currentMusicId: id })
    getApp().globalData.musicList = this.data.data
    getApp().getMusicUrl(record)
  },
  getAllTrack (id) {
    const timestamp = new Date().getTime()
    const params = { id, timestamp }
    wx.showLoading({ title: '加载中' })
    api.getAllTrack(params).then(res => {
      if (res.code === 200) {
        const data = res.songs || []
        this.setData({ data: data.map(item => {
            item.ar = item.ar.map(item => item.name).join('、')
            return item
          })
        })
      } else {
        throw res.message
      }
    }).catch(e => {
      console.error('获取歌单歌曲列表失败：', e)
    }).finally(() => {
      wx.hideLoading()
    })
  }
})