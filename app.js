App({
  globalData: {
    userInfo: null,
    token: '',
    isLogin: false
  },

  onLaunch() {
    this.checkLoginStatus()
    this.initCloud()
  },

  initCloud() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'your-env-id',
        traceUser: true
      })
    }
  },

  checkLoginStatus() {
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')
    if (token && userInfo) {
      this.globalData.token = token
      this.globalData.userInfo = userInfo
      this.globalData.isLogin = true
    }
  },

  setUserInfo(userInfo) {
    this.globalData.userInfo = userInfo
    wx.setStorageSync('userInfo', userInfo)
  },

  setToken(token) {
    this.globalData.token = token
    wx.setStorageSync('token', token)
    this.globalData.isLogin = true
  },

  logout() {
    this.globalData.userInfo = null
    this.globalData.token = ''
    this.globalData.isLogin = false
    wx.removeStorageSync('userInfo')
    wx.removeStorageSync('token')
  }
})