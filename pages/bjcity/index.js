const sdk = getApp().sdk;
const CGI = require('../../constant/cgi');
Page({
  data: {
    flag: 0,
    currentTab: 0,
    cityName: '北京',
    dataList: [],
    vertical: true
  },
  onLoad(e) {
    console.log(e)
    this.setData({
      cityName: e.cityname
    })
  },
  onShow() {
    this.getall()
  },
  switchNav: function (e) {
    var page = this;
    var id = e.target.id;
    if (this.data.currentTab == id) {
      return false;
    } else {
      page.setData({
        currentTab: id
      });
    }
    page.setData({
      flag: id
    });
  },
  catchTouchMove: function (res) {
    return false
  },
  getall() {
    sdk.utils.extend.showLoading('加载中');
    sdk.request({
      url: CGI.getBjprodistrictvince,
      method: 'GET',
      data: {}
    }).then(res => {
      sdk.utils.extend.hideLoading()
      console.log(res)
      if (res.msg == '请求成功') {
        res.data.forEach(res => {
          res.checkShow = false
        })
        this.setData({
          dataList: res.data
        });
      }
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err);
    })
  },
  getAlter(e) {
    console.log(e)
    let item = e.currentTarget.dataset.item
    this.data.dataList.forEach(res => {
      if (res.name == item.name) {
        res.checkShow = true
      } else {
        res.checkShow = false
      }
    })
    this.setData({
      dataList: this.data.dataList,
      cityName: item.name
    })
    wx.setStorageSync('bjCity', item.name)
    wx.setStorageSync('cityName', '北京')
    wx.setStorageSync('againData', '1')
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  goCity(){
    wx.navigateTo({
      url: '/pages/allCity/index',
    })
  }
})