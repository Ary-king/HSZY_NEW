const sdk = getApp().sdk;
const CGI = require('../../constant/cgi');
const {
  getPrevPageData
} = sdk.utils.pageData;
const usedata = require('../../constant/usedata.js');
Page({
  id: 1,
  /**
   * 页面的初始数据
   */
  data: {
    bqsm:'',
    open_groups: [],
    eav: "",
    type: [],
    time: [],
    restock_Show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    console.log(getPrevPageData())
    this.id = getPrevPageData().id || this.id
    let currentDate = new Date();
    let year = currentDate.getFullYear(); // 获取当前年份
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    console.log(year + '-' + month + '-' + day)
    this.setData({
      nowData: year + '-' + month + '-' + day,
      endData: year + '-' + month + '-' + day,
    })
    this.get_eav()
    this.get_type()
    this.get_open_groups()
  },
  handleChange(e) {
    this.setData({
      [e.target.id]: e.detail.value,
    })
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const idIndex = e.detail.value - 1
    this.data.groupData.forEach((item) => {
      item[idIndex] = true
    });
    this.setData({
      open_groups: e.detail.value,
    })
  },
  radioChangeEav(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const idIndex = e.detail.value - 1
    this.data.eavData.forEach((item) => {
      item[idIndex] = true
    });
    this.setData({
      eav: e.detail.value,
    })
  },
  radioChangeType(e) {
    console.log("1111111---------", e)
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const idIndex = e.detail.value - 1
    this.data.typeData.forEach((item) => {
      item[idIndex] = true
    });
    if (idIndex != 0) {
      this.setData({
        restock_Show: true
      })
    } else {
      this.setData({
        restock_Show: false
      })
    }
    this.setData({
      type: e.detail.value,
    })
  },
  get_eav() {
    sdk.request({
      url: CGI.get_eav,
      method: 'POST',
      data: {}
    }).then(res => {
      console.log(res)
      let newData = res.data.map(item => {
        item.checked = false;
        return item;
      });
      this.setData({
        eavData: newData
      })
    }).catch(err => {
      console.log(err)
    })
  },
  get_type() {
    sdk.request({
      url: CGI.get_type,
      method: 'POST',
      data: {}
    }).then(res => {
      console.log(res)
      let newData = res.data.map(item => {
        if(item.title == '体验'){
          item.checked = true;
        }else{
          item.checked = false;
        }
        return item;
      });
      this.setData({
        typeData: newData
      })
    }).catch(err => {
      console.log(err)
    })
  },
  get_open_groups() {
    sdk.request({
      url: CGI.get_open_groups,
      method: 'POST',
      data: {}
    }).then(res => {
      console.log(res)
      let newData = res.data.map(item => {
        item.checked = false;
        return item;
      });
      this.setData({
        groupData: newData
      })
    }).catch(err => {
      console.log(err)
    })
  },
  bindDateChangeStart(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      timestart: e.detail.value
    })
  },
  bindDateChangeEnd(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      timeEnd: e.detail.value
    })
  },
  bindTimeChangeStart: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      timeMin: e.detail.value
    })
  },
  bindTimeChangeEnd: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      timeMax: e.detail.value
    })
  },
  formSubmit(e) {
    console.log(e)
    console.log(e.detail.target.dataset.com)
    console.log("提交的数据----", e.detail.value)
    const comId = e.detail.target.dataset.com
    const sumData = e.detail.value
    if (sumData.salary_day == "" || sumData.day_max == "" || sumData.day_min == "" || sumData.day_num == "") {
      wx.showModal({
        title: '提示',
        content: '信息未填写完整，请完善相关信息',
        showCancel: false
      });
      return
    }
    if (this.data.open_groups.length == 0 || this.data.eav == "" || this.data.type.length == 0 || this.data.bqsm == '') {
      wx.showModal({
        title: '提示',
        content: '信息未填写完整，请完善相关信息',
        showCancel: false
      });
      return
    }
    console.log(this.data.time.length)
    if (this.data.time.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '未选择开放日期',
        showCancel: false
      });
      return
    }
    const dataList = {
      id: this.id,
      open_groups: this.data.open_groups,
      salary_day: sumData.salary_day,
      open_date: this.data.time,
      // open_date_end: "",
      work_hours_start: this.data.timeMin,
      work_hours_end: this.data.timeMax,
      day_min: sumData.day_min,
      day_max: sumData.day_max,
      day_num: sumData.day_num,
      eav: this.data.eav,
      type: this.data.type,
      restock_desc: this.data.bqsm,
      status: comId
    }
    console.log("最终提交的数据--------", dataList)
    this.getjob_repair(dataList)
  },
  getjob_repair(dataList) {
    sdk.utils.extend.showLoading('加载中');
    sdk.request({
      url: CGI.getjob_repair,
      method: 'POST',
      header: {
        token: wx.getStorageSync('token')
      },
      data: dataList
    }).then(res => {
      sdk.utils.extend.hideLoading()
      console.log(res)
      if (res.msg == "操作成功") {
        wx.reLaunch({
          url: '/pages/position/index',
        })
      } else {
        wx.showToast({
          title: res.msg,
        })
      }
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err);
    })
  },
  /**
   * 点击的日期
   */
  selectDate: function (e) {
    console.log(e)
    let clickDay = e.detail.date
    console.log(clickDay)
  },
  /**
   * 点击上个月
   */
  prevMonth: function (e) {
    console.log(e)
  },
  /**
   * 点击下个月
   */
  nextMonth: function (e) {
    console.log(e)
  },
  bindrecordClickedDate(e) {
    console.log('11111111111111---', e)
    this.setData({
      time: e.detail
    })
    console.log(this.data.time)
  },
  goRemark(e) {
    console.log(e)
    console.log(e.currentTarget.dataset.item)
    wx.showModal({
      title: '备注',
      content: e.currentTarget.dataset.item,
      showCancel: false
    });
  },
  onShow() {
    let bqsm = wx.getStorageSync('bqsm')
    this.setData({
      bqsm: bqsm || '',
    })
  },
  goCont(e) {
    console.log(e)
    console.log(e.currentTarget.dataset.newname)
    let newName = e.currentTarget.dataset.newname
    this.setData({
      params: {
        newName: newName,
      }
    })
    wx.navigateTo({
      url: '/pages/new/index',
    })
  },
})