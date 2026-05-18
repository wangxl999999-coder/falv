import { uploadFile, reviewContract } from '../../utils/ai.js'

Page({
  data: {
    currentStep: 'upload',
    selectedFile: null,
    filePath: '',
    currentReviewStep: '正在解析文档...',
    reviewProgress: 0,
    reviewResult: {
      score: 75,
      level: 'medium',
      levelText: '中等风险',
      highRiskCount: 2,
      mediumRiskCount: 3,
      lowRiskCount: 1,
      risks: [
        {
          id: 1,
          level: 'high',
          levelText: '高风险',
          category: '违约责任',
          description: '合同中未明确约定违约金的计算方式和上限，可能导致在一方违约时，守约方难以主张合理的赔偿金额。',
          suggestion: '建议增加违约金条款，明确约定违约金的计算标准（如按合同总金额的20%计算），同时约定违约金不足以弥补损失时的赔偿方式。'
        },
        {
          id: 2,
          level: 'high',
          levelText: '高风险',
          category: '争议解决',
          description: '争议解决条款选择了仲裁但未明确具体的仲裁机构，根据法律规定，该仲裁条款可能被认定为无效。',
          suggestion: '建议明确约定具体的仲裁委员会名称，如"中国国际经济贸易仲裁委员会"或"北京仲裁委员会"。'
        },
        {
          id: 3,
          level: 'medium',
          levelText: '中风险',
          category: '付款条款',
          description: '付款时间约定不够具体，仅约定"验收合格后付款"，未明确具体的付款期限，容易产生争议。',
          suggestion: '建议将付款时间明确为"验收合格后15个工作日内"，并增加逾期付款的违约责任条款。'
        },
        {
          id: 4,
          level: 'medium',
          levelText: '中风险',
          category: '保密条款',
          description: '保密条款中未明确保密义务的期限，也未约定保密信息的范围，可操作性较差。',
          suggestion: '建议明确保密信息的具体范围，并约定保密期限为"合同终止后3年"。'
        },
        {
          id: 5,
          level: 'medium',
          levelText: '中风险',
          category: '合同解除',
          description: '未约定合同解除的具体条件和程序，当一方出现违约时，另一方行使解除权可能存在障碍。',
          suggestion: '建议增加合同解除条款，明确约定解除合同的具体情形、通知方式和解除后的处理方式。'
        },
        {
          id: 6,
          level: 'low',
          levelText: '低风险',
          category: '合同生效',
          description: '合同生效条件仅约定了"双方签字盖章"，建议考虑是否需要满足其他条件。',
          suggestion: '可根据实际情况增加生效条件，如"本合同自甲方支付预付款之日起生效"等。'
        }
      ]
    }
  },

  onLoad() {

  },

  chooseFile() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
      success: (res) => {
        const file = res.tempFiles[0]
        this.setData({
          selectedFile: {
            name: file.name,
            size: this.formatFileSize(file.size)
          },
          filePath: file.path
        })
      },
      fail: (err) => {
        console.error('Choose file error:', err)
        wx.showToast({
          title: '选择文件失败',
          icon: 'none'
        })
      }
    })
  },

  formatFileSize(bytes) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  },

  removeFile() {
    this.setData({
      selectedFile: null,
      filePath: ''
    })
  },

  async startReview() {
    if (!this.data.filePath) {
      wx.showToast({
        title: '请先选择文件',
        icon: 'none'
      })
      return
    }

    this.setData({
      currentStep: 'reviewing'
    })

    this.simulateReviewProgress()

    try {
      await uploadFile(this.data.filePath)
      
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const result = await reviewContract('fileId')
      
      setTimeout(() => {
        this.setData({
          currentStep: 'result'
        })
        this.saveReviewRecord()
      }, 2000)
    } catch (error) {
      console.error('Review error:', error)
      this.setData({
        currentStep: 'upload'
      })
      wx.showToast({
        title: '审查失败，请重试',
        icon: 'none'
      })
    }
  },

  simulateReviewProgress() {
    const steps = [
      { progress: 20, text: '正在解析文档...' },
      { progress: 40, text: '正在提取条款...' },
      { progress: 60, text: '正在识别风险...' },
      { progress: 80, text: '正在生成建议...' },
      { progress: 100, text: '审查完成！' }
    ]

    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < steps.length && this.data.currentStep === 'reviewing') {
        this.setData({
          reviewProgress: steps[currentStep].progress,
          currentReviewStep: steps[currentStep].text
        })
        currentStep++
      } else {
        clearInterval(interval)
      }
    }, 600)
  },

  reUpload() {
    this.setData({
      currentStep: 'upload',
      selectedFile: null,
      filePath: '',
      reviewProgress: 0
    })
  },

  downloadReport() {
    wx.showToast({
      title: '下载功能开发中',
      icon: 'none'
    })
  },

  consultLawyer() {
    wx.switchTab({
      url: '/pages/lawyer/lawyer'
    })
  },

  saveReviewRecord() {
    const { selectedFile, reviewResult } = this.data
    const records = wx.getStorageSync('reviewRecords') || []
    const record = {
      id: Date.now(),
      fileName: selectedFile.name,
      score: reviewResult.score,
      level: reviewResult.level,
      levelText: reviewResult.levelText,
      result: reviewResult,
      time: new Date().toISOString()
    }
    records.unshift(record)
    wx.setStorageSync('reviewRecords', records.slice(0, 50))
  }
})