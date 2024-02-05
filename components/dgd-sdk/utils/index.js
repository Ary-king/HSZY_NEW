"use strict";
const session = require("./session");
const pageData = require('./pageData');
const extend = require("./extend");
const utils = Object.assign({
  session,
  pageData,
  extend
});
console.log('utils :', utils);
module.exports = utils;