"use strict";
/**
 * Created by bear on 2018.04.21.
 */
const { request } = require('./utils/request');
const utils = require("./utils/index");
const extend = require("./utils/extend");
const map = require("./map/index");
const _sdk = {
  utils,
  request,
  extend,
  map
};
module.exports = _sdk;