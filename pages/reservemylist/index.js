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
    num: 0,
    isContainer: '4',
    current: 1,
    zPges: 0,
    typeSataus: '',
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
  },
  containerMs(e) {
    const isContainer = e.currentTarget.dataset.container;
    if (isContainer === this.data.isContainer) {
      return;
    }
    if (isContainer === '4') {
      this.setData({
        isContainer: isContainer,
        typeSataus: '',
        dataList: [],
        current: 1,
        zPges: 0,
      }, () => {
        this.getcompany_order(this.data.current, this.data.typeSataus);
      });
      return
    }
    this.setData({
      isContainer: isContainer,
      typeSataus: isContainer,
      dataList: [],
      current: 1,
      zPges: 0,
    }, () => {
      this.getcompany_order(this.data.current, this.data.typeSataus);
    });
  },
  onShow(){
    this.getcompany_order(this.data.current, this.data.typeSataus)
  },

  goResult(e) {
    console.log(e)
    const item = e.currentTarget.dataset.item
    const jobstatus = item.jobstatus
    sdk.utils.extend.showLoading('加载中');
    sdk.request({
      url: CGI.getorderdetail,
      method: 'GET',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        id: item.id
      }
    }).then(res => {
      sdk.utils.extend.hideLoading()
      if (res.msg == '请求成功！') {
        this.setData({
          params: {
            dataList: res.data
          }
        });
        wx.navigateTo({
          url: '/pages/orderdetail/index',
        })
      }
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err)
    })

  },
  getcompany_order(current, typeSataus) {
    sdk.utils.extend.showLoading('加载中');
    sdk.request({
      url: CGI.getcompany_order,
      method: 'GET',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        page: current,
        jobstatus: typeSataus
      }
    }).then(res => {
      sdk.utils.extend.hideLoading()
      if (res.msg == '请求成功') {
        if (res.data.list.total > 0) {
          let alldataList = res.data.list.data;
          if (current > 1) {
            alldataList = this.data.dataList.concat(alldataList);
          }
          this.setData({
            dataList: alldataList,
            zPges: res.data.list.last_page,
            num: res.data.num
          })
        }else{
          this.setData({
            num: 0,
            dataList:[]
          })
        }
      }
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err)
    })
  },
  onReachBottom(e) {
    console.log(e)
    let zPges = this.data.zPges;
    let current = this.data.current;
    current++;
    if (current <= zPges) {
      this.setData({
        current
      }, () => {
        this.getcompany_order(current, this.data.typeSataus);
      });
    }
  }
})