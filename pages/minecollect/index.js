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

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getcollectlist()
  },
  gotoDetail(e) {
    const _this = this;
    const ident = e.currentTarget.dataset.item
    sdk.utils.extend.showLoading('加载中');
    sdk.request({
      url: CGI.getjob_detail,
      method: 'GET',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        id: ident.id.toString()
      }
    }).then(res => {
      sdk.utils.extend.hideLoading()
      if(res.code == 0){
        _this.setData({
          params: {
            reserve: "1",
            identId:ident.id,
            dataList:res.data
          }
        });
        wx.navigateTo({
          url: '/pages/hotdetail/index',
        })
      }
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err);
    })

  },
  getcollectlist(){
    sdk.utils.extend.showLoading('加载中');
    sdk.request({
      url: CGI.getcollectlist,
      method: 'GET',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {}
    }).then(res => {
      sdk.utils.extend.hideLoading()
      this.setData({
        dataAll:res.data.data
      })
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err);
    })
  }
})