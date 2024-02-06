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
    title:'',
    zwms: '',
    zwsxnr: '',
    zwsxyq: '',
    mjoname1: '',
    mjoname2: '',
    multiIndex: [0, 0],
    industryIndex: [0, 0],
    industryname1: '',
    industryname2: '',
    majorData: [],
    industryData: [{
        name: '教师',
        value: 1
      },
      {
        name: '教师',
        value: 1
      },
      {
        name: '教师',
        value: 1
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    wx.removeStorageSync('zwms');
    wx.removeStorageSync('zwsxnr');
    wx.removeStorageSync('zwsxyq');
    wx.removeStorageSync('bqsm');
    this.getmajor();
    this.getindustry()
  },
  onShow() {
    let zwms = wx.getStorageSync('zwms')
    let zwsxnr = wx.getStorageSync('zwsxnr')
    let zwsxyq = wx.getStorageSync('zwsxyq')
    this.setData({
      zwms: zwms || '',
      zwsxnr: zwsxnr || '',
      zwsxyq: zwsxyq || ''
    })
  },
  formSubmit(e) {
    console.log(e);
    console.log(e.detail.value);
    const dataList = e.detail.value;
    if (dataList.title == '' || this.data.zwms == '' || this.data.zwsxnr == '' || this.data.zwsxyq == '' || dataList.salary_min == '' || dataList.salary_max == '') {
      wx.showModal({
        title: '提示',
        content: '信息未填写完整，请完善相关信息',
        showCancel: false
      });
      return
    }
    const goDetail = {
      title: dataList.title,
      desc: this.data.zwms,
      job_desc: this.data.zwsxnr,
      job_ask: this.data.zwsxyq,
      salary_min: dataList.salary_min,
      salary_max: dataList.salary_max,
      industry: this.data.industryname1 + this.data.industryname2,
      major: this.data.mjoname1 + this.data.mjoname2,
      industry_id:this.data.industryIndex,
      major_id:this.data.multiIndex
    }
    console.log("提交的数据----------", goDetail)
    this.getjob_create(goDetail)

  },

  getjob_create(dataList) {
    sdk.utils.extend.showLoading('加载中');
    sdk.request({
      url: CGI.getjob_create,
      method: 'POST',
      header: {
        token: wx.getStorageSync('token')
      },
      data: dataList
    }).then(res => {
      sdk.utils.extend.hideLoading()
      console.log(res)
      if (res.msg == '操作成功') {
        this.setData({
          params: {
            id: res.data
          }
        })
        wx.navigateTo({
          url: '/pages/payset/index',
        })
      }
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err);
    })
  },
  getmajor() {
    sdk.request({
      url: CGI.getmajor,
      method: 'GET',
      data: {}
    }).then(res => {
      console.log("专业------------", res)
      const oneData = []
      const twoData = []
      res.data[0].data.forEach(res => {
        twoData.push(res.name)
      })
      res.data.forEach(res => {
        oneData.push(res.name)
      })
      const allData = []
      allData.push(oneData, twoData)
      this.setData({
        oneData: oneData,
        twoData: twoData,
        allData: allData,
        majorData: res.data,
        mjoname1: res.data[0].name,
        mjoname2: res.data[0].data[0].name,
      })
    }).catch(err => {
      console.log(err);
    })
  },
  getindustry() {
    sdk.request({
      url: CGI.getindustry,
      method: 'GET',
      data: {}
    }).then(res => {
      console.log("行业------------", res)
      const industry1 = []
      const industry2 = []
      res.data[0].data.forEach(res => {
        industry2.push(res.name)
      })
      res.data.forEach(res => {
        industry1.push(res.name)

      })
      const indusData = []
      indusData.push(industry1, industry2)
      this.setData({
        industry1: industry1,
        industry2: industry2,
        indusData: indusData,
        industryData: res.data,
        industryname1: res.data[0].name,
        industryname2: res.data[0].data[0].name,
      })
    }).catch(err => {
      console.log(err);
    })
  },
  bindMultiPickerChangemajor(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log(e.detail.value[0])
    const oneVa = e.detail.value[0]
    const twoVa = e.detail.value[1]
    this.setData({
      multiIndex: e.detail.value,
      mjoname1: this.data.majorData[oneVa].name,
      mjoname2: this.data.majorData[oneVa].data[twoVa].name,
    })
  },
  bindMultiPickerColumnChangemajor(e) {
    // this.data.
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    const oneId = e.detail.value
    if (e.detail.column == 1) {
      return
    } else {
      const majorData = this.data.majorData;
      const twoData = []
      majorData[oneId].data.forEach(res => {
        twoData.push(res.name)
      })
      console.log(twoData)
      const allDatas = []
      allDatas.push(this.data.oneData, twoData)
      console.log(allDatas)
      this.setData({
        allData: allDatas
      })
    }
  },
  bindMultiPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    // console.log(e.detail.value[0])
    const oneVa = e.detail.value[0]
    const twoVa = e.detail.value[1]
    this.setData({
      industryIndex: e.detail.value,
      industryname1: this.data.industryData[oneVa].name,
      industryname2: this.data.industryData[oneVa].data[twoVa].name,
    })
  },
  bindMultiPickerColumnChange(e) {
    // this.data.
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    const oneId = e.detail.value
    if (e.detail.column == 1) {
      return
    } else {
      const majorData = this.data.industryData;
      const industry2 = []
      majorData[oneId].data.forEach(res => {
        industry2.push(res.name)
      })
      const indusDatas = []
      indusDatas.push(this.data.industry1, industry2)
      console.log(indusDatas)
      this.setData({
        indusData: indusDatas
      })
    }
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
  }
})