Page({
  data: {
    hotDocuments: [
      { id: 1, type: 'indictment', icon: '📝', name: '民事起诉状', desc: '用于民事诉讼立案' },
      { id: 2, type: 'defense', icon: '📋', name: '答辩状', desc: '针对起诉进行答辩' },
      { id: 3, type: 'agreement', icon: '🤝', name: '离婚协议书', desc: '协议离婚必备文书' },
      { id: 4, type: 'labor', icon: '💼', name: '劳动仲裁申请书', desc: '劳动争议维权文书' }
    ],
    recommendLawyers: [
      { 
        id: 1, 
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20male%20lawyer%20portrait%20formal%20suit&image_size=square_hd', 
        name: '张明律师', 
        title: '合伙人律师', 
        specialty: '刑事辩护' 
      },
      { 
        id: 2, 
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20female%20lawyer%20portrait%20formal%20suit&image_size=square_hd', 
        name: '李静律师', 
        title: '资深律师', 
        specialty: '婚姻家事' 
      },
      { 
        id: 3, 
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20male%20lawyer%20portrait%20business%20law&image_size=square_hd', 
        name: '王强律师', 
        title: '主任律师', 
        specialty: '合同纠纷' 
      }
    ],
    news: [
      { id: 1, title: '民法典关于合同编的最新司法解释解读', time: '2小时前', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=law%20book%20and%20gavel%20legal%20document&image_size=square' },
      { id: 2, title: '2024年劳动法规重大变化解读', time: '5小时前', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=business%20contract%20legal%20agreement&image_size=square' },
      { id: 3, title: '最高法发布典型知识产权案例', time: '1天前', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=justice%20scales%20law%20concept&image_size=square' }
    ]
  },

  onLoad() {
    
  },

  goToChat() {
    wx.switchTab({
      url: '/pages/chat/chat'
    })
  },

  goToDocument() {
    wx.navigateTo({
      url: '/pages/document/document'
    })
  },

  goToContract() {
    wx.navigateTo({
      url: '/pages/contract/contract'
    })
  },

  goToCase() {
    wx.navigateTo({
      url: '/pages/case/case'
    })
  },

  goToLawyer() {
    wx.switchTab({
      url: '/pages/lawyer/lawyer'
    })
  },

  goToLawyerDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/lawyerDetail/lawyerDetail?id=${id}`
    })
  },

  selectDocument(e) {
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/document/document?type=${type}`
    })
  }
})