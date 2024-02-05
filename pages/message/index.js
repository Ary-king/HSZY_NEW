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
    num:0,
    dataSixe:false,
    dataList: [],
    current: 1,
    zPges: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  godataList(current) {
    sdk.utils.extend.showLoading('加载中');
    sdk.request({
      url: CGI.getmessage_list,
      method: 'GET',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        jobstatus: ''
      }
    }).then(res => {
      console.log("消息列表-----",res)
      sdk.utils.extend.hideLoading()
      if (res.msg == '请求成功') {
        if (res.data.list.total > 0) {
          let alldataList = res.data.list.data;
          if (current > 1) {
            alldataList = this.data.dataList.concat(alldataList);
          }
          this.setData({
            num:res.data.num,
            dataList: alldataList,
            zPges: res.data.list.last_page,
            dataSixe:true
          })
        }
      }
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err)
      this.setData({
        dataSixe:false
      })
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
        this.godataList(current);
      });
    }
  },


  goderDetial(e) {
    console.log(e)
    const ident = e.currentTarget.dataset.item.id
    sdk.utils.extend.showLoading('加载中');
    sdk.request({
      url: CGI.getorderdetail,
      method: 'GET',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        id: ident
      }
    }).then(res => {
      console.log("11111111111--------------", res)
      sdk.utils.extend.hideLoading()
      if (res.msg == '请求成功！') {
        if (res.data.iscompany == 0) {
          this.setData({
            params: {
              dataList: res.data
            }
          });
          wx.navigateTo({
            url: '/pages/makedetails/index',
          })
        }
        if (res.data.iscompany == 1) {
          if (res.data.order.jobstatus  == 3) { //订单待审核
            this.setData({
              params: {
                dataList: res.data
              }
            });
            wx.navigateTo({
              url: '/pages/orderdetail/index',
            })
          }
          if (res.data.order.jobstatus == 1 || res.data.order.jobstatus== 2 ) { //订单审核通过
            this.setData({
              params: {
                dataList: res.data
              }
            });
            wx.navigateTo({
              url: '/pages/jobdetails/index',
            })
          }
          // this.setData({
          //   params: {
          //     dataList: res.data
          //   }
          // });
          // wx.navigateTo({
          //   url: '/pages/orderdetail/index',
          // })
        }

      }
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err)
    })

  },
  // 登录获取手机号
  bindgetphonenumber(e) {
    sdk.utils.extend.showLoading('加载中');
    // 接口正常
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      console.log()
      sdk.utils.session.getphonenumber(e.detail.code).then(logSucces => {
        this.setData({
          logSucces
        })
        this.godataList(this.data.current)
      })
    } else {
      sdk.utils.extend.hideLoading();
      console.log("取消获取数据")
      const logSucces = false;
      wx.setStorageSync('logSucces', logSucces)
    }

  },
  onShow() {
    if (wx.getStorageSync('logSucces')) {
      this.godataList(this.data.current)
      this.setData({
        logSucces: true
      })
    } else {
      this.setData({
        logSucces: false
      })
    }
  },
  gopitch(){
    this.setData({
      pitch:!this.data.pitch
    })
  },
  goAgreement(){
    wx.navigateTo({
      url: '/pages/agreement/index',
    })
  }
})