Component({
  data: {
    currentValue: 10,
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

  methods: {
    toggleState () {
      const playState = this.data.playState === 'playing' ? 'pause' : 'playing'
      this.setData({ playState })
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
