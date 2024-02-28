const sdk = getApp().sdk;
const CGI = require('../../constant/cgi');
const {
  getPrevPageData
} = sdk.utils.pageData;
const usedata = require('../../constant/usedata.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    zPges: 0,
    balanced: '',
    times: '',
    title: '',
    dataList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    this.getbalance_log(this.data.current)
  },
  getbalance_log(current) {
    sdk.utils.extend.showLoading('加载中');
    sdk.request({
      url: CGI.getbalance_log,
      method: 'POST',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {}
    }).then(res => {
      sdk.utils.extend.hideLoading()
      if (res.msg == '请求成功') {
        this.setData({
          balanced: res.data.balance,
          times: res.data.times,
          title: res.data.title,
          balance: res.databalance,
        })
        wx.setNavigationBarTitle({
          title: res.data.title
        })
        if (res.data.list.total > 0) {
          let alldataList = res.data.list.data;
          if (current > 1) {
            alldataList = this.data.dataList.concat(alldataList);
          }
          this.setData({
            dataList: alldataList,
            zPges: res.data.last_page
          })
        }
      }
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err);
    })
  },
  goToCoin() {
    this.setData({
      params: {
        balanced: this.data.balanced,
      }
    })
    wx.navigateTo({
      url: '/pages/successwithdrawal/index',
    })
  },
  onReachBottom(e) {
    let zPges = this.data.zPges;
    let current = this.data.current;
    current++;
    if (current <= zPges) {
      this.setData({
        current
      }, () => {
        this.getmyorders(current);
      });
    }
  }
})