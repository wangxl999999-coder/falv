Page({
  data: {
    currentType: 'all',
    recordList: []
  },

  onLoad(options) {
    const type = options.type || 'all'
    this.setData({
      currentType: type
    })
    this.loadRecords()
  },

  switchTab(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      currentType: type
    })
    this.loadRecords()
  },

  loadRecords() {
    const { currentType } = this.data
    let allRecords = []

    if (currentType === 'all' || currentType === 'chat') {
      const chatRecords = wx.getStorageSync('chatRecords') || []
      chatRecords.forEach(item => {
        allRecords.push({
          id: item.id,
          type: 'chat',
          icon: '💬',
          title: item.title || 'AI法律咨询',
          desc: item.messages && item.messages.length > 1 ? item.messages[1].content.substring(0, 50) : '',
          time: this.formatTime(item.time)
        })
      })
    }

    if (currentType === 'all' || currentType === 'document') {
      const documentRecords = wx.getStorageSync('documentRecords') || []
      documentRecords.forEach(item => {
        allRecords.push({
          id: item.id,
          type: 'document',
          icon: '📄',
          title: item.typeName || '法律文书',
          desc: item.content ? item.content.substring(0, 50) : '',
          time: this.formatTime(item.time)
        })
      })
    }

    if (currentType === 'all' || currentType === 'contract') {
      const contractRecords = wx.getStorageSync('reviewRecords') || []
      contractRecords.forEach(item => {
        allRecords.push({
          id: item.id,
          type: 'contract',
          icon: '📋',
          title: item.fileName || '合同审查',
          desc: '风险评分: ' + (item.score || 0) + '分',
          time: this.formatTime(item.time)
        })
      })
    }

    allRecords.sort((a, b) => new Date(b.time) - new Date(a.time))

    this.setData({
      recordList: allRecords
    })
  },

  formatTime(timeStr) {
    const date = new Date(timeStr)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) {
      return '刚刚'
    } else if (diff < 3600000) {
      return Math.floor(diff / 60000) + '分钟前'
    } else if (diff < 86400000) {
      return Math.floor(diff / 3600000) + '小时前'
    } else if (diff < 604800000) {
      return Math.floor(diff / 86400000) + '天前'
    } else {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
  },

  viewRecord(e) {
    const item = e.currentTarget.dataset.item
    
    if (item.type === 'chat') {
      wx.showToast({
        title: '查看聊天记录',
        icon: 'none'
      })
    } else if (item.type === 'document') {
      wx.showToast({
        title: '查看文书详情',
        icon: 'none'
      })
    } else if (item.type === 'contract') {
      wx.showToast({
        title: '查看审查报告',
        icon: 'none'
      })
    }
  }
})