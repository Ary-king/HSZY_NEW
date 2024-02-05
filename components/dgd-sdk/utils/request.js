"use strict";
/**
 * Created by bear on 2018.04.21.
 */
const CGI = require('../config/cgi');
const utilsPackage = require("../utils/index");
const {
  urlJoinParams
} = utilsPackage.extend;
const requestPackage = {
  // 原生request的封装
  request(options) {
    console.log(utilsPackage)
    return new Promise((resolve, reject) => {
      wx.request({
        url: urlJoinParams(options.url, options.querystring),
        method: options.method || 'POST',
        header: Object.assign({}, options.header || {}),
        data: options.data,
        success(res) {
          // console.log(`${options.url} Success:`, res.data);
          resolve(res.data);
        },
        fail(err) {
          reject(err);
          console.log(`${options.url} Fail:`, err);
        }
      });
    });
  },
  CGI
};
module.exports = requestPackage;