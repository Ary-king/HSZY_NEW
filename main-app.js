const sdk = require('./components/dgd-sdk/index.js');
console.log('GSS-1 开发包的版本：', sdk.version);
module.exports = {
  onLaunch: function (opt) {
    // sdk方法挂全局，调用方法如下
    this.sdk = sdk;
    const now = Number(new Date());
    const sidTime = wx.getStorageSync('sessionIdTime') || 0;
    const sessionId = wx.getStorageSync('sessionId');
    console.log(sessionId)
    if (sessionId && now - sidTime < 10 * 60 * 1000) {
      this.__isLogin__ = true;
    } else {
      this.__isLogin__ = false;
      this.__isAuth__ = false;
      wx.removeStorageSync('sessionId');
    }
  },
  onShow: function (opt) {
    console.log('app onShow_', opt);
    sdk.utils.session.getSessionId();
    if (wx.getStorageSync('sessionId')) {
      console.log("11111111111111111")
      sdk.utils.session.getSessionId();
    } // 将referrerInfo存到globalData
  },
  globalData: {
    "isShowLoading": false,
  }
};