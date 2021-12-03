import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify'
import md5 from 'md5'
const api = require('./api')

Page({
  data: {
    loginType: 'sms',
    SEND_CAPTCHA: 'SEND_CAPTCHA',
    countdown: 0,
    timer: undefined,
    phone: '',
    password: '',
    captcha: '',
    phoneError: '',
    passwordError: '',
    captchaError: '',
    loading: {
      send: false,
      login: false
    }
  },
  onShow () {
    // 判断是否已经登录, 登录则直接进入首页
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
    // 计算发送验证码禁用时长
    this.getCountdown()
    this.data.timer = setInterval(this.getCountdown, 500)
  },
  onUnload () {
    clearInterval(this.data.timer)
    console.log('on unload')
  },
  toggleLoginType () {
    console.log('toggleLoginType')
    const loginType = this.data.loginType === 'password' ? 'sms' : 'password'
    this.setData({ loginType })
  },
  // 登录操作
  login () {
    if (this.validate()) {
      const { phone, password, captcha } = this.data
      const params = { phone,  captcha }
      this.setData({ 'loading.login': true })
      api.loginCellPhone(params).then(res => {
        if (res.code === 200) {
          if (res.cookie) {
            wx.setStorageSync('cookie', encodeURIComponent(res.cookie))
            wx.switchTab({ url: '../user/user' })
          }
        } else {
          throw res.message
        }
      }).catch(e => {
        Notify({ type: 'danger', message: '登录失败：' + e })
      }).finally(() => {
        this.setData({ 'loading.login': false })
      })
    }
  },
  sendCaptcha () {
    if (this.validatePhone(this.data.phone)) {
      const params = { phone: this.data.phone }
      this.setData({ 'loading.send': true })
      api.sendCaptcha(params).then(res => {
        if (res.code === 200) {
          Notify({ type: 'success', message: '验证码已发送' })
        } else {
          throw res.message
        }
      }).catch(e => {
        Notify({ type: 'danger', message: '验证码发送失败：' + e })
      }).finally(() => {
        this.setCountdown()
        this.getCountdown()
        this.setData({ 'loading.send': false })
      })
    }
  },
  // 校验用户名密码
  validate () {
    let valid = true
    const { phone, password, captcha } = this.data
    valid = this.validatePhone(phone)
    if (this.loginType === 'password') {
      if (!password) {
        this.setData({ passwordError: '请输入密码' })
        valid = false
      }
    } else {
      if (!captcha) {
        this.setData({ captchaError: '请输入验证码' })
        valid = false
      }
    }
    return valid
  },
  validatePhone (phone) {
    const phoneReg = /^[1][3,4,5,7,8,9][0-9]{9}$/
    if (!phoneReg.test(phone)) {
      this.setData({ phoneError: '请输入正确的手机号' })
      return false
    }
    return true
  },
  // 清除错误信息
  onPhoneChange (e) {
    if (e.detail) {
      this.setData({ phoneError: '' })
    }
  },
  // 清除错误信息
  onPasswordChange (e) {
    if (e.detail) {
      this.setData({ passwordError: '' })
    }
  },
  // 清除错误信息
  onCaptchaChange (e) {
    if (e.detail) {
      this.setData({ captchaError: '' })
    }
  },
  getCountdown () {
    const timestamp = wx.getStorageSync(this.data.SEND_CAPTCHA)
    if (timestamp) {
      const countdown = parseInt((timestamp - new Date().valueOf()) / 1000)
      this.setData({ countdown: countdown < 0 ? 0 : countdown })
    } else {
      this.setData({ countdown: 0 })
    }
  },
  setCountdown () {
    const timestamp = new Date().valueOf() + 1000 * 60
    wx.setStorageSync(this.data.SEND_CAPTCHA, timestamp)
  }
})