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
    info_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.get_info_list()
  },
  goAdd(e) {
    const _this = this;
    _this.setData({
      params: {
        pageData: "2"
      }
    });
    wx.navigateTo({
      url: `/pages/persdata/index`,
    })

  },
  get_info_list() {
    sdk.utils.extend.showLoading('加载中');
    sdk.request({
      url: CGI.get_info_list,
      method: 'GET',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        type: ''
      }
    }).then(res => {
      console.log(res.data);
      sdk.utils.extend.hideLoading()
      if(res.data.length >0){
        let newData = res.data.map(item => {
          item.showIs = false;
          return item;
        });
        this.setData({
          info_list: newData
          // info_list: []
        })
      }
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err);
    })
  },
  unfoldShow(e) {
    console.log(e)
    console.log(e.currentTarget.dataset.indexid)
    const indexid = e.currentTarget.dataset.indexid
    const allData = this.data.info_list
    allData.forEach((item,index) => {
      if(indexid == index){
        item.showIs = !item.showIs
      }
    })
    this.setData({
      info_list:allData
    })
  }
})