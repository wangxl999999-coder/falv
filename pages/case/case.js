import { searchCases } from '../../utils/ai.js'

Page({
  data: {
    currentStep: 'search',
    caseDescription: '',
    selectedCategory: '',
    caseCategories: [
      { label: '民间借贷', value: 'loan' },
      { label: '合同纠纷', value: 'contract' },
      { label: '婚姻家庭', value: 'marriage' },
      { label: '劳动争议', value: 'labor' },
      { label: '交通事故', value: 'traffic' },
      { label: '房产纠纷', value: 'property' },
      { label: '刑事辩护', value: 'criminal' },
      { label: '知识产权', value: 'ip' }
    ],
    quickCases: [
      { id: 1, icon: '💰', title: '民间借贷纠纷', content: '借款50万元，约定月利率2%，对方逾期未还本金和利息' },
      { id: 2, icon: '💔', title: '离婚财产分割', content: '夫妻双方感情破裂，婚后购买房产一套，存款100万元，如何分割' },
      { id: 3, icon: '💼', title: '劳动仲裁申请', content: '公司拖欠工资3个月，未缴纳社保，准备申请劳动仲裁' },
      { id: 4, icon: '🚗', title: '交通事故赔偿',': '对方全责但不配合理赔处理'}
    ],
    currentSearchStep: '正在分析案情特征...',
    searchedCount: 0,
    caseList: [
      {
        id: 1,
        title: '王某某与李某某民间借贷纠纷案',
        court: '北京市朝阳区人民法院',
        date: '2023-10-15',
        summary: '原告王某某向被告李某某出借50万元，约定月利率2%，借款期限6个月。被告逾期未还本金和利息，法院判决被告返还本金50万元并按年利率24%支付利息。'}
    ],
    currentCase: null
  },

  onLoad() {

  },

  onInput(e) {
    this.setData({
      caseDescription: e.detail.value
    })
  },

  selectCategory(e) {
    const value = e.currentTarget.dataset.value
    this.setData({
      selectedCategory: this.data.selectedCategory === value ? '' : value
    })
  },

  useQuickCase(e) {
    const content = e.currentTarget.dataset.content
    this.setData({
      caseDescription: content
    })
  },

  async startSearch() {
    if (!this.data.caseDescription.trim()) {
      wx.showToast({
        title: '请描述案情',
        icon: 'none'
      })
      return
    }

    this.setData({
      currentStep: 'searching'
    })

    this.simulateSearchProgress()

    try {
      const params = {
        description: this.data.caseDescription,
        category: this.data.selectedCategory
      }
      
      const result = await searchCases(params)
      
      setTimeout(() => {
        this.setData({
          currentStep: 'result'
        })
        this.saveSearchRecord()
      }, 2000)
    } catch (error) {
      console.error('Search error:', error)
      this.setData({
        currentStep: 'search'
      })
      wx.showToast({
        title: '检索失败，请重试',
        icon: 'none'
      })
    }
  },

  simulateSearchProgress() {
    const steps = [
      { progress: 20, text: '正在分析案情特征...', count: 1200 },
      { progress: 40, text: '正在提取关键词...', count: 5600 },
      { progress: 60, text: '正在匹配相似案例...', count: 12800 },
      { progress: 80, text: '正在计算相似度...', count: 25600 },
      { progress: 100, text: '检索完成！', count: 50000 }
    ]

    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < steps.length && this.data.currentStep === 'searching') {
        this.setData({
          currentSearchStep: steps[currentStep].text,
          searchedCount: steps[currentStep].count
        })
        currentStep++
      } else {
        clearInterval(interval)
      }
    }, 600)
  },

  viewCaseDetail(e) {
    const id = e.currentTarget.dataset.id
    const caseItem = this.data.caseList.find(c => c.id === id)
    
    const detailCase = {
      id: id,
      title: caseItem.title,
      court: caseItem.court,
      date: caseItem.date,
      facts: '2022年3月，被告李某某因资金周转向原告王某某借款50万元，双方签订借款合同，约定月利率2%，借款期限6个月。原告于当日通过银行转账方式将50万元转入被告账户。借款到期后，被告仅支付了前3个月利息3万元，本金和剩余利息至今未还。原告多次催讨无果，遂诉至法院。',
      issues: '1. 原被告之间的民间借贷关系是否合法有效；2. 约定的利率是否符合法律规定；3. 被告应当返还的本金和利息金额。',
      judgment: '一、被告李某某于本判决生效之日起十日内返还原告王某某借款本金500000元；二、被告李某某于本判决生效之日起十日内支付原告王某某借款利息（以500000元为基数，自2022年9月15日起至实际清偿之日止，按年利率24%计算）；三、驳回原告王某某的其他诉讼请求。',
      laws: [
        {
          id: 1,
          name: '《中华人民共和国民法典》第六百六十七条',
          content: '借款合同是借款人向贷款人借款，到期返还借款并支付利息的合同。'
        },
        {
          id: 2,
          name: '《中华人民共和国民法典》第六百七十六条',
          content: '借款人未按照约定的期限返还借款的，应当按照约定或者国家有关规定支付逾期利息。'
        },
        {
          id: 3,
          name: '《最高人民法院关于审理民间借贷案件适用法律若干问题的规定》第二十五条',
          content: '出借人请求借款人按照合同约定利率支付利息的，人民法院应予支持，但是双方约定的利率超过合同成立时一年期贷款市场报价利率四倍的除外。'
        }
      ]
    }

    this.setData({
      currentStep: 'detail',
      currentCase: detailCase
    })
  },

  goBack() {
    this.setData({
      currentStep: 'result'
    })
  },

  reSearch() {
    this.setData({
      currentStep: 'search',
      caseDescription: '',
      selectedCategory: ''
    })
  },

  toggleFilter() {
    wx.showToast({
      title: '筛选功能开发中',
      icon: 'none'
    })
  },

  consultLawyer() {
    wx.switchTab({
      url: '/pages/lawyer/lawyer'
    })
  },

  saveSearchRecord() {
    const { caseDescription, selectedCategory, caseList } = this.data
    const records = wx.getStorageSync('searchRecords') || []
    const record = {
      id: Date.now(),
      description: caseDescription,
      category: selectedCategory,
      resultCount: caseList.length,
      time: new Date().toISOString()
    }
    records.unshift(record)
    wx.setStorageSync('searchRecords', records.slice(0, 50))
  }
})