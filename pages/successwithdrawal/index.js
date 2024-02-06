const sdk = getApp().sdk;
const CGI = require('../../constant/cgi');
const {
  getPrevPageData
} = sdk.utils.pageData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    judge: false,
    numbers: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const pageData = getPrevPageData()
    console.log("上一个页面带过来的数据----", pageData)
    this.setData({
      balanced: pageData.balanced
    })
  },

  goCommit() {
    sdk.utils.extend.showLoading('加载中');
    if (this.data.numbers != '') {
      sdk.request({
        url: CGI.getcash_out,
        method: 'POST',
        header: {
          token: wx.getStorageSync('token')
        },
        data: {
          price: this.data.numbers
        }
      }).then(res => {
        sdk.utils.extend.hideLoading()
        console.log(res)
        if (res.msg == '操作成功') {
          this.setData({
            judge: !this.data.judge
          })
        } else {
          wx.showToast({
            title: '余额不足',
          })
        }
      }).catch(err => {
        sdk.utils.extend.hideLoading()
        console.log(err);
      })
    } else {
      wx.showToast({
        title: '请输入金额',
        icon: 'none'
      })
    }
  },
  goAll() {
    if (this.data.balanced > 0) {
      this.setData({
        numbers: this.data.balanced
      })
    } else {
      wx.showToast({
        title: '余额不足',
      })
    }
  },
  goBack() {
    wx.switchTab({
      url: '/pages/mine/index',
    })
  },
  eventhandle(e) {
    console.log(e)
    this.setData({
      numbers: e.detail.value
    })
  }
})