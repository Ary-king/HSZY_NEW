const sdk = getApp().sdk;
const CGI = require('../../constant/cgi');
const {
  getPrevPageData
} = sdk.utils.pageData;
const usedata = require('../../constant/usedata.js');
const idCard = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
const phoneReg = /^1[3456789]\d{9}$/;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageNum :'2',
    iDone: '',
    iDtwo: '',
    iDthre: '',
    ageindex: 0,
    range: [{
      value: 1,
      name: "男"
    }, {
      value: 2,
      name: "女"
    }],
    isContainer: '2',
    certificateType: [],
    certificateTypeindex: 0,
    certificateTypeName: '身份证',
    sexName: '男',
    educatioName: '本科',
    gradeName: '大一',
    educationdata: [],
    educationindex: 4,
    gradedata: [],
    gradeindex: 3,
    imgsfile: [],
    images: [],
    qyimgsfile: [],
    socialImgs: [],
    retPage: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    console.log("------------------", e)
    if (e.arr) {
      let arr = JSON.parse(e.arr);
      this.setData({
        pageNum: arr.pageNum
      })
    }
    this.setData({
      certificateType: usedata.certificateType,
      educationdata: usedata.educationdata,
      gradedata: usedata.gradedata,
    })
  },
  //点击切换标题栏
  containerMs(e) {
    const isContainer = e.currentTarget.dataset.container;
    console.log(isContainer)
    if (isContainer === this.data.isContainer) {
      return;
    }
    if (isContainer == 2) {

    }
    this.setData({
      iDone: '',
      iDtwo: '',
      iDthre: '',
      isContainer: isContainer,
      ageindex: 0,
      certificateTypeindex: 0,
      educationindex: 0,
      gradeindex: 0,
      certificateTypeName: '身份证',
      sexName: '男',
      educatioName: '本科',
      gradeName: '高一',
    })
  },
  bindPickerChangeAge(e) {
    console.log(e)
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const ageId = e.detail.value
    this.setData({
      sexName: this.data.range[ageId].name,
      ageindex: ageId
    })
  },
  bindPickerChangeIdentity(e) {
    console.log(e)
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const ageId = e.detail.value
    this.setData({
      certificateTypeName: this.data.certificateType[ageId].name,
      certificateTypeindex: ageId
    })
  },
  bindPickerChangEducation(e) {
    console.log(e)
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const ageId = e.detail.value
    this.setData({
      educatioName: this.data.educationdata[ageId].name,
      educationindex: ageId
    })
  },
  bindPickerChanGrade(e) {
    console.log(e)
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const ageId = e.detail.value
    this.setData({
      gradeName: this.data.gradedata[ageId].name,
      gradeindex: ageId
    })
  },
  handleChange(e) {
    this.setData({
      [e.target.id]: e.detail.value,
    })
  },


  formSubmit(e) {
    console.log('学生----------------：', e.detail.value)
    const sumData = e.detail.value;
    if (sumData.name == '' || sumData.number == '' || sumData.mobile == '' || sumData.school == '') {
      wx.showModal({
        title: '提示',
        content: '信息未填写完整，请完善相关信息',
        showCancel: false
      });
      return
    }
    if (this.data.iDone == '') {
      wx.showModal({
        title: '提示',
        content: '未上传身份证正面图片',
        showCancel: false
      });
      return
    }
    if (this.data.iDtwo == '') {
      wx.showModal({
        title: '提示',
        content: '未上传身份证反面图片',
        showCancel: false
      });
      return
    }
    if (this.data.iDthre == '') {
      wx.showModal({
        title: '提示',
        content: '未上传学生证正面图片',
        showCancel: false
      });
      return
    }
    if (!phoneReg.test(sumData.mobile)) {
      wx.showModal({
        title: '提示',
        content: '手机号格式不正确',
        showCancel: false
      });
      return
    }
    const contData = {
      type: 2,
      name: sumData.name,
      sex: this.data.range[this.data.ageindex].value,
      number_type: this.data.certificateTypeName,
      number: sumData.number,
      mobile: sumData.mobile,
      education: this.data.gradeName,
      school: sumData.school,
      grade: this.data.educatioName,
      img1: this.data.iDone,
      img2: this.data.iDthre,
      img3: this.data.iDtwo,
      age: sumData.age,
      imgs: this.data.imgsfile,
      images: []
    }
    console.log(contData)
    console.log("提交的个人信息未工作的-----------", contData)
    this.addUserInfo(contData).then(res => {
      console.log(res)
      if (res.msg == '操作成功') {
        wx.showToast({
          title: '信息提交成功',
        })
        if (this.data.pageNum == '1') {
          wx.navigateBack({
            url: 1,
          })

        } else {
          wx.redirectTo({
            url: '/pages/persdatalist/index',
          })
        }
      }
    }).catch(err => {
      console.log(err);
      wx.showModal({
        title: '提示',
        content: '系统维护中，请稍后再试',
        showCancel: false
      });
    });
    wx.hideLoading()
  },
  addUserInfo(item) {
    wx.showLoading({
      title: '加载中',
    })
    return new Promise((resolve, reject) => {
      sdk.request({
        url: CGI.set_info,
        method: 'POST',
        header: {
          token: wx.getStorageSync('token')
        },
        data: item
      }).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      })
    })
  },
  formSubmitqy(e) {
    console.log(e)
    console.log('社会人员form发生了submit事件，携带数据为：', e.detail.value)
    const sumData = e.detail.value;
    if (sumData.qyname == '' || sumData.qyidnumber == '' || sumData.qymobile == '' || sumData.qyage == "") {
      wx.showModal({
        title: '提示',
        content: '信息未填写完整，请完善相关信息',
        showCancel: false
      });
      return
    }
    if (this.data.iDone == '') {
      wx.showModal({
        title: '提示',
        content: '未上传身份证正面图片',
        showCancel: false
      });
      return
    }
    if (this.data.iDtwo == '') {
      wx.showModal({
        title: '提示',
        content: '未上传身份证反面图片',
        showCancel: false
      });
      return
    }
    if (!phoneReg.test(sumData.qymobile)) {
      wx.showModal({
        title: '提示',
        content: '手机号格式不正确',
        showCancel: false
      });
      return
    }
    if (this.data.socialImgs.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '未上传社保加纳记录',
        showCancel: false
      });
      return
    }

    const contData = {
      type: 1,
      name: sumData.qyname,
      sex: this.data.range[this.data.ageindex].value,
      number_type: this.data.certificateTypeName,
      number: sumData.qyidnumber,
      mobile: sumData.qymobile,
      education: '',
      school: '',
      grade: '',
      img1: this.data.iDone,
      img2: this.data.iDtwo,
      img3: '',
      imgs: [],
      age: sumData.qyage,
      images: this.data.socialImgs
    }
    console.log(contData)
    this.addUserInfo(contData).then(res => {
      console.log(res)
      if (res.msg == '操作成功') {
        wx.showToast({
          title: '信息提交成功',
        })
        if (this.data.pageNum == '1') {
          wx.navigateBack({
            url: 1,
          })

        } else {
          wx.reLaunch({
            url: '/pages/persdatalist/index',
          })
        }
      }
    }).catch(err => {
      console.log(err);
      wxapp.showModal({
        title: '提示',
        content: '系统维护中，请稍后再试',
        showCancel: false
      });
    });
    wx.hideLoading()
  },




  // 删除上传文件
  deleteAll(e) {
    console.log(e);
    let imgsfile = this.data.imgsfile
    imgsfile.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      imgsfile: imgsfile
    })
    console.log(this.data.imgsfile);
  },
  // 从相册选择图片
  pushimg() {
    let newfils = [];
    let that = this;
    wx.chooseMedia({
      count: 20,
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
  pushimgQy() {
    let newfils = [];
    let that = this;
    wx.chooseMedia({
      count: 3,
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
              newfils = that.data.qyimgsfile.concat('https://heshiwork.com' + data.data);
              console.log(data, that.data.qyimgsfile, that.data.qyimgsfile, 'data------------------');
              that.setData({
                qyimgsfile: newfils
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
  // 删除上传文件
  deleteAllQy(e) {
    console.log(e);
    let qyimgsfile = this.data.qyimgsfile
    qyimgsfile.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      qyimgsfile: qyimgsfile
    })
    console.log(this.data.qyimgsfile);
  },
  deleteSocial(e) {
    console.log(e);
    let socialImgs = this.data.socialImgs
    socialImgs.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      socialImgs: socialImgs
    })
    console.log(this.data.socialImgs);
  },
  socialImgPush() {
    let newfils = [];
    let that = this;
    wx.chooseMedia({
      count: 20,
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
              newfils = that.data.socialImgs.concat('https://heshiwork.com' + data.data);
              console.log(data, that.data.socialImgs, that.data.socialImgs, 'data------------------');
              that.setData({
                socialImgs: newfils
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
  // 从相册选择图片
  pushimgOne(e) {
    console.log(e.currentTarget.dataset.imgid)
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
              that.setData({
                [`${e.currentTarget.dataset.imgid}`]: 'https://heshiwork.com' + data.data
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
  deleteAllOne(e) {
    console.log(e)
    this.setData({
      [`${e.currentTarget.dataset.index}`]: ''
    })
  }
})