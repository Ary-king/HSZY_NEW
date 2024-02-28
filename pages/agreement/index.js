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
    taxtData:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getuserAgreement()
  },

  getuserAgreement() {
    sdk.utils.extend.showLoading('加载中');
    sdk.request({
      url: CGI.getuserAgreement,
      method: 'GET',
      data: {}
    }).then(res => {
      sdk.utils.extend.hideLoading()
      if(res.msg == '请求成功'){
        this.setData({
          taxtData:res.data
        })
      }
    }).catch(err => {
      sdk.utils.extend.hideLoading()
    })
  },
})