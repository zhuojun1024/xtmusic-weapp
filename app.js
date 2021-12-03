// app.js
App({
  data: {
    currentMusic: {},
    bam: undefined
  },
  onLaunch() {
    this.data.bam = wx.getBackgroundAudioManager()
  },
  playMusic (data) {
    this.data.currentMusic = data
    const bam = this.data.bam
    bam.title = data.name
    bam.singer = data.ar
    bam.src = data.url
  },
  globalData: {
    userInfo: null
  }
})
