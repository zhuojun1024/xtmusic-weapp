import Notify from '@vant/weapp/notify/notify'
import api from './api'
Page({
  data: {
    id: undefined,
    data: []
  },
  onLoad: function (options) {
    this.setData({ id: options.id })
    this.getAllTrack(options.id)
  },
  playMusic (e) {
    const dataset = e.currentTarget.dataset
    const timestamp = new Date().getTime()
    const params = { id: dataset.id, timestamp }
    wx.showLoading({ title: '获取播放地址' })
    api.getMusicUrl(params).then(res => {
      if (res.code === 200) {
        const data = res.data || []
        if (data.length && data[0].url) {
          const app = getApp()
          app.playMusic({ ...dataset, url: data[0].url })
        } else {
          throw new Error('获取播放地址失败，可能无版权')
        }
      } else {
        throw res.message
      }
    }).catch(e => {
      Notify('播放歌曲失败：' + e)
      console.error('播放歌曲失败：', e)
    }).finally(() => {
      wx.hideLoading()
    })
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
        }) })
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