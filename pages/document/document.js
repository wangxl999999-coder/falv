import { generateDocument } from '../../utils/ai.js'

Page({
  data: {
    currentStep: 'select',
    documentTypes: [
      { type: 'indictment', icon: '📝', name: '民事起诉状', desc: '用于民事诉讼立案' },
      { type: 'defense', icon: '📋', name: '答辩状', desc: '针对起诉进行答辩' },
      { type: 'appeal', icon: '📑', name: '上诉状', desc: '不服判决提起上诉' },
      { type: 'arbitration', icon: '⚖️', name: '仲裁申请书', desc: '申请仲裁使用' },
      { type: 'divorce', icon: '💔', name: '离婚协议书', desc: '协议离婚必备文书' },
      { type: 'labor', icon: '💼', name: '劳动仲裁申请书', desc: '劳动争议维权' },
      { type: 'contract', icon: '🤝', name: '借款合同', desc: '规范借贷行为' },
      { type: 'will', icon: '📜', name: '遗嘱', desc: '财产分配安排' }
    ],
    selectedType: null,
    currentQuestion: 0,
    questions: [],
    answers: [],
    generatedContent: ''
  },

  onLoad(options) {
    if (options.type) {
      this.selectTypeByType(options.type)
    }
  },

  selectType(e) {
    const type = e.currentTarget.dataset.type
    this.selectTypeByType(type)
  },

  selectTypeByType(type) {
    const selectedType = this.data.documentTypes.find(t => t.type === type)
    if (selectedType) {
      this.setData({
        selectedType,
        currentStep: 'question',
        currentQuestion: 0,
        answers: []
      })
      this.loadQuestions(type)
    }
  },

  loadQuestions(type) {
    const questionMap = {
      indictment: [
        { title: '原告姓名', desc: '请填写原告的姓名', type: 'text', placeholder: '请输入原告姓名' },
        { title: '原告性别', desc: '请选择原告的性别', type: 'select', options: ['男', '女'] },
        { title: '原告民族', desc: '请填写原告的民族', type: 'text', placeholder: '请输入民族' },
        { title: '原告出生日期', desc: '请填写原告的出生日期', type: 'text', placeholder: '如：1990年1月1日' },
        { title: '原告住址', desc: '请填写原告的详细住址', type: 'textarea', placeholder: '请输入详细住址' },
        { title: '原告联系电话', desc: '请填写原告的联系电话', type: 'text', placeholder: '请输入电话号码' },
        { title: '被告姓名', desc: '请填写被告的姓名', type: 'text', placeholder: '请输入被告姓名' },
        { title: '被告住址', desc: '请填写被告的详细住址', type: 'textarea', placeholder: '请输入详细住址' },
        { title: '诉讼请求', desc: '请详细描述您的诉讼请求', type: 'textarea', placeholder: '请输入诉讼请求内容' },
        { title: '事实与理由', desc: '请详细描述案件事实和理由', type: 'textarea', placeholder: '请输入事实与理由' }
      ],
      defense: [
        { title: '答辩人姓名', desc: '请填写答辩人的姓名', type: 'text', placeholder: '请输入答辩人姓名' },
        { title: '被答辩人姓名', desc: '请填写被答辩人的姓名', type: 'text', placeholder: '请输入被答辩人姓名' },
        { title: '案由', desc: '请简述案件案由', type: 'text', placeholder: '如：民间借贷纠纷' },
        { title: '答辩意见', desc: '请详细描述您的答辩意见', type: 'textarea', placeholder: '请输入答辩意见内容' },
        { title: '事实与理由', desc: '请详细描述事实和理由', type: 'textarea', placeholder: '请输入事实与理由' }
      ],
      divorce: [
        { title: '男方姓名', desc: '请填写男方姓名', type: 'text', placeholder: '请输入男方姓名' },
        { title: '女方姓名', desc: '请填写女方姓名', type: 'text', placeholder: '请输入女方姓名' },
        { title: '结婚时间', desc: '请填写结婚登记时间', type: 'text', placeholder: '如：2010年10月10日' },
        { title: '子女情况', desc: '请说明是否有子女及子女情况', type: 'textarea', placeholder: '请输入子女情况' },
        { title: '财产分割意见', desc: '请填写财产分割意见', type: 'textarea', placeholder: '请输入财产分割意见' },
        { title: '债务处理意见', desc: '请填写债务处理意见', type: 'textarea', placeholder: '请输入债务处理意见' }
      ]
    }

    const defaultQuestions = [
      { title: '当事人姓名', desc: '请填写当事人姓名', type: 'text', placeholder: '请输入姓名' },
      { title: '详细内容', desc: '请详细描述您的需求', type: 'textarea', placeholder: '请输入详细内容' }
    ]

    this.setData({
      questions: questionMap[type] || defaultQuestions
    })
  },

  onAnswerInput(e) {
    const { currentQuestion, answers } = this.data
    answers[currentQuestion] = e.detail.value
    this.setData({ answers })
  },

  selectOption(e) {
    const { currentQuestion, answers } = this.data
    answers[currentQuestion] = e.currentTarget.dataset.option
    this.setData({ answers })
  },

  prevQuestion() {
    if (this.data.currentQuestion > 0) {
      this.setData({
        currentQuestion: this.data.currentQuestion - 1
      })
    }
  },

  nextQuestion() {
    const { currentQuestion, questions, answers } = this.data
    if (!answers[currentQuestion]) {
      wx.showToast({
        title: '请回答当前问题',
        icon: 'none'
      })
      return
    }
    if (currentQuestion < questions.length - 1) {
      this.setData({
        currentQuestion: currentQuestion + 1
      })
    }
  },

  async generateDocument() {
    const { selectedType, questions, answers } = this.data

    const unanswered = questions.findIndex((q, i) => !answers[i])
    if (unanswered !== -1) {
      this.setData({ currentQuestion: unanswered })
      wx.showToast({
        title: '请回答所有问题',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '正在生成文书...'
    })

    try {
      const answerData = questions.map((q, i) => ({
        question: q.title,
        answer: answers[i]
      }))

      const response = await generateDocument(selectedType.type, answerData)

      const content = this.formatDocument(selectedType.type, answerData)

      this.setData({
        currentStep: 'result',
        generatedContent: content
      })

      wx.hideLoading()
      this.saveDocumentRecord(content)
    } catch (error) {
      console.error('Generate error:', error)
      wx.hideLoading()
      wx.showToast({
        title: '生成失败，请重试',
        icon: 'none'
      })
    }
  },

  formatDocument(type, answers) {
    const answerMap = {}
    answers.forEach(a => {
      answerMap[a.question] = a.answer
    })

    if (type === 'indictment') {
      return `
民事起诉状

原告：${answerMap['原告姓名'] || '___'}，${answerMap['原告性别'] || '_'}，${answerMap['原告民族'] || '_'}族，生于${answerMap['原告出生日期'] || '____年__月__日'}，住址：${answerMap['原告住址'] || '___'}，电话：${answerMap['原告联系电话'] || '___'}。

被告：${answerMap['被告姓名'] || '___'}，住址：${answerMap['被告住址'] || '___'}。

诉讼请求：
${answerMap['诉讼请求'] || '___'}

事实与理由：
${answerMap['事实与理由'] || '___'}

综上所述，为维护原告的合法权益，特向贵院提起诉讼，请求依法判决。

此致
____人民法院

起诉人：____
____年__月__日
附：本诉状副本__份
证据材料__份
      `.trim()
    }

    if (type === 'divorce') {
      return `
离婚协议书

男方：${answerMap['男方姓名'] || '___'}
女方：${answerMap['女方姓名'] || '___'}

男方与女方于${answerMap['结婚时间'] || '____年__月__日'}登记结婚，现因双方性格不合，夫妻感情已完全破裂，无和好可能，经双方自愿协商达成一致意见，订立离婚协议如下：

一、男女双方自愿离婚。

二、子女抚养、抚养费及探望权：
${answerMap['子女情况'] || '___'}

三、夫妻共同财产的处理：
${answerMap['财产分割意见'] || '___'}

四、债务的处理：
${answerMap['债务处理意见'] || '___'}

本协议一式三份，自婚姻登记机关颁发《离婚证》之日起生效，男、女双方各执一份，婚姻登记机关存档一份。

男方签字：____
女方签字：____
____年__月__日
      `.trim()
    }

    let content = `${this.data.selectedType.name}\n\n`
    answers.forEach(a => {
      content += `${a.question}：\n${a.answer}\n\n`
    })
    return content
  },

  goBack() {
    if (this.data.currentQuestion > 0) {
      this.prevQuestion()
    } else {
      this.setData({
        currentStep: 'select'
      })
    }
  },

  regenerate() {
    this.setData({
      currentStep: 'question',
      currentQuestion: 0
    })
  },

  copyDocument() {
    wx.setClipboardData({
      data: this.data.generatedContent,
      success: () => {
        wx.showToast({
          title: '已复制',
          icon: 'success'
        })
      }
    })
  },

  downloadDocument() {
    wx.showToast({
      title: '下载功能开发中',
      icon: 'none'
    })
  },

  saveDocumentRecord(content) {
    const { selectedType } = this.data
    const records = wx.getStorageSync('documentRecords') || []
    const record = {
      id: Date.now(),
      type: selectedType.type,
      typeName: selectedType.name,
      content: content,
      time: new Date().toISOString()
    }
    records.unshift(record)
    wx.setStorageSync('documentRecords', records.slice(0, 50))
  }
})