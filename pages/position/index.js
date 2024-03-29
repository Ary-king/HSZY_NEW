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
    page: 1,
    isContainer: '-1',
    status: '1',
    dataList: [],
    current: 1,
    zPges: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getjob_list('-1', this.data.current)
    this._get_userinfo()
  },


  containerMs(e) {
    console.log(e)
    const isContainer = e.currentTarget.dataset.container;
    console.log(isContainer)
    this.setData({
      isContainer: isContainer,
      dataList: [],
      current: 1,
      zPges: 0
    }, () => {
      this.getjob_list(isContainer, this.current)
    });
  },
  getPostJob() {
    console.log(this.data.userinfoData.company)
    if(this.data.userinfoData.company == 1){
      wx.navigateTo({
        url: '/pages/postjob/index',
      })
    }else{
      wx.showToast({
        title: '您企业还未认证通过不能发布职位',
        icon:'none'
      })
    }
  },
  getjob_list(status, current) {
    const statId = status
    sdk.utils.extend.showLoading('加载中');
    sdk.request({
      url: CGI.getjob_list,
      method: 'GET',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        status: statId || '-1',
        page: current
      }
    }).then(res => {
      console.log("11111111111--------------", res)
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
      // this.setData({
      //   dataList: res.data.data
      // })
      // sdk.utils.extend.hideLoading()
      console.log(res)
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err);
    })
  },
  gotoDetail(e) {
    const _this = this;
    console.log("详情------", e)
    const item = e.currentTarget.dataset.item
    sdk.utils.extend.showLoading('加载中');
    _this.setData({
      params: {
        identId: item.id,
      }
    });
    wx.navigateTo({
      url: '/pages/alter/alterone/index',
    })
  },
  onReachBottom(e) {
    console.log(e)
    let zPges = this.data.zPges;
    let current = this.data.current;
    current++;
    console.log(current)
    console.log(zPges)
    if (current <= zPges) {
      this.setData({
        current
      }, () => {
        this.godataList(this.data.isContainer, current);
      });
    }
  },
  // 获取个人信息
  _get_userinfo() {
    wx.request({
      url: 'https://heshiwork.com/api/index/get_userinfo',
      method: 'GET',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {},
      success: (res) => {
        console.log("个人信息---------", res)
        const userinfoData = res.data.data
        this.setData({
          userinfoData: userinfoData
        })
      },
      fail: (err) => {
        console.log("个人信息获取失败---------", res)
      }
    })
  },
})