const sdk = getApp().sdk;
const CGI = require('../../constant/cgi');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginShow: false,
    headimgurl: '',
    modelShow: false,
    noLogin: true,
    logSucces: false,
    userinfoData: {
      id: 3,
      nickname: "会员1705419011",
      headimgurl: "https://heshiwork.com/storage/202401/6f59640a09d3446fc47dda3ff065c53c.png",
      company: 0
    },
    persCenter: [{
        title: '我的信息',
        iconUrl: 'https://heshiwork.com/storage/202401/18401f9cdc2bee9dbbb652ae4a5cbf95.png',
        bindMethod: 'gotoMine',
        goUrl: '/pages/persdatalist/index',
        params: {
          resNum: "1"
        }
      },
      {
        title: '我的预约',
        iconUrl: 'https://heshiwork.com/storage/202401/cc50a44747493ed7c0c51c3292a69d2f.png',
        bindMethod: 'gotoMine',
        goUrl: '/pages/minemake/index',
        params: {}
      },
      {
        title: '我的收藏',
        iconUrl: 'https://heshiwork.com/storage/202401/8aeadcc3493bdddf2e4959cd6df7ca17.png',
        bindMethod: 'gotoMine',
        goUrl: '/pages/minecollect/index',
        params: {}
      }
    ],
    corpCcenter: [{
        title: '企业入驻',
        iconUrl: 'https://heshiwork.com/storage/202401/7c1f0f46708adaf412ca37a364973572.png',
        bindMethod: 'gotoMine',
        goUrl: '/pages/firmattestation/index',
        params: {}
      },
      {
        title: '职位管理',
        iconUrl: 'https://heshiwork.com/storage/202401/7c6866e83aca07861d340bbe16d2dbd2.png',
        bindMethod: 'gotoMine',
        goUrl: '/pages/position/index',
        params: {}
      },
      {
        title: '预定我的',
        iconUrl: 'https://heshiwork.com/storage/202401/802edcccab7141f9ce83c5e87a3a2a4d.png',
        bindMethod: 'gotoMine',
        goUrl: '/pages/reservemylist/index',
        params: {}
      },
      {
        title: '企业资产',
        iconUrl: 'https://heshiwork.com/storage/202401/a4d8649146dd4cbf7dbf913db3555fee.png',
        bindMethod: 'gotoMine',
        goUrl: '/pages/drawmoney/index',
        params: {}
      }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    if (wx.getStorageSync('logSucces')) {
      this.setData({
        logSucces: wx.getStorageSync('logSucces'),
        userinfoData: wx.getStorageSync('userinfoData'),
        userPhone: wx.getStorageSync('userPhone'),
        headimgurl:wx.getStorageSync('headimgurl'),
      })
    } else {
      this.setData({
        noLogin: false
      })
    }
    this.getadvertisement()
  },
  gotoMine(e) {
    console.log(e)
    const logSucces = wx.getStorageSync('logSucces')
    if (logSucces) {
      const item = e.currentTarget.dataset.item
      const _this = this;
      _this.setData({
        params: item.params
      });
      wx.navigateTo({
        url: item.goUrl,
      })
    } else {
      wx.showToast({
        title: '您还未登录小程序',
        icon: 'none',
        duration: 2000
      })
    }
  },
  // 登录获取手机号
  bindgetphonenumber(e) {
    sdk.utils.extend.showLoading('加载中');
    // 接口正常
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      sdk.utils.session.getphonenumber(e.detail.code).then(logSucces => {
        this.setData({
          logSucces,
          loginShow: false
        })
      }).then(res => {
        console.log("------------------------", res)
        this.setData({
          userinfoData: wx.getStorageSync('userinfoData'),
          userPhone: wx.getStorageSync('userPhone'),
          noLogin: true,
          loginShow: false
        })
      })
    } else {
      sdk.utils.extend.hideLoading();
      console.log("取消获取数据")
      const logSucces = false;
      wx.setStorageSync('logSucces', logSucces)
      this.setData({
        logSucces,
        noLogin: false
      })
    }

  },
  getadvertisement() {
    sdk.utils.extend.showLoading('加载中');
    sdk.request({
      url: CGI.getadvertisement,
      method: 'GET',
      data: {}
    }).then(res => {
      console.log("广告位-------------", res)
      sdk.utils.extend.hideLoading()
      this.setData({
        advertiData: res.data
      })
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err);
    })
  },
  gono() {
    this.setData({
      modelShow: false
    })
  },
  gotoModel() {
    this.setData({
      modelShow: true
    })
  },
  //js文件
  // 用户选择头像

  onChooseAvatar(e) {
    sdk.utils.extend.showLoading('加载中');
    const {
      avatarUrl
    } = e.detail
    console.log(avatarUrl);
    sdk.request({
      url: CGI.getset_userinfo,
      method: 'POST',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        nickname: '',
        headimgurl: avatarUrl
      }
    }).then(res => {
      console.log("头像上传成功------------", res)
      this.setData({
        headimgurl: avatarUrl,
      })
      sdk.utils.extend.hideLoading()
      wx.setStorageSync('headimgurl', avatarUrl)
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err);
    })
  },
  goLogin() {
    this.setData({
      loginShow: true
    })
  },
  goAgreement(){
    wx.navigateTo({
      url: '/pages/agreement/index',
    })
  },
  gotoClause(){
    sdk.utils.extend.showLoading('加载中');
    sdk.request({
      url: CGI.getpcst,
      method: 'GET',
      data: {}
    }).then(res => {
      console.log("服务条款------------", res)
      if(res.msg == '请求成功'){
      this.setData({
        params: {
          txt:res.data,
        }
      });
      wx.navigateTo({
        url: '/pages/termservice/index',
      })
      }
      sdk.utils.extend.hideLoading()
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err);
    })
  }
})