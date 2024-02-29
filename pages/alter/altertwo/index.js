const sdk = getApp().sdk;
const CGI = require('../../../constant/cgi');
const {
  getPrevPageData
} = sdk.utils.pageData;
const usedata = require('../../../constant/usedata.js');
Page({
  id: 1,
  /**
   * 页面的初始数据
   */
  data: {
    restock_desc: '',
    salary_day: '',
    open_date: [],
    timeMin: '',
    timeMax: '',
    bqsm: '',
    open_groups: [],
    eav: "",
    newtype: [],
    type: [],
    oldnewtype: [],
    time: [],
    restock_Show: false,
    id: '',
    newTime: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // this.get_eav()
    this.get_type()
    this.get_open_groups()
    console.log("上个页面带过来的数据-------", getPrevPageData())
    const dataAll = getPrevPageData().dataAll
    wx.setStorageSync('bqsm', dataAll.restock_desc)
    console.log("上个页面带过来的日期-------", dataAll.open_date)
    console.log("上个页面带过来的日期-------", dataAll.open_date)
    let result = []
    while (dataAll.open_date.length > 0) {
      let tempSlice = dataAll.open_date.splice(0, 16); // 从索引0开始，提取长度为sliceSize的元素并删除这些元素
      result.push(tempSlice);
    }
    this.setData({
      arrayTime: result,
      id: dataAll.id,
      salary_day: dataAll.salary_day,
      newTime: dataAll.open_date,
      timeMin: dataAll.work_hours_start,
      timeMax: dataAll.work_hours_end,
      day_num: dataAll.day_num,
      day_min: dataAll.day_min,
      day_max: dataAll.day_max,
      open_groups: dataAll.open_groups,
      eav: [],
      oldnewtype: dataAll.type,
      restock_desc: dataAll.restock_desc,
      restock_Show: dataAll.restock_desc ? true : false
    })

  },
  addTime(e) {
    // 选择日期
    const item = e.currentTarget.dataset.item
    const index = e.currentTarget.dataset.parent
    this.data.arrayTime[index].forEach(res => {
      if (res.time == item.time) {
        if (!res.check) {
          res.check = true
        } else {
          res.check = false
        }
      }
    })
    let newTime = []
    for (let i = 0; i <= this.data.arrayTime.length - 1; i++) {
      for (let j = 0; j <= this.data.arrayTime[i].length - 1; j++) {
        newTime.push(this.data.arrayTime[i][j])
      }
    }
    this.setData({
      arrayTime: this.data.arrayTime,
      newTime: newTime
    })
  },
  onShow() {
    let bqsm = wx.getStorageSync('bqsm')
    this.setData({
      restock_desc: bqsm || '',
    })
  },

  handleChange(e) {
    this.setData({
      [e.target.id]: e.detail.value,
    })
  },
  radioChange(e) {
    const idIndex = e.detail.value - 1
    this.data.groupData.forEach((item) => {
      item[idIndex] = true
    });
    this.setData({
      open_groups: e.detail.value,
    })
  },
  // radioChangeEav(e) {
  //   console.log('radio发生change事件，携带value值为：', e.detail.value)
  //   const idIndex = e.detail.value - 1
  //   this.data.eavData.forEach((item) => {
  //     item[idIndex] = true
  //   });
  //   this.setData({
  //     eav: e.detail.value,
  //   })
  // },
  radioChangeType(e) {
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
  // get_eav() {
  //   sdk.request({
  //     url: CGI.get_eav,
  //     method: 'POST',
  //     data: {}
  //   }).then(res => {
  //     res.data.forEach(item => {
  //       if (this.data.eav == item.id) {
  //         item.checked = true
  //       } else {
  //         item.checked = false
  //       }
  //     });
  //     this.setData({
  //       eavData: res.data
  //     })
  //   }).catch(err => {
  //     console.log(err)
  //   })
  // },
  get_type() {
    sdk.request({
      url: CGI.get_type,
      method: 'POST',
      data: {}
    }).then(res => {
      console.log(res)
      let oldList = this.data.oldnewtype
      let newList = res.data
      let type = []
      for (let i = 0; i <= oldList.length - 1; i++) {
        for (let j = 0; j <= newList.length - 1; j++) {
          if (oldList[i].title == newList[j].title) {
            newList[j].checked = true
            type.push(newList[j].id)
          }
        }
      }
      this.setData({
        typeData: newList,
        type: type
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
      let oldList = this.data.open_groups
      let newList = res.data
      let endList = []
      for (let i = 0; i <= oldList.length - 1; i++) {
        newList.forEach(res => {
          if (oldList[i] == res.title) {
            res.checked = true
            endList.push(res.id)
          }
        })
      }
      this.setData({
        groupData: newList,
        open_groups: endList
      })
    }).catch(err => {
      console.log(err)
    })
  },
  bindDateChangeStart(e) {
    this.setData({
      timestart: e.detail.value
    })
  },
  bindDateChangeEnd(e) {
    this.setData({
      timeEnd: e.detail.value
    })
  },
  bindTimeChangeStart: function (e) {
    this.setData({
      timeMin: e.detail.value
    })
  },
  bindTimeChangeEnd: function (e) {
    this.setData({
      timeMax: e.detail.value
    })
  },
  formSubmit(e) {
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
    if (this.data.open_groups.length == 0  || this.data.type.length == 0 || this.data.restock_desc == '') {
      wx.showModal({
        title: '提示',
        content: '信息未填写完整，请完善相关信息',
        showCancel: false
      });
      return
    }
    const dataList = {
      id: this.data.id,
      open_groups: this.data.open_groups,
      salary_day: sumData.salary_day,
      open_date: this.data.newTime,
      work_hours_start: this.data.timeMin,
      work_hours_end: this.data.timeMax,
      day_min: sumData.day_min,
      day_max: sumData.day_max,
      day_num: sumData.day_num,
      eav: this.data.eav,
      type: this.data.type,
      restock_desc: this.data.restock_desc,
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
  goRemark(e) {
    wx.showModal({
      title: '备注',
      content: e.currentTarget.dataset.item,
      showCancel: false
    });
  },

  goCont(e) {
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