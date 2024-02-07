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
    wx.navigateTo({
      url: '/pages/postjob/index',
    })
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
    sdk.request({
      url: CGI.getjob_detail,
      method: 'GET',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        id: item.id.toString()
      }
    }).then(res => {
      sdk.utils.extend.hideLoading()
      console.log("数据详情-----",res)
      //职位管理跳转详情
      if (res.code == 0) {
        _this.setData({
          params: {
            status:item.status,
            reserve: "2",
            identId: item.id,
            dataList: res.data
          }
        });
        wx.navigateTo({
          url: '/pages/alter/alterone/index',
        })
      }
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err);
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
})