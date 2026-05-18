Page({
  data: {
    isLogin: false,
    userInfo: {},
    userPhone: '',
    recordStats: {
      chat: 0,
      document: 0,
      contract: 0,
      consult: 0
    }
  },

  onLoad() {
    this.checkLoginStatus()
  },

  onShow() {
    this.checkLoginStatus()
    if (this.data.isLogin) {
      this.loadRecordStats()
    }
  },

  checkLoginStatus() {
    const app = getApp()
    this.setData({
      isLogin: app.globalData.isLogin,
      userInfo: app.globalData.userInfo || {}
    })
  },

  loadRecordStats() {
    const chatRecords = wx.getStorageSync('chatRecords') || []
    const documentRecords = wx.getStorageSync('documentRecords') || []
    const contractRecords = wx.getStorageSync('reviewRecords') || []
    const searchRecords = wx.getStorageSync('searchRecords') || []

    this.setData({
      recordStats: {
        chat: chatRecords.length,
        document: documentRecords.length,
        contract: contractRecords.length,
        consult: searchRecords.length
      }
    })
  },

  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  goToEdit() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  goToRecord(e) {
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/record/record?type=${type}`
    })
  },

  goToFavoriteLawyers() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  goToConsultations() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  goToWallet() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  goToCoupon() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  goToSettings() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  goToFeedback() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  goToAbout() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          const app = getApp()
          app.logout()
          this.setData({
            isLogin: false,
            userInfo: {},
            recordStats: {
              chat: 0,
              document: 0,
              contract: 0,
              consult: 0
            }
          })
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })
        }
      }
    })
  }
})