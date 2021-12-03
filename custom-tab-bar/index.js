Component({
  data: {
    bam: undefined,
    timer: undefined,
    currentValue: 10,
    currentTime: 0,
    duration: 0,
    name: '歌曲名称',
    ar: '歌手',
    playState: 'pause',
    active: 0,
    list: [{
      text: '首页',
      url: '/pages/index/index',
      icon: 'home-o'
    }, {
      text: '个人',
      url: '/pages/user/user',
      icon: 'friends-o'
    }]
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.setData({ bam: getApp().data.bam })
      this.refreshState()
      const timer = setInterval(this.refreshState.bind(this), 500)
      this.setData({ timer })
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
      clearInterval(this.data.timer)
    },
  },
  methods: {
    refreshState () {
      const bam = this.data.bam
      if (bam && bam.duration) {
        const currentMusic = getApp().data.currentMusic || {}
        this.setData({
          playState: bam.paused ? 'pause' : 'playing',
          currentValue: bam.currentTime / bam.duration * 100,
          currentTime: this.formatTime(bam.currentTime),
          duration: this.formatTime(bam.duration),
          name: currentMusic.name,
          ar: currentMusic.ar
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
      const { bam, playState } = this.data
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
