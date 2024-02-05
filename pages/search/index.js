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
    posNameData:[],
    searchName:'',
    posNameId:0,
    posName:''
  },
  onLoad() {
    this.getjobname()
  },
  onShow(){
    wx.removeStorageSync('againData');
    wx.removeStorageSync('dataListSelect');
    wx.removeStorageSync('dataListFilt');
  },
  //职位名称
  getjobname() {
    sdk.request({
      url: CGI.get_jobname,
      method: 'GET',
      data: {}
    }).then(res => {
      console.log("职位名称------------", res)
      let newData = res.data
      newData.map(item => {
        item.checked = false;
        return item;
      });
      this.setData({
        posNameData: newData
      })
    }).catch(err => {
      console.log(err);
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
  handleChange(e) {
    console.log("----------------",e)
    this.setData({
      searchName: e.detail.value,
    })
  },
  goToEmpty(){
    this.data.posNameData.map(item => {
      item.checked = false;
      return item;
    });
    this.setData({
      posNameData:this.data.posNameData,
      searchName:'',
      posNameId:0,
      posName:''
    })
  },
  goSubmit(){
    const dataListSelect = {
      searchName:this.data.searchName || '',
      posName:this.data.posName || ''
    }
    console.log(dataListSelect)
    wx.setStorageSync('againData', '1')
    wx.setStorageSync('dataListSelect', dataListSelect)
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})