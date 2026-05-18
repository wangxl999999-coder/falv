import { getLawyerDetail, getLawyerCases } from '../../services/lawyer.js'

Page({
  data: {
    lawyerId: null,
    lawyer: {
      id: 1,
      name: '张明',
      title: '合伙人律师',
      firm: '北京市某某律师事务所',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20male%20lawyer%20portrait%20formal%20suit%20headshot&image_size=square_hd',
      tags: ['刑事辩护', '合同纠纷', '公司法律', '债权债务'],
      caseCount: 328,
      winRate: 86,
      experience: 15,
      rating: 4.9,
      price: 299,
      intro: '张明律师，北京大学法学院毕业，法学硕士学位。执业15年以来，专注于刑事辩护和合同纠纷领域，累计办理各类案件300余件。曾成功代理多起重大疑难刑事案件，为多名当事人争取到取保候审、不起诉或缓刑的理想结果。在合同纠纷领域，张律师擅长处理各类复杂的商事合同争议，为当事人挽回经济损失累计超过亿元。',
      cases: [
        {
          id: 1,
          title: '王某某涉嫌职务侵占案',
          result: '成功辩护，检察院作出不起诉决定'
        },
        {
          id: 2,
          title: '某科技公司合同纠纷案',
          result: '一审胜诉，为当事人挽回损失800万元'
        },
        {
          id: 3,
          title: '李某某涉嫌诈骗案',
          result: '成功取保候审，最终判处缓刑'
        }
      ],
      reviews: [
        {
          id: 1,
          userName: '用户***8',
          date: '2024-01-15',
          rating: 5,
          content: '张律师非常专业，分析问题很透彻，给出的建议很实用。沟通也很耐心，强烈推荐！'
        },
        {
          id: 2,
          userName: '用户***2',
          date: '2024-01-10',
          rating: 5,
          content: '咨询了劳动仲裁的问题，张律师帮我梳理了整个流程和关键点，让我心里有底了。'
        }
      ]
    }
  },

  onLoad(options) {
    const id = options.id
    this.setData({
      lawyerId: id
    })
    this.loadLawyerDetail(id)
  },

  async loadLawyerDetail(id) {
    try {
      const detail = await getLawyerDetail(id)
      const cases = await getLawyerCases(id)
    } catch (error) {
      console.error('Load lawyer detail error:', error)
    }
  },

  startChat() {
    const app = getApp()
    if (!app.globalData.isLogin) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return
    }
    
    wx.showToast({
      title: '聊天功能开发中',
      icon: 'none'
    })
  },

  startVideo() {
    const app = getApp()
    if (!app.globalData.isLogin) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return
    }

    wx.showModal({
      title: '确认预约',
      content: `确认预约${this.data.lawyer.name}律师的1对1视频咨询吗？费用¥${this.data.lawyer.price}/30分钟将从您的账户余额扣除。`,
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