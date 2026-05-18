import { getLawyerList } from '../../services/lawyer.js'

Page({
  data: {
    selectedSpecialty: '',
    specialties: [
      { label: '刑事辩护', value: 'criminal' },
      { label: '婚姻家事', value: 'marriage' },
      { label: '合同纠纷', value: 'contract' },
      { label: '劳动争议', value: 'labor' },
      { label: '房产纠纷', value: 'property' },
      { label: '知识产权', value: 'ip' },
      { label: '交通事故', value: 'traffic' },
      { label: '债权债务', value: 'debt' }
    ],
    lawyerList: [
      {
        id: 1,
        name: '张明',
        title: '合伙人律师',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20male%20lawyer%20portrait%20formal%20suit%20headshot&image_size=square_hd',
        tags: ['刑事辩护', '合同纠纷', '公司法律'],
        caseCount: 328,
        winRate: 86,
        experience: 15,
        price: 299
      },
      {
        id: 2,
        name: '李静',
        title: '资深律师',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20female%20lawyer%20portrait%20formal%20suit%20headshot&image_size=square_hd',
        tags: ['婚姻家事', '遗产继承', '离婚纠纷'],
        caseCount: 256,
        winRate: 92,
        experience: 12,
        price: 199
      },
      {
        id: 3,
        name: '王强',
        title: '主任律师',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20male%20lawyer%20senior%20portrait%20formal&image_size=square_hd',
        tags: ['合同纠纷', '债权债务', '房产纠纷'],
        caseCount: 412,
        winRate: 89,
        experience: 18,
        price: 399
      },
      {
        id: 4,
        name: '刘芳',
        title: '专职律师',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20professional%20female%20lawyer%20portrait%20formal&image_size=square_hd',
        tags: ['劳动争议', '交通事故', '人身损害'],
        caseCount: 186,
        winRate: 85,
        experience: 8,
        price: 149
      },
      {
        id: 5,
        name: '陈伟',
        title: '合伙人律师',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=middle%20aged%20male%20lawyer%20professional%20portrait&image_size=square_hd',
        tags: ['知识产权', '专利商标', '商业秘密'],
        caseCount: 203,
        winRate: 78,
        experience: 14,
        price: 349
      }
    ]
  },

  onLoad() {
    this.loadLawyerList()
  },

  async loadLawyerList() {
    try {
      const filters = {
        specialty: this.data.selectedSpecialty
      }
      const result = await getLawyerList(filters)
    } catch (error) {
      console.error('Load lawyer list error:', error)
    }
  },

  selectSpecialty(e) {
    const value = e.currentTarget.dataset.value
    this.setData({
      selectedSpecialty: value
    })
    this.loadLawyerList()
  },

  focusSearch() {
    wx.showToast({
      title: '搜索功能开发中',
      icon: 'none'
    })
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/lawyerDetail/lawyerDetail?id=${id}`
    })
  },

  quickConsult(e) {
    const id = e.currentTarget.dataset.id
    const app = getApp()
    
    if (!app.globalData.isLogin) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return
    }

    wx.showModal({
      title: '确认咨询',
      content: '确认预约该律师的1对1视频咨询吗？费用将从您的账户余额扣除。',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '预约成功',
            icon: 'success'
          })
        }
      }
    })
  }
})