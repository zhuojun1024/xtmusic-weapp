Component({
  data: {
    currentMusicId: undefined,
    musicList: [],
    showPlayList: false,
    timer: undefined,
    currentValue: 0,
    currentTime: 0,
    duration: 0,
    name: '歌曲名称',
    ar: '歌手',
    coverImgUrl: '',
    playState: 'pause',
    active: 0,
    list: [{
      text: "搜索",
      url: "/pages/search/search",
      icon: 'search'
    }, {
      text: '歌单',
      url: '/pages/index/index',
      icon: 'like-o'
    }, {
      text: '个人',
      url: '/pages/user/user',
      icon: 'friends-o'
    }]
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.setMusicInfo()
      this.refreshState()
      const timer = setInterval(() => {
        this.setMusicInfo()
        this.refreshState()
      }, 500)
      this.setData({ timer })
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
      clearInterval(this.data.timer)
    },
  },
  methods: {
    showPlayControl () {
      if (this.data.currentMusicId) {
        wx.navigateTo({ url: '/pages/playControl/playControl' })
      }
    },
    getMusicUrl (e) {
      const id = e.currentTarget.dataset.id
      const record = this.data.musicList.find(item => item.id === id)
      getApp().getMusicUrl(record)
    },
    onPopupShow () {
      this.setData({
        musicList: getApp().globalData.musicList,
        showPlayList: true
      })
    },
    onPopupClose () {
      this.setData({ showPlayList: false })
    },
    setMusicInfo () {
      const musicInfo = getApp().globalData.musicInfo
      if (musicInfo) {
        this.setData({
          currentMusicId: musicInfo.id,
          name: musicInfo.name,
          ar: musicInfo.ar,
          coverImgUrl: musicInfo.al.picUrl || ''
        })
      }
    },
    refreshState () {
      const bam = wx.getBackgroundAudioManager()
      if (bam && bam.duration) {
        this.setData({
          playState: bam.paused ? 'pause' : 'playing',
          currentValue: bam.currentTime / bam.duration * 100,
          currentTime: this.formatTime(bam.currentTime),
          duration: this.formatTime(bam.duration)
        })
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
    },
		onChange (event) {
			this.setData({ active: event.detail });
			wx.switchTab({
				url: this.data.list[event.detail].url
			});
		},

		init () {
			const page = getCurrentPages().pop()
			this.setData({
				active: this.data.list.findIndex(item => item.url === `/${page.route}`)
			})
		}
  }
})
