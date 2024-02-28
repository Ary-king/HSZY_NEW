const sdk = getApp().sdk;
const CGI = require('../../constant/cgi');
const {
  getPrevPageData
} = sdk.utils.pageData;
const usedata = require('../../constant/usedata.js');
Page({
  resTimes: [],
  data: {
    arrayTimeIndex: 0,
    arrayTime: [],
    newTime: [],
    userID: '',
    sumSalary: 0,
    msg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let pageData = getPrevPageData()
    console.log(pageData)
    const times = pageData.dataList.open_date
    let oldTimes = []
    times.forEach(item => {
      if(item.check == true){
        oldTimes.push(item)
      }
    })
    console.log(oldTimes)
    let result = [];
    while (oldTimes.length > 0) {
      var tempSlice = oldTimes.splice(0, 16); // 从索引0开始，提取长度为sliceSize的元素并删除这些元素
      result.push(tempSlice);
    }
    console.log(result)
    let selectID = ''
    if (pageData.dataList.open_groups.length == 1) {
      pageData.dataList.open_groups.forEach(res => {
        console.log(res)
        if (res == '学生') {
          selectID = '2'
        } else {
          selectID = '1'
        }
      })
    }
    this.setData({
      alltimes: times,
      pageData: pageData,
      arrayTime: result,
      data: pageData.data,
      id: pageData.identId,
      dataList: pageData.dataList,
      salaryDay: pageData.dataList.salary_day,
      selectID: selectID
    }, () => {
      this.get_info_list(selectID)
    });

  },
  onShow() {
    let arrayTime = this.data.arrayTime
    this.setData({
      arrayTime :arrayTime
    })
    this.get_info_list(this.data.selectID)
  },
  infoShow(e) {
    console.log(e)
    const ident = e.currentTarget.dataset.item.id
    this.data.info_list.forEach(item => {
      if (item.id == ident) {
        item.showIs = !item.showIs
      }
    })
    this.setData({
      info_list: this.data.info_list
    })
  },
  get_info_list(selectID) {
    sdk.utils.extend.showLoading('加载中');
    sdk.request({
      url: CGI.get_info_list,
      method: 'GET',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        type: selectID
      }
    }).then(res => {
      console.log(res.data);
      sdk.utils.extend.hideLoading()
      let newData = res.data.map(item => {
        item.showIs = false;
        return item;
      });
      this.setData({
        info_list: newData
      })
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err);
    })
  },
  goAdd(e) {
    const _this = this;
    let latData = {
      pageNum: "1",
      pageData: this.data.pageData
    }
    wx.navigateTo({
      url: `/pages/persdata/index?arr=${JSON.stringify(latData)}`,
    })

  },

  gotoPayment() {
    if (this.data.userID == '') {
      wx.showModal({
        title: '提示',
        content: '请选择预订人员',
        showCancel: false
      });
      return
    }
    if (this.data.newTime.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '请选择体验日期',
        showCancel: false
      });
      return
    }
    const dataList = {
      time: this.data.newTime,
      id: this.data.dataList.id.toString(),
      userID: this.data.userID
    }
    console.log(dataList)
    this.goYuding(dataList)
  },


  bindrecordClickedDate(e) {
    let newTime = e.detail
    let lastTime = []
    this.data.oldTimes.forEach(res => {
      console.log(res)
      newTime.forEach(item => {
        console.log(item)
        if (res == item) {
          lastTime.push(item)
        }
      })
    })
    console.log(lastTime)
    this.setData({
      time: lastTime,
      sumSalary: this.data.dataList.salary_day * lastTime.length
    })
    console.log(lastTime)
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      userID: e.detail.value
    })
  },
  goYuding(dataList) {
    sdk.utils.extend.showLoading('加载中');
    sdk.request({
      url: CGI.getcreate_order,
      method: 'POST',
      header: {
        token: wx.getStorageSync('token')
      },
      data: dataList
    }).then(res => {
      sdk.utils.extend.hideLoading()
      console.log("预约成功------------", res)
      if (res.msg == '请求成功') {
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          out_trade_no: res.data.HS1706258864,
          code: res.data.code,
          success(res) {
            console.log('支付成功了-----------', res)
            wx.navigateTo({
              url: '/pages/payment/index',
            })
          },
          fail(res) {
            console.log("支付失败-------", res)
          }
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err);
    })
  },
  addTime(e) {
    // 选择日期
    const item = e.currentTarget.dataset.item
    const index = e.currentTarget.dataset.parent
    this.getjobday(item.time, index)
  },
  getjobday(times, index) {
    sdk.utils.extend.showLoading('加载中');
    sdk.request({
      url: CGI.getjobday,
      method: 'GET',
      data: {
        jid: this.data.dataList.id,
        day: times
      }
    }).then(res => {
      sdk.utils.extend.hideLoading()
      console.log("预订日期------------", res)
      if (res.code == 0) {
        this.data.arrayTime[index].forEach(res => {
          console.log(res)
          if (res.time == times) {
            if (!res.checkShow) {
              res.checkShow = true
            } else {
              res.checkShow = false
            }
          }
        })
        let newTime = []
        for (let i = 0; i <= this.data.arrayTime.length - 1; i++) {
          for (let j = 1; j <= this.data.arrayTime[i].length - 1; j++) {
            if (this.data.arrayTime[i][j].checkShow == true) {
              newTime.push(this.data.arrayTime[i][j].time)
            }
          }
        }
        console.log("新选的日期的长度-----------", newTime.length)
        this.setData({
          arrayTime: this.data.arrayTime,
          msg: '',
          newTime: newTime,
          oldTimes: this.data.oldTimes,
          sumSalary: this.data.dataList.salary_day * newTime.length
        })
      } else {
        this.setData({
          msg: res.msg
        })
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err);
    })
  },
})