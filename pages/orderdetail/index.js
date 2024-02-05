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
    modelShow: false,
    judge: false,
    formData: {
      name: '',
      phone: '',
      causetxt: ''
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const pageData = getPrevPageData()
    console.log('--------------',pageData)
    this.setData({
      company: pageData.dataList.company,
      job: pageData.dataList.job,
      order: pageData.dataList.order,
      user: pageData.dataList.user,
      jobstatus: pageData.dataList.order.jobstatus == 3 ? true : false
    })
  },
  handleChange(e) {
    this.setData({
      [`formData.${e.target.id}`]: e.detail.value,
    })
  },
  goPass() {
    this.setData({
      modelShow: true
    })

  },
  goRefuse() {
    this.setData({
      judge: true
    })
  },
  goBack() {
    this.setData({
      modelShow: false,
      judge: false,

    })
  },
  formSubmit(e) {
    wx.showLoading({
      title: '加载中',
    })
    console.log(e)
    console.log(e.detail.value)
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (e.detail.value.name || e.detail.value.phone) {
      let dataList = {
        id: this.data.order.id.toString(),
        jobstatus: '1',
        contacts: e.detail.value.name,
        mobile: e.detail.value.phone,
        desc: ''
      }
      this.getexa_order(dataList).then(res => {
        console.log(res)
        if (res.msg == '操作成功') {
          wx.showToast({
            title: "提交成功",
            icon: 'none',
          });
          this.setData({
            modelShow: false,
            jobstatus: false
          });
          wx.switchTab({
            url: '/pages/message/index',
          })
        }
      })
    } else {
      wx.showToast({
        title: "未填写审核数据",
        icon: 'none',
      });
    }
    wx.hideLoading()
  },
  formSubmiturn(e) {
    wx.showLoading({
      title: '加载中',
    })
    console.log(e)
    console.log(e.detail.value)
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (e.detail.value.causetxt) {
      let dataList = {
        id: this.data.order.id.toString(),
        jobstatus: '2',
        contacts: '',
        mobile: '',
        desc: e.detail.value.causetxt
      }
      this.getexa_order(dataList).then(res => {
        console.log(res)
        if (res.msg == '操作成功') {
          wx.showToast({
            title: "提交成功",
            icon: 'none',
          });
          this.setData({
            judge: false,
            jobstatus: false
          });
          wx.switchTab({
            url: '/pages/message/index',
          })
        }
      })
    } else {
      wx.showToast({
        title: "未填写拒绝原因",
        icon: 'none',
      });
    }
    wx.hideLoading()
  },

  getexa_order(dataList) {
    console.log('调用 wx.login');
    return new Promise((resolve, reject) => {
      sdk.utils.extend.showLoading('加载中');
      wx.request({
        url: CGI.getexa_order,
        method: 'POST',
        header: {
          token: wx.getStorageSync('token')
        },
        data: dataList,
        success: (res) => {
          sdk.utils.extend.hideLoading()
          resolve(res.data);
        },
        fail: (res) => {
          sdk.utils.extend.hideLoading()
          console.error('Request Fail to fetch SessionId', res);
          console.log('获取手机号失败', err);
          reject(err);
        }
      })
    })
  },
  gotoDetail(e) {
    const _this = this;
    console.log(e)
    const ident = e.currentTarget.dataset.id
    sdk.utils.extend.showLoading('加载中');
    if (wx.getStorageSync('logSucces')) {
      sdk.request({
        url: CGI.getjob_detail,
        method: 'GET',
        header: {
          token: wx.getStorageSync('token')
        },
        data: {
          id: ident.toString()
        }
      }).then(res => {
        sdk.utils.extend.hideLoading()
        console.log(res)
        if (res.code == 0) {
          _this.setData({
            params: {
              reserve: "2",
              identId: ident.id,
              dataList: res.data
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
    } else {
      wx.showToast({
        title: '您暂未登录小程序',
      })
    }
  },
})