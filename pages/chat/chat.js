import { chatWithAI } from '../../utils/ai.js'
import { formatTime } from '../../utils/format.js'

Page({
  data: {
    messages: [],
    inputText: '',
    isTyping: false,
    isRecording: false,
    sessionId: '',
    scrollToView: '',
    userInfo: null,
    quickQuestions: [
      { id: 1, icon: '💼', question: '公司拖欠工资怎么办？' },
      { id: 2, icon: '🏠', question: '离婚财产如何分割？' },
      { id: 3, icon: '📝', question: '借条怎么写才有效？' },
      { id: 4, icon: '⚖️', question: '交通事故怎么索赔？' }
    ]
  },

  onLoad() {
    const app = getApp()
    this.setData({
      userInfo: app.globalData.userInfo,
      sessionId: this.generateSessionId()
    })
    this.addWelcomeMessage()
  },

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  },

  addWelcomeMessage() {
    const welcomeMsg = {
      id: Date.now(),
      role: 'assistant',
      content: '您好！我是您的AI法律顾问。我可以为您解答各类法律问题，包括但不限于婚姻家庭、劳动纠纷、合同事务、刑事辩护等。请告诉我您遇到了什么法律问题？',
      time: formatTime(new Date()),
      isTyping: false,
      liked: false
    }
    this.setData({
      messages: [welcomeMsg]
    })
  },

  onInput(e) {
    this.setData({
      inputText: e.detail.value
    })
  },

  async sendMessage() {
    const { inputText, messages, sessionId } = this.data
    
    if (!inputText.trim()) {
      wx.showToast({
        title: '请输入问题',
        icon: 'none'
      })
      return
    }

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: inputText.trim(),
      time: formatTime(new Date())
    }

    const newMessages = [...messages, userMsg]
    this.setData({
      messages: newMessages,
      inputText: '',
      isTyping: true
    })

    this.scrollToBottom()

    try {
      const response = await chatWithAI(newMessages, sessionId)
      
      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.answer || '抱歉，我暂时无法回答这个问题。建议您咨询专业律师。',
        time: formatTime(new Date()),
        isTyping: false,
        liked: false
      }

      this.setData({
        messages: [...newMessages, aiMsg],
        isTyping: false
      })

      this.scrollToBottom()
      this.saveChatRecord()
    } catch (error) {
      console.error('Chat error:', error)
      this.setData({
        isTyping: false
      })
      wx.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
    }
  },

  sendQuickQuestion(e) {
    const question = e.currentTarget.dataset.question
    this.setData({
      inputText: question
    })
    this.sendMessage()
  },

  toggleRecording() {
    this.setData({
      isRecording: !this.data.isRecording
    })
  },

  startRecord() {
    this.setData({ isRecording: true })
    
    const recorderManager = wx.getRecorderManager()
    recorderManager.start({
      format: 'mp3'
    })

    recorderManager.onStop((res) => {
      this.setData({ isRecording: false })
      this.recognizeSpeech(res.tempFilePath)
    })

    this.recorderManager = recorderManager
  },

  stopRecord() {
    if (this.recorderManager) {
      this.recorderManager.stop()
    }
  },

  async recognizeSpeech(filePath) {
    wx.showLoading({
      title: '识别中...'
    })

    try {
      this.setData({
        inputText: '语音识别内容'
      })
      wx.hideLoading()
      wx.showToast({
        title: '识别成功',
        icon: 'success'
      })
    } catch (error) {
      wx.hideLoading()
      wx.showToast({
        title: '识别失败',
        icon: 'none'
      })
    }
  },

  copyMessage(e) {
    const index = e.currentTarget.dataset.index
    const content = this.data.messages[index].content
    
    wx.setClipboardData({
      data: content,
      success: () => {
        wx.showToast({
          title: '已复制',
          icon: 'success'
        })
      }
    })
  },

  playAudio(e) {
    wx.showToast({
      title: '语音播放开发中',
      icon: 'none'
    })
  },

  likeMessage(e) {
    const index = e.currentTarget.dataset.index
    const key = `messages[${index}].liked`
    this.setData({
      [key]: !this.data.messages[index].liked
    })
  },

  clearChat() {
    wx.showModal({
      title: '提示',
      content: '确定要清空聊天记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            messages: [],
            sessionId: this.generateSessionId()
          })
          this.addWelcomeMessage()
        }
      }
    })
  },

  scrollToBottom() {
    setTimeout(() => {
      this.setData({
        scrollToView: 'msg-' + this.data.messages[this.data.messages.length - 1].id
      })
    }, 100)
  },

  saveChatRecord() {
    const { messages, sessionId } = this.data
    const records = wx.getStorageSync('chatRecords') || []
    const record = {
      id: sessionId,
      title: messages[1]?.content?.substring(0, 30) + '...' || '新的咨询',
      messages: messages,
      time: new Date().toISOString()
    }
    records.unshift(record)
    wx.setStorageSync('chatRecords', records.slice(0, 50))
  }
})