const sdk = getApp().sdk;
const CGI = require('../../../constant/cgi');
const {
  getPrevPageData
} = sdk.utils.pageData;
const usedata = require('../../../constant/usedata.js');
Page({
  id: '',
  /**
   * 页面的初始数据
   */
  data: {
    dataAll: {},
    title: '', //职位名称
    zwmsxg: '', //职位描述
    industry_id: [0, 0], //所属行业
    zwsxnrxg: '', //职位体验内容
    zwsxyqxg: '', //职位体验要求
    salary_min: '', //最低薪酬
    salary_max: '', //最高薪酬
    major: '', //选填专业1
    major2: '', //选填专业2
    major3: '', //选填专业3
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
  handleChange(e) {
    this.setData({
      [e.target.id]: e.detail.value,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const pageData = getPrevPageData()
    console.log('上一个页面带过来的--------------', pageData)
    this.id = pageData.identId
    this.getindustry()
  },
  onShow() {
    console.log('------------', this.id)
    if (wx.getStorageSync('zwmsxg') == '' || wx.getStorageSync('zwsxnrxg') == '' || wx.getStorageSync('zwsxyqxg') == '') {
      console.log("1111111111111")
      this.gotoDetail(this.id, 1)
    } else {
      console.log("222222")
      let zwmsxg = wx.getStorageSync('zwmsxg')
      let zwsxnrxg = wx.getStorageSync('zwsxnrxg')
      let zwsxyqxg = wx.getStorageSync('zwsxyqxg')
      this.setData({
        zwmsxg: zwmsxg || '',
        zwsxnrxg: zwsxnrxg || '',
        zwsxyqxg: zwsxyqxg || ''
      })
    }

  },

  gotoDetail(id) {
    console.log("id详情------", id)
    sdk.utils.extend.showLoading('加载中');
    sdk.request({
      url: CGI.getjob_detail,
      method: 'GET',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        id: id.toString()
      }
    }).then(res => {
      sdk.utils.extend.hideLoading()
      console.log("数据详情-----", res)
      //职位管理跳转详情
      if (res.code == 0) {
        this.setData({
          dataAll: res.data.job,
          title: res.data.job.title,
          zwmsxg: res.data.job.desc,
          zwsxnrxg: res.data.job.job_desc,
          zwsxyqxg: res.data.job.job_ask,
          salary_min: res.data.job.salary_min,
          salary_max: res.data.job.salary_max,
          industry: res.data.job.industry,
          id: this.id,
          industryIndex: res.data.job.industry_id,
          multiIndex: res.data.job.major_id,
          major: res.data.job.major,
          major2: res.data.job.major2,
          major3: res.data.job.major3
        })
        wx.setStorageSync('zwmsxg', res.data.job.desc)
        wx.setStorageSync('zwsxnrxg', res.data.job.job_desc)
        wx.setStorageSync('zwsxyqxg', res.data.job.job_ask)
      }
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err);
    })
  },
  formSubmit(e) {
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
      major: this.data.major,
      major2: this.data.major2,
      major3: this.data.major3,
      industryIndex: this.data.industryIndex,
      major_id: this.data.multiIndex
    }
    console.log("提交的数据----------", goDetail)
    console.log('------------11111111111111111', this.allData)
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
      console.log('1111111111111111111111111------------', res)
      if (res.msg == '操作成功') {
        console.log('------------2222222222222222', this.id)
        this.setData({
          params: {
            id: res.data,
            dataAll: this.data.dataAll,
            timeData: this.data.dataAll.open_date
          }
        })
        wx.navigateTo({
          url: '/pages/alter/altertwo/index',
        })
        wx.removeStorageSync('zwmsxg');
        wx.removeStorageSync('zwsxnrxg');
        wx.removeStorageSync('zwsxyqxg');
      }
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err);
    })
  },

  getindustry() {
    sdk.request({
      url: CGI.getindustry,
      method: 'GET',
      data: {}
    }).then(res => {
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
  // bindMultiPickerChangemajor(e) {
  //   const oneVa = e.detail.value[0]
  //   const twoVa = e.detail.value[1]
  //   this.setData({
  //     multiIndex: e.detail.value,
  //     mjoname1: this.data.majorData[oneVa].name,
  //     mjoname2: this.data.majorData[oneVa].data[twoVa].name,
  //   })
  // },
  bindMultiPickerColumnChangemajor(e) {
    // this.data.
    const oneId = e.detail.value
    if (e.detail.column == 1) {
      return
    } else {
      const majorData = this.data.majorData;
      const twoData = []
      majorData[oneId].data.forEach(res => {
        twoData.push(res.name)
      })
      const allDatas = []
      allDatas.push(this.data.oneData, twoData)
      this.setData({
        allData: allDatas
      })
    }
  },
  bindMultiPickerChange(e) {
    console.log(e)
    const oneVa = e.detail.value[0]
    const twoVa = e.detail.value[1]
    this.setData({
      industryIndex: e.detail.value,
      industryname1: this.data.industryData[oneVa].name,
      industryname2: this.data.industryData[oneVa].data[twoVa].name,
    })
  },
  bindMultiPickerColumnChange(e) {
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
      this.setData({
        indusData: indusDatas
      })
    }
  },
  goCont(e) {
    let newName = e.currentTarget.dataset.newname
    console.log(newName)
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