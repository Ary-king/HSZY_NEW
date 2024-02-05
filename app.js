const mainApp = require('./main-app');
App({
  onLaunch() {
    mainApp.onLaunch.apply(this, arguments);

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.removeStorageSync('zwms');
    wx.removeStorageSync('zwsxnr');
    wx.removeStorageSync('zwsxyq');
    wx.removeStorageSync('bqsm');
    wx.removeStorageSync('againData');
    wx.removeStorageSync('dataListSelect');
    wx.removeStorageSync('dataListFilt');
    wx.removeStorageSync('bjCity');
    wx.removeStorageSync('cityName');
  },
  onShow: function () {
    mainApp.onShow.apply(this, arguments);
  },
  // onHide: function () {
  //   mainApp.onHide.apply(this, arguments);
  // },
  globalData: mainApp.globalData
})