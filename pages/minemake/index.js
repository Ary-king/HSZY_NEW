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
    isContainer: '4',
    dataList: [],
    current: 1,
    zPges: 0,
    typeStatus: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getmyorders(this.data.current, this.data.typeStatus)
  },

  containerMs(e) {
    const isContainer = e.currentTarget.dataset.container;
    if (isContainer === this.data.isContainer) {
      return;
    }
    if (isContainer === '4') {
      this.setData({
        isContainer: isContainer,
        typeStatus: '',
        current: 1,
        zPges: 0,
        dataList: []
      }, () => {
        this.getmyorders(this.data.current, this.data.typeStatus);
      });
      return
    }
    this.setData({
      isContainer: isContainer,
      typeStatus: isContainer,
      current: 1,
      zPges: 0,
      dataList: []
    }, () => {
      this.getmyorders(this.data.current, this.data.typeStatus);
    });
  },
  gotoDetail(e) {
    const item = e.currentTarget.dataset.item
    sdk.utils.extend.showLoading('加载中');
    sdk.request({
      url: CGI.getorderdetail,
      method: 'GET',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        id: item.id.toString()
      }
    }).then(res => {
      sdk.utils.extend.hideLoading()
      console.log('详情-----', res)
      if (res.msg == '请求成功！') {
        this.setData({
          params: {
            reserve: '3',
            dataList: res.data,
          }
        });
        wx.navigateTo({
          url: '/pages/orderdetail/index',
        })
      }
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err);
    })

  },
  getmyorders(current, typeStatus) {
    sdk.request({
      url: CGI.getmyorders,
      method: 'GET',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        jobstatus: typeStatus
      }
    }).then(res => {
      sdk.utils.extend.hideLoading()
      if (res.msg == '请求成功') {
        if (res.data.total > 0) {
          let alldataList = res.data.data;
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
      console.log(err)
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
        this.getmyorders(current, this.data.typeStatus);
      });
    }
  }
})