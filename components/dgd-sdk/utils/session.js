"use strict";
const utilsd = require('./extend');

// const {
//   fail
// } = require("assert");

// const CryptoJS = require("./crypto/index");
// const {
//   appid,
//   urlPrefix,
//   paasid
// } = require('../../../../constant/config');
// const extend = require("./extend");
// const reportjs = require("./report");
// // const projectPackage = require("../project");
// const {
//   handleUrlPrefix
// } = projectPackage;
// const Event = require('./events');
let sessionIdTime;
const session = {
  // 处理小程序 session 相关逻辑
  // // // // // // // // // //
  //     请只调用这个方法       //
  // // // // // // // // // //
  // 有效 => return sid
  // 失效 => login and return sid
  getSessionId() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this
        ._checkSession()
        .then(isValid => {
          const sessionId = wx.getStorageSync('sessionId');
          console.log('sync sessionId: ', sessionId);
          console.log('getSessionId: ', isValid);
          if (!isValid) {
            return _this._fetchSessionId();
          }
          if (sessionId) {
            resolve(sessionId);
          } else {
            return _this._fetchSessionId();
          }
        })
        .then(sessionId => {
          resolve(sessionId);
          getApp().__isLogin__ = true;
        })
        .catch(err => {
          getApp().__isLogin__ = false;
          reject(err);
        });
    });
  },
  // // check sid: wx.checkSession
  // // return boolean
  _checkSession() {
    return new Promise(resolve => {
      const sid = wx.getStorageSync('sessionId') || undefined;
      const now = Date.now();
      const sidTime = sessionIdTime;
      // 防止频繁调用wx.checkSession，10min内不检查
      if (now - sidTime < 10 * 60 * 1000 && sid) {
        console.log('check sid range...');
        resolve(true);
      }
      wx.checkSession({
        success: () => {
          if (sid) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        fail: () => {
          resolve(false);
        }
      });
    });
  },
  // 登录 wx.login
  _login4App() {
    console.log('调用 wx.login');
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          console.log("微信的login", res)
          resolve(res.code);
        },
        fail: res => {
          reject(res);
        }
      });
    });
  },
  // // 获取小程序用户信息，包括用户头像等
  // // 小程序官方后期不允许这样调用
  // // https://developers.weixin.qq.com/blogdetail?action=get_post_info&lang=zh_CN&token=&docid=000e2aac1ac838e29aa6c4eaf56409
  _getUserInfo() {
    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        withCredentials: true,
        success: res => {
          // 存储一份用户信息到本地
          try {
            wx.setStorageSync('userInfo', res.userInfo);
          } catch (e) {
            // e
          }
          resolve({
            iv: res.iv,
            encryptedData: res.encryptedData
          });
        },
        fail: err => {
          wx.showModal({
            title: '用户未授权',
            content: '请在 [ 授权管理 ] 选中 [ 用户信息 ] 即可正常使用。',
            success(res) {
              if (res.confirm) {
                wx.openSetting({
                  success: function success(res) {
                    console.log('openSetting success', res.authSetting);
                  }
                });
              }
            }
          });
          reject(err);
        }
      });
    });
  },
  // // update sid
  _fetchSessionId() {
    const vm = this;
    return new Promise((resolve, reject) => {
      let code;
      // 调用小程序登录
      vm._login4App().then(wxCode => {
          const wxCodes = wxCode;
          // 存到storage，并设置存储时的时间戳
          wx.setStorageSync('wxCodes', wxCodes);
          console.log("_fetchSessionId_conde------------" + wxCode)
          if (!wxCode) {
            reject(new Error('Failed to get code!'));
          }
          code = wxCode;
          if (!code) {
            reject(new Error('Failed to get code!'));
          }
          wx.request({
            url: 'https://heshiwork.com/api/index/login',
            method: 'POST',
            data: {
              js_code: code,
            },
            success: (res) => {
              console.log(res)
              console.log('fetch sessionId: ', res);
              if (res.data.code === 0 && res.data.data.session_key) {
                const sessionId = res.data.data.session_key;
                const token = res.data.data.token;
                const uid = res.data.data.data.uid;
                const uIc = res.data.data.data;
                const openid = res.data.data.openid;
                // 存到storage，并设置存储时的时间戳
                wx.setStorageSync('sessionId', sessionId);
                wx.setStorageSync('openid', openid)
                const sessionIdTime = +new Date();
                wx.setStorageSync('sessionIdTime', sessionIdTime)
                wx.setStorageSync('uIc', uIc);
                wx.setStorageSync('unionid', uid);
                wx.setStorageSync('token', token);
                console.log('set sid: ', sessionId);
                resolve(sessionId);
                getApp().__isLogin__ = true;
              }

              //   success: res => {
              //     console.log('fetch sessionId: ', res);
              //     if (res.data.errcode === 0 && res.data.data.session_id) {
              //         const sessionId = res.data.data.session_id, openid = res.data.data.openid, uid = res.data.data.uid;
              //         if (res.data && res.data.data && res.data.data.real_name && res.data.data.credential_id) {
              //             res.data.data.real_name = CryptoJS.DecryptByKey(res.data.data.real_name);
              //             res.data.data.credential_id = CryptoJS.DecryptByKey(res.data.data.credential_id);
              //             const lastNum = res.data.data.credential_id.substr(14, 4);
              //             const firstNum = res.data.data.credential_id.substr(0, 0).padEnd(14, '*');
              //             const cardId = `${firstNum}${lastNum}`;
              //             console.log('解密信息', res.data.data.real_name, res.data.data.credential_id, cardId);
              //             const uIc = {
              //                 name: res.data.data.real_name,
              //                 cid: res.data.data.credential_id,
              //                 mCid: cardId
              //             };
              //             wx.setStorageSync('uIc', uIc);
              //         }
              //         // 存到storage，并设置存储时的时间戳
              //         wx.setStorageSync('sessionId', sessionId);
              //         sessionIdTime = +new Date();
              //         wx.setStorageSync('openid', openid);
              //         wx.setStorageSync('unionid', uid);
              //         console.log('set sid: ', sessionId);
              //         resolve(sessionId);
              //         Event.dispatch('__isLogin__', true);
              //     }
              //     else {
              //         console.error('Request Fail to fetch SessionId', res);
              //         reject(res);
              //         reportjs.statpid2({
              //             eid: 'GSS_FETCHSESSIONIDERR',
              //             desc: 'fetchSessionId错误',
              //             exp1: res.errMsg
              //         });
              //     }
              // },
            },
            fail: (res) => {
              console.error('Request Fail to fetch SessionId', res);
              reject(res);
            }
          });
        })
        .catch(err => {
          // const wxapp = require('../wxapp/index');
          reject(err);
          wx.showModal({
            title: '提示',
            content: '系统维护中，请稍后再试',
            showCancel: false
          });
        });
    });
  },
  // 登录获取手机号
  getphonenumber(code) {
    return new Promise((resolve, reject) => {
      this._get_userinfo();
      wx.request({
        url: 'https://heshiwork.com/api/index/getPhoneNumber',
        method: 'POST',
        header: {
          token: wx.getStorageSync('token')
        },
        data: {
          code: code
        },
        success: (res) => {
          console.log(res)
          if (wx.getStorageSync('sessionId')) {
            const logSucces = true;
            console.log(res.data.mobile);
            const userPhone = res.data.data.mobile
            wx.setStorageSync('logSucces', logSucces)
            wx.setStorageSync('userPhone', userPhone)
            resolve(logSucces);
          }
          utilsd.hideLoading();
        },
        fail: (res) => {
          utilsd.hideLoading();
          console.error('Request Fail to fetch SessionId', res);
          console.log('获取手机号失败', err);
          const logSucces = false;
          wx.setStorageSync('logSucces', logSucces)
          reject(logSucces);
        }
      })
    })
  },
  // 获取个人信息
  _get_userinfo() {
    wx.request({
      url: 'https://heshiwork.com/api/index/get_userinfo',
      method: 'GET',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {},
      success: (res) => {
        console.log("个人信息---------", res)
        const userinfoData = res.data.data
        wx.setStorageSync('userinfoData', userinfoData)
      },
      fail: (err) => {
        console.log("个人信息获取失败---------", res)
      }
    })
  }
};
module.exports = session;