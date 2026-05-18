import { loginByCode, loginByPhone } from '../../services/user.js'

Page({
  data: {
    loginType: 'wechat',
    userInfo: {},
    phoneNumber: '',
    verifyCode: '',
    countdown: 0,
    agreed: false
  },

  onLoad() {
    const app = getApp()
    if (app.globalData.isLogin) {
      wx.switchTab({
        url: '/pages/profile/profile'
      })
    }
  },

  switchTab(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      loginType: type
    })
  },

  getUserInfo(e) {
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo
      })
    }
  },

  async wechatLogin() {
    if (!this.data.userInfo.nickName) {
      wx.showToast({
        title: '请先获取微信信息',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '登录中...'
    })

    try {
      wx.login({
        success: async (res) => {
          if (res.code) {
            const result = await loginByCode(res.code)
            
            const app = getApp()
            app.setUserInfo(this.data.userInfo)
            app.setToken('mock_token_' + Date.now())

            wx.hideLoading()
            wx.showToast({
              title: '登录成功',
              icon: 'success'
            })

            setTimeout(() => {
              wx.switchTab({
                url: '/pages/profile/profile'
              })
            }, 1500)
          }
        }
      })
    } catch (error) {
      wx.hideLoading()
      console.error('Login error:', error)
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
    }
  },

  onPhoneInput(e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },

  onCodeInput(e) {
    this.setData({
      verifyCode: e.detail.value
    })
  },

  sendVerifyCode() {
    if (this.data.countdown > 0) return

    const phone = this.data.phoneNumber
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }

    this.setData({
      countdown: 60
    })

    const timer = setInterval(() => {
      if (this.data.countdown > 0) {
        this.setData({
          countdown: this.data.countdown - 1
        })
      } else {
        clearInterval(timer)
      }
    }, 1000)

    wx.showToast({
      title: '验证码已发送',
      icon: 'success'
    })
  },

  toggleAgreement() {
    this.setData({
      agreed: !this.data.agreed
    })
  },

  async phoneLogin() {
    const { phoneNumber, verifyCode, agreed } = this.data

    if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }

    if (verifyCode.length !== 6) {
      wx.showToast({
        title: '请输入正确的验证码',
        icon: 'none'
      })
      return
    }

    if (!agreed) {
      wx.showToast({
        title: '请阅读并同意用户协议',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '登录中...'
    })

    try {
      const result = await loginByPhone(phoneNumber)
      
      const app = getApp()
      const userInfo = {
        nickName: '用户' + phoneNumber.slice(-4),
        avatarUrl: ''
      }
      app.setUserInfo(userInfo)
      app.setToken('mock_token_' + Date.now())

      wx.hideLoading()
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      })

      setTimeout(() => {
        wx.switchTab({
          url: '/pages/profile/profile'
        })
      }, 1500)
    } catch (error) {
      wx.hideLoading()
      console.error('Phone login error:', error)
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
    }
  },

  viewAgreement() {
    wx.showToast({
      title: '用户协议开发中',
      icon: 'none'
    })
  },

  viewPrivacy() {
    wx.showToast({
      title: '隐私政策开发中',
      icon: 'none'
    })
  }
})