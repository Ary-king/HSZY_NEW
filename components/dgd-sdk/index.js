"use strict";
/**
 * Created by bear on 2018.04.21.
 */
const { request } = require('./utils/request');
const utils = require("./utils/index");
const extend = require("./utils/extend");
const _sdk = {
  utils,
  request,
  extend
};
module.exports = _sdk;