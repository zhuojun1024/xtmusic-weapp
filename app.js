import api from './api'
App({
  data: {
  },
  onLaunch() {
    // 判断是否已经登录, 登录则直接进入首页
    const cookie = wx.getStorageSync('cookie')
    if (cookie) {
      this.getAccountInfo()
    }
    // 背景音乐管理器事件监听
    const bam = wx.getBackgroundAudioManager()
    bam.onEnded(this.onEnded)
    bam.onPrev(this.onPrev)
    bam.onNext(this.onNext)
  },
  // 获取用户信息
  getAccountInfo () {
    api.getAccountInfo().then(res => {
      if (res.code === 200) {
        const data = res.profile || {}
        this.globalData.userInfo = data
        wx.switchTab({ url: '/pages/search/search' })
      } else {
        throw res.message
      }
    }).catch(e => {
      console.error('获取用户信息失败：', e)
    })
  },
  onPrev () {
    // 获取当前播放的音乐id和音乐列表
    const id = this.globalData.musicInfo.id
    const musicList = this.globalData.musicList
    // 如果同时存在，则判断是否需要播放下一首
    if (id && musicList && musicList.length) {
      const index = musicList.findIndex(item => item.id === id)
      // 如果当前播放的音乐不是最后一首，则播放下一首
      if (index > 0) {
        const record = musicList[index - 1]
        this.globalData.musicInfo = record
        this.getMusicUrl(record)
      }
    }
  },
  onNext () {
    // 获取当前播放的音乐id和音乐列表
    const id = this.globalData.musicInfo.id
    const musicList = this.globalData.musicList
    // 如果同时存在，则判断是否需要播放下一首
    if (id && musicList && musicList.length) {
      const index = musicList.findIndex(item => item.id === id)
      // 如果当前播放的音乐不是最后一首，则播放下一首
      if (index < musicList.length - 1) {
        const record = musicList[index + 1]
        this.globalData.musicInfo = record
        this.getMusicUrl(record)
      }
    }
  },
  onEnded () {
    this.onNext()
  },
  getMusicUrl (record) {
    const timestamp = new Date().getTime()
    const params = { id: record.id, timestamp }
    api.getMusicUrl(params).then(res => {
      if (res.code === 200) {
        const data = res.data || []
        if (data.length && data[0].url) {
          this.globalData.musicInfo = record
          this.playMusic({ ...record, url: data[0].url })
        } else {
          // 获取音乐播放地址失败，跳过继续播放下一首
          this.onNext()
          throw new Error('获取播放地址失败，可能无版权')
        }
      } else {
        throw res.message
      }
    }).catch(e => {
      console.error('播放歌曲失败：', e)
    })
  },
  playMusic (data) {
    const bam = wx.getBackgroundAudioManager()
    bam.title = data.name
    bam.singer = data.ar
    bam.coverImgUrl = data.al.picUrl
    bam.src = data.url
  },
  globalData: {
    userInfo: null,
    musicInfo: null,
    musicList: null
  }
})
