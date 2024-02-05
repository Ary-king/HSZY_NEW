const sdk = getApp().sdk;
const CGI = require('../../constant/cgi');
const {
  getPrevPageData
} = sdk.utils.pageData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    txt:''
  },
  onLoad() {
    const pageData = getPrevPageData()
    console.log("上一个页面带过来的数据----", pageData)
    this.setData({
      txt:pageData.txt
    })
  }

})