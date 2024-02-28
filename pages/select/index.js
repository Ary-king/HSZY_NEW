const sdk = getApp().sdk;
const CGI = require('../../constant/cgi');
const {
  getPrevPageData
} = sdk.utils.pageData;
const usedata = require('../../constant/usedata.js');
Page({
  data: {
    posNameShow: false,
    induShow: false,
    opengroupsId: 0,
    opengroups: '',
    typeId: 0,
    type: '',
    posNameId: 0,
    posName: '',
    industryId: 0,
    industry: '',
    setupTimId: 0,
    setupTim: '',
    groupData: [],
    typeData: [],
    industryData: [],
    industryDatad: [],
    posNameData: [],
    setupTimeData: [{
      id: 1,
      name: '不限',
      checked: false
    }, {
      id: 2,
      name: '一年以内',
      checked: false
    }, {
      id: 3,
      name: '1-3年',
      checked: false
    }, {
      id: 4,
      name: '4年以上',
      checked: false
    }],
    scaleComData: [{
      id: 1,
      name: '不限',
      checked: false
    }, {
      id: 2,
      name: '0-20人',
      checked: false
    }, {
      id: 3,
      name: '21-99人',
      checked: false
    }, {
      id: 4,
      name: '100-499人',
      checked: false
    }, {
      id: 5,
      name: '500-999人',
      checked: false
    }, {
      id: 6,
      name: '1000-9999人',
      checked: false
    }, {
      id: 7,
      name: '10000人以上',
      checked: false
    }]
  },
  goToEmpty() {
    this.data.groupData.map(item => {
      item.checked = false;
      return item;
    });
    this.data.typeData.map(item => {
      item.checked = false;
      return item;
    });
    this.data.industryDatad.map(item => {
      item.checked = false;
      return item;
    });
    this.data.posNameData.map(item => {
      item.checked = false;
      return item;
    });
    this.data.setupTimeData.map(item => {
      item.checked = false;
      return item;
    });
    this.data.scaleComData.map(item => {
      item.checked = false;
      return item;
    });
    this.setData({
      groupData: this.data.groupData,
      typeData: this.data.typeData,
      industryDatad: this.data.industryDatad,
      posNameData: this.data.posNameData,
      setupTimeData: this.data.setupTimeData,
      scaleComData: this.data.scaleComData,
      opengroupsId: 0,
      opengroups: '',
      typeId: 0,
      type: '',
      posNameId: 0,
      posName: '',
      industryId: 0,
      industry: '',
      setupTimId: 0,
      setupTim: '',
      groupData: this.allgroupData,
      typeData: this.alltypeData,
      industryDatad: this.allindustryDatad
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.get_open_groups()
    this.get_type()
    this.getindustry()
    this.getjobname()
  },
  onShow() {
    wx.removeStorageSync('againData');
    wx.removeStorageSync('dataListSelect');
    wx.removeStorageSync('dataListFilt');
  },
  // 获取开放群体
  get_open_groups() {
    sdk.request({
      url: CGI.get_open_groups,
      method: 'POST',
      data: {}
    }).then(res => {
      let newData = res.data.map(item => {
        item.checked = false;
        return item;
      });
      this.allgroupData = newData
      this.setData({
        groupData: newData
      })
    }).catch(err => {
      console.log(err)
    })
  },
  // 获取职位类型
  get_type() {
    sdk.request({
      url: CGI.get_type,
      method: 'POST',
      data: {}
    }).then(res => {
      console.log(res)
      let newData = res.data.map(item => {
        item.checked = false;
        return item;
      });
      this.alltypeData = newData
      this.setData({
        typeData: newData
      })
    }).catch(err => {
      console.log(err)
    })
  },
  //所属行业
  getindustry() {
    sdk.request({
      url: CGI.getindustry,
      method: 'GET',
      data: {}
    }).then(res => {
      const industry2 = []
      const topData = res.data
      topData.forEach(res => {
        res.data.forEach(item => {
          industry2.push(item)
        })
      })
      let newData = industry2.map((item, index) => {
        item.keyId = index + 1
        item.classname = 'policy_cancelSub';
        return item;
      });
      this.setData({
        industryData: newData,
        industryDatad: newData
      })
    }).catch(err => {
      console.log(err);
    })
  },
  //职位名称
  getjobname() {
    sdk.request({
      url: CGI.get_jobname,
      method: 'GET',
      data: {}
    }).then(res => {
      let newData = res.data
      newData.map(item => {
        item.checked = false;
        return item;
      });
      this.setData({
        allposNameData: newData,
        posNameData: newData
      })
    }).catch(err => {
      console.log(err);
    })
  },

  clickKfqts(e) {
    console.log(e)
    const ident = e.currentTarget.dataset.item;
    this.data.groupData.forEach(item => {
      if (item.id == ident.id) {
        item.checked = true
      } else {
        item.checked = false
      }
      this.setData({
        groupData: this.data.groupData,
        opengroupsId: ident.id,
        opengroups: ident.title
      })
    })
  },
  clickZwlx(e) {
    console.log(e)
    const ident = e.currentTarget.dataset.item;
    this.data.typeData.forEach(item => {
      if (item.id == ident.id) {
        item.checked = true
      } else {
        item.checked = false
      }
      this.setData({
        typeData: this.data.typeData,
        typeId: ident.id,
        type: ident.title
      })
    })
  },
  clickZwmc(e) {
    console.log(e)
    const ident = e.currentTarget.dataset.item;
    this.data.posNameData.forEach(item => {
      if (item.id == ident.id) {
        item.checked = true
      } else {
        item.checked = false
      }
      this.setData({
        posNameData: this.data.posNameData,
        posNameId: ident.id,
        posName: ident.name
      })
    })
  },
  clicSshy(e) {
    console.log(e)
    sdk.utils.extend.showLoading('加载中');
    const ident = e.currentTarget.dataset.item;
    this.data.industryDatad.forEach(item => {
      if (item.keyId == ident.keyId) {
        item.checked = true
      } else {
        item.checked = false
      }
      sdk.utils.extend.hideLoading()
      this.setData({
        industryDatad: this.data.industryDatad,
        industryId: ident.keyId,
        industry: ident.name
      })
    })
  },
  clickClsj(e) {
    console.log(e)
    const ident = e.currentTarget.dataset.item;
    this.data.setupTimeData.forEach(item => {
      if (item.id == ident.id) {
        item.checked = true
      } else {
        item.checked = false
      }
      this.setData({
        setupTimeData: this.data.setupTimeData,
        setupTimId: ident.id,
        setupTim: ident.name
      })
    })
  },
  clickGsgm(e) {
    console.log(e)
    const ident = e.currentTarget.dataset.item;
    this.data.scaleComData.forEach(item => {
      if (item.id == ident.id) {
        item.checked = true
      } else {
        item.checked = false
      }
      this.setData({
        scaleComData: this.data.scaleComData,
        scaleComId: ident.id,
        scaleCom: ident.name
      })
    })
  },
  goSubmit() {
    const dataListFilt = {
      opengroups: this.data.opengroups || '',
      type: this.data.type || '',
      posName: this.data.posName == '不限' ? '' : this.data.posName,
      industry: this.data.industry || '',
      setupTim: this.data.setupTim || '',
      scaleCom: this.data.scaleCom || '',
    }
    console.log(dataListFilt)
    wx.setStorageSync('againData', '1')
    wx.setStorageSync('dataListFilt', dataListFilt)
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  showZwmc() {
    this.setData({
      posNameShow: !this.data.posNameShow
    })
  },
  showHy() {
    this.setData({
      induShow: !this.data.induShow
    })

  },

})