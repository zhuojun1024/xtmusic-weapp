import api from './api'
Page({
  data: {
    lyrics: [],
    currentMusicId: undefined,
    name: '',
    ar: '',
    coverImgUrl: '',
    playState: 'pause',
    currentValue: 0,
    currentTime: 0,
    duration: 0,
    timer: undefined,
    draging: false
  },
  onShow () {
    // 在组件实例进入页面节点树时执行
    this.setMusicInfo()
    this.refreshState()
    const timer = setInterval(() => {
      this.setMusicInfo()
      this.refreshState()
    }, 500)
    this.setData({ musicInfo: getApp().globalData.musicInfo, timer })
  },
  onUnload () {
    // 在组件实例被从页面节点树移除时执行
    clearInterval(this.data.timer)
  },
  getLyric () {
    const timestamp = new Date().getTime()
    const params = { id: this.data.currentMusicId, timestamp }
    api.getLyric(params).then(res => {
      if (res.code === 200) {
        const lyric = res.lrc.lyric
        this.setData({ lyrics: this.handleLyric(lyric) })
      } else {
        throw res.msg
      }
    }).catch(e => {
      console.error('获取歌词失败：', e)
    })
  },
  // 处理歌词，按顺序一行行存入数组
  handleLyric (lyric) {
    if(lyric.length === 0) return []
    const lyricstxt = []
    const lrcs = lyric.split('\n')
    for (const i in lrcs) {
      lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, '')
      const t = lrcs[i].substring(lrcs[i].indexOf('[') + 1, lrcs[i].indexOf(']'))
      const s = t.split(':')
      if(!isNaN(parseInt(s[0]))) {
        const arr = lrcs[i].match(/\[(\d+:.+?)\]/g)
        let start = 0
        for(const k in arr){
          start += arr[k].length
        }
        const content = lrcs[i].substring(start)
        if (content) {
          lyricstxt.push(content)
        }
      }
    }
    return lyricstxt
  },
  onDragStart () {
    this.setData({ draging: true })
  },
  onDragEnd (e) {
    this.setData({ draging: false })
  },
  onSliderChange (e) {
    const percent = e.detail / 100
    const bam = wx.getBackgroundAudioManager()
    const currentTime = bam.duration * percent
    bam.seek(currentTime)
  },
  onPrev () {
    getApp().onPrev()
  },
  onNext () {
    getApp().onNext()
  },
  setMusicInfo () {
    const musicInfo = getApp().globalData.musicInfo
    if (musicInfo) {
      const oldId = this.data.currentMusicId
      this.setData({
        currentMusicId: musicInfo.id,
        name: musicInfo.name,
        ar: musicInfo.ar,
        coverImgUrl: musicInfo.al.picUrl || ''
      })
      // 如果id变化，获取歌词
      if (musicInfo.id !== oldId) {
        this.getLyric()
      }
    }
  },
  refreshState () {
    const bam = wx.getBackgroundAudioManager()
    if (bam && bam.duration) {
      this.setData({
        playState: bam.paused ? 'pause' : 'playing',
        currentTime: this.formatTime(bam.currentTime),
        duration: this.formatTime(bam.duration)
      })
      if (!this.data.draging) {
        this.setData({
          currentValue: bam.currentTime / bam.duration * 100
        })
      }
    }
  },
  formatTime (sec) {
    const _sec = Math.ceil(sec || 0)
    const m = parseInt(_sec / 60)
    const s = _sec % 60
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
  },
  toggleState () {
    const bam = wx.getBackgroundAudioManager()
    const playState = this.data.playState
    if (!bam) return
    if (playState === 'playing') {
      this.setData({ playState: 'pause' })
      bam.pause()
    } else {
      this.setData({ playState: 'playing' })
      bam.play()
    }
  }
})