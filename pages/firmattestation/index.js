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
    industryIndex: [0, 0],
    industryname1: '',
    industryname2: '',
    majorData: [],
    imgsfile: '',
    maxLength: 300,
    showUnfold: true,
    industry: '',
    number: '',
    time: '',
    inputShow: true,
    industryData: [],
    industryDatad: [],
    ageindex: 0,
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
    }],
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let currentDate = new Date();
    let year = currentDate.getFullYear(); // 获取当前年份
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    console.log(year + '-' + month + '-' + day)
    this.setData({
      nowData: year + '-' + month + '-' + day,
      endData: year + '-' + month + '-' + day,
    })
    this.getindustry()
    this.getcompany_status()
  },
  bindPickerChangeAge(e) {
    console.log(e)
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const ageId = e.detail.value
    this.setData({
      number: this.data.scaleComData[ageId].name,
      numberindex: ageId
    })
  },
  bindDateChangeStart(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const ageId = e.detail.value
    this.setData({
      time: this.data.setupTimeData[ageId].name,
      timeindex: ageId
    })
  },
  handleList(e) {
    console.log(e);
    console.log(e.currentTarget.dataset.item);
    const ident = e.currentTarget.dataset.item;
    this.data.industryDatad.forEach(res => {
      if (res.keyId == ident.keyId) {
        console.log(res.classname);
        res.classname = res.classname == 'policy_cancelSub' ? 'policy_canSub' : 'policy_cancelSub';
      } else {
        res.classname = 'policy_cancelSub';
      }
    });
    this.setData({
      industryDatad: this.data.industryDatad,
      industry: ident.name
    })
  },
  formSubmit(e) {
    console.log(e)
    const sumdata = e.detail.value
    if (sumdata.title == '' || sumdata.address == '' || sumdata.desc == '' || this.data.industryname2 == '' || this.data.number == '' || this.data.time == '') {
      wx.showModal({
        title: '提示',
        content: '信息未填写完整，请完善相关信息',
        showCancel: false
      });
      return
    }
    if (this.data.imgsfile == '') {
      wx.showModal({
        title: '提示',
        content: '未上传公司营业执照',
        showCancel: false
      });
      return
    }
    const dataList = {
      title: sumdata.title,
      number: this.data.number,
      time: this.data.time,
      address: sumdata.address,
      industry: this.data.industryname2,
      desc: sumdata.desc,
      img: this.data.imgsfile
    }
    console.log(dataList)
    this.getcompany_create(dataList)
  },
  //所属行业
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
  showUnfold() {
    this.setData({
      industryDatad: this.data.industryData,
      showUnfold: false
    })
  },
  pushimg() {
    let newfils = [];
    let that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: res => {
        console.log(res)
        const tempFiles = res.tempFiles
        wx.showLoading({
          title: '正在上传...',
          icon: 'loading',
          // mask: true,
          duration: 10000
        });
        for (var i = 0; i < tempFiles.length; i++) {
          var filePath = tempFiles[i].tempFilePath;
          wx.uploadFile({
            url: CGI.upload,
            filePath: filePath,
            name: 'file',
            success(res) {
              console.log(res)
              console.log(JSON.parse(res.data))
              const data = JSON.parse(res.data);
              newfils = that.data.imgsfile.concat('https://heshiwork.com' + data.data);
              console.log(data, that.data.imgsfile, that.data.imgsfile, 'data------------------');
              that.setData({
                imgsfile: newfils
              })
            },
            complete: () => {
              wx.hideLoading()
            },
          });
        }
      }
    })
  },
  getcompany_create(dataList) {
    sdk.utils.extend.showLoading('加载中');
    sdk.request({
      url: CGI.getcompany_create,
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
          inputShow: false
        }, () => {
          this.getcompany_status()
        });
      }
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err);
    })
  },
  getcompany_status() {
    sdk.utils.extend.showLoading('加载中');
    sdk.request({
      url: CGI.getcompany_status,
      method: 'GET',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {}
    }).then(res => {
      sdk.utils.extend.hideLoading()
      console.log(res)
      if (res.data) {
        if (res.data.company_status == 0) {
          this.setData({
            inputShow: true,
            allData: []
          })
        } else {
          this.setData({
            inputShow: false,
            allData: res.data
          })
        }

      }
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err);
    })
  },
  goRepeal(e) {
    sdk.utils.extend.showLoading('加载中');
    sdk.request({
      url: CGI.getdel_ask,
      method: 'GET',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {}
    }).then(res => {
      sdk.utils.extend.hideLoading()
      console.log(res)
      if (res.msg == "操作成功") {
        this.setData({
          inputShow: true
        })
      }
    })
  },
  deleteAllOne(e) {
    console.log(e)
    this.setData({
      imgsfile: ''
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
})