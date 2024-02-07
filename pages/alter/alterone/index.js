const sdk = getApp().sdk;
const CGI = require('../../../constant/cgi');
const {
  getPrevPageData
} = sdk.utils.pageData;
const usedata = require('../../../constant/usedata.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataAll:{},
    title: '', //职位名称
    zwmsxg: '', //职位描述
    industry_id: [0, 0], //所属行业
    zwsxnrxg: '', //职位体验内容
    zwsxyqxg: '', //职位体验要求
    salary_min: '', //最低薪酬
    salary_max: '', //最高薪酬
    major_id: [0, 0],
    id: '',
    industry: '',
    mjoname1: '',
    mjoname2: '',
    industryname1: '',
    industryname2: '',
    majorData: [],
    industryData: []
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const pageData = getPrevPageData()
    console.log('上一个页面带过来的--------------', pageData)
    const dataAll = pageData.dataList.job
    this.setData({
      dataAll: pageData.dataList.job,
      title: dataAll.title,
      zwmsxg: dataAll.desc,
      zwsxnrxg: dataAll.job_desc,
      zwsxyqxg: dataAll.job_ask,
      salary_min: dataAll.salary_min,
      salary_max: dataAll.salary_max,
      industry: dataAll.industry,
      id: dataAll.id,
      industryIndex:dataAll.industry_id,
      multiIndex:dataAll.major_id,
    })
    wx.setStorageSync('zwmsxg', dataAll.desc)
    wx.setStorageSync('zwsxnrxg', dataAll.job_desc)
    wx.setStorageSync('zwsxyqxg', dataAll.job_ask)
    this.getmajor();
    this.getindustry()
  },
  onShow() {
    let zwmsxg = wx.getStorageSync('zwmsxg')
    let zwsxnrxg = wx.getStorageSync('zwsxnrxg')
    let zwsxyqxg = wx.getStorageSync('zwsxyqxg')
    this.setData({
      zwmsxg: zwmsxg || '',
      zwsxnrxg: zwsxnrxg || '',
      zwsxyqxg: zwsxyqxg || ''
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
      id: this.data.id,
      title: dataList.title,
      desc: this.data.zwmsxg,
      job_desc: this.data.zwsxnrxg,
      job_ask: this.data.zwsxyqxg,
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
      url: CGI.getedit_job,
      method: 'POST',
      header: {
        token: wx.getStorageSync('token')
      },
      data: dataList
    }).then(res => {
      sdk.utils.extend.hideLoading()
      console.log('111111111111----',res)
      if (res.msg == '操作成功') {
        this.setData({
          params: {
            id: res.data,
            dataAll:this.data.dataAll
          }
        })
        wx.navigateTo({
          url: '/pages/alter/altertwo/index',
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