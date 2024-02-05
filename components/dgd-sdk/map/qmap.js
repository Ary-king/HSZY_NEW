const _createClass = (function () {
  function a(e, c) {
    for (let b = 0; b < c.length; b++) {
      const d = c[b];
      d.enumerable = d.enumerable || false;
      d.configurable = true;
      if ('value' in d) {
        d.writable = true
      }
      Object.defineProperty(e, d.key, d)
    }
  }
  return function (d, b, c) {
    if (b) {
      a(d.prototype, b)
    }
    if (c) {
      a(d, c)
    }
    return d
  }
})();

function _classCallCheck(a, b) {
  if (!(a instanceof b)) {
    throw new TypeError('Cannot call a class as a function')
  }
}
const ERROR_CONF = {
  KEY_ERR: 311,
  KEY_ERR_MSG: 'key格式错误',
  PARAM_ERR: 310,
  PARAM_ERR_MSG: '请求参数信息有误',
  SYSTEM_ERR: 600,
  SYSTEM_ERR_MSG: '系统错误',
  WX_ERR_CODE: 1000,
  WX_OK_CODE: 200
};
const BASE_URL = 'https://apis.map.qq.com/ws/';
const URL_SEARCH = BASE_URL + 'place/v1/search';
const URL_SUGGESTION = BASE_URL + 'place/v1/suggestion';
const URL_GET_GEOCODER = BASE_URL + 'geocoder/v1/';
const URL_CITY_LIST = BASE_URL + 'district/v1/list';
const URL_AREA_LIST = BASE_URL + 'district/v1/getchildren';
const URL_DISTANCE = BASE_URL + 'distance/v1/';
var Utils = {
  location2query: function location2query(c) {
    if (typeof c === 'string') {
      return c
    }
    let b = '';
    for (let a = 0; a < c.length; a++) {
      const e = c[a];
      if (b) {
        b += ';'
      }
      if (e.location) {
        b = b + e.location.lat + ',' + e.location.lng
      }
      if (e.latitude && e.longitude) {
        b = b + e.latitude + ',' + e.longitude
      }
    }
    return b
  },
  getWXLocation: function getWXLocation(c, b, a) {
    wx.getLocation({
      type: 'gcj02',
      success: c,
      fail: b,
      complete: a
    })
  },
  getLocationParam: function getLocationParam(b) {
    if (typeof b === 'string') {
      const a = b.split(',');
      if (a.length === 2) {
        b = {
          latitude: b.split(',')[0],
          longitude: b.split(',')[1]
        }
      } else {
        b = {}
      }
    }
    return b
  },
  polyfillParam: function polyfillParam(a) {
    a.success = a.success || function () {};
    a.fail = a.fail || function () {};
    a.complete = a.complete || function () {}
  },
  checkParamKeyEmpty: function checkParamKeyEmpty(c, b) {
    if (!c[b]) {
      const a = this.buildErrorConfig(ERROR_CONF.PARAM_ERR, ERROR_CONF.PARAM_ERR_MSG + b + '参数格式有误');
      c.fail(a);
      c.complete(a);
      return true
    }
    return false
  },
  checkKeyword: function checkKeyword(a) {
    return !this.checkParamKeyEmpty(a, 'keyword')
  },
  checkLocation: function checkLocation(c) {
    const a = this.getLocationParam(c.location);
    if (!a || !a.latitude || !a.longitude) {
      const b = this.buildErrorConfig(ERROR_CONF.PARAM_ERR, ERROR_CONF.PARAM_ERR_MSG + ' location参数格式有误');
      c.fail(b);
      c.complete(b);
      return false
    }
    return true
  },
  buildErrorConfig: function buildErrorConfig(a, b) {
    return {
      status: a,
      message: b
    }
  },
  buildWxRequestConfig: function buildWxRequestConfig(c, a) {
    const b = this;
    a.header = {
      'content-type': 'application/json'
    };
    a.method = 'GET';
    a.success = function (d) {
      const e = d.data;
      if (e.status === 0) {
        c.success(e)
      } else {
        c.fail(e)
      }
    };
    a.fail = function (d) {
      d.statusCode = ERROR_CONF.WX_ERR_CODE;
      c.fail(b.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, d.errMsg))
    };
    a.complete = function (d) {
      const e = +d.statusCode;
      switch (e) {
        case ERROR_CONF.WX_ERR_CODE:
          c.complete(b.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, d.errMsg));
          break;
        case ERROR_CONF.WX_OK_CODE:
          var f = d.data;
          if (f.status === 0) {
            c.complete(f)
          } else {
            c.complete(b.buildErrorConfig(f.status, f.message))
          }
          break;
        default:
          c.complete(b.buildErrorConfig(ERROR_CONF.SYSTEM_ERR, ERROR_CONF.SYSTEM_ERR_MSG))
      }
    };
    return a
  },
  locationProcess: function locationProcess(f, e, c, a) {
    const d = this;
    c = c || function (g) {
      g.statusCode = ERROR_CONF.WX_ERR_CODE;
      f.fail(d.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, g.errMsg))
    };
    a = a || function (g) {
      if (g.statusCode == ERROR_CONF.WX_ERR_CODE) {
        f.complete(d.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, g.errMsg))
      }
    };
    if (!f.location) {
      d.getWXLocation(e, c, a)
    } else if (d.checkLocation(f)) {
      const b = Utils.getLocationParam(f.location);
      e(b)
    }
  }
};
const QQMapWX = (function () {
  function b(i) {
    _classCallCheck(this, b);
    if (!i.key) {
      throw Error('key值不能为空')
    }
    this.key = i.key
  }
  _createClass(b, [{
    key: 'search',
    value: function f(i) {
      const l = this;
      i = i || {};
      Utils.polyfillParam(i);
      if (!Utils.checkKeyword(i)) {
        return
      }
      const k = {
        keyword: i.keyword,
        orderby: i.orderby || '_distance',
        page_size: i.page_size || 10,
        page_index: i.page_index || 1,
        output: 'json',
        key: l.key
      };
      if (i.address_format) {
        k.address_format = i.address_format
      }
      if (i.filter) {
        k.filter = i.filter
      }
      const n = i.distance || '1000';
      const j = i.auto_extend || 1;
      const m = function m(o) {
        k.boundary = 'nearby(' + o.latitude + ',' + o.longitude + ',' + n + ',' + j + ')';
        wx.request(Utils.buildWxRequestConfig(i, {
          url: URL_SEARCH,
          data: k
        }))
      };
      Utils.locationProcess(i, m)
    }
  }, {
    key: 'getSuggestion',
    value: function h(i) {
      const k = this;
      i = i || {};
      Utils.polyfillParam(i);
      if (!Utils.checkKeyword(i)) {
        return
      }
      const j = {
        keyword: i.keyword,
        region: i.region || '全国',
        region_fix: i.region_fix || 0,
        policy: i.policy || 0,
        output: 'json',
        key: k.key
      };
      wx.request(Utils.buildWxRequestConfig(i, {
        url: URL_SUGGESTION,
        data: j
      }))
    }
  }, {
    key: 'reverseGeocoder',
    value: function a(i) {
      const k = this;
      i = i || {};
      Utils.polyfillParam(i);
      const j = {
        coord_type: i.coord_type || 5,
        get_poi: i.get_poi || 0,
        output: 'json',
        key: k.key
      };
      if (i.poi_options) {
        j.poi_options = i.poi_options
      }
      const l = function l(m) {
        j.location = m.latitude + ',' + m.longitude;
        wx.request(Utils.buildWxRequestConfig(i, {
          url: URL_GET_GEOCODER,
          data: j
        }))
      };
      Utils.locationProcess(i, l)
    }
  }, {
    key: 'geocoder',
    value: function g(i) {
      const k = this;
      i = i || {};
      Utils.polyfillParam(i);
      if (Utils.checkParamKeyEmpty(i, 'address')) {
        return
      }
      const j = {
        address: i.address,
        output: 'json',
        key: k.key
      };
      wx.request(Utils.buildWxRequestConfig(i, {
        url: URL_GET_GEOCODER,
        data: j
      }))
    }
  }, {
    key: 'getCityList',
    value: function c(i) {
      const k = this;
      i = i || {};
      Utils.polyfillParam(i);
      const j = {
        output: 'json',
        key: k.key
      }
      wx.request(Utils.buildWxRequestConfig(i, {
        url: URL_CITY_LIST,
        data: j
      }))
    }
  }, {
    key: 'getDistrictByCityId',
    value: function d(i) {
      const k = this;
      i = i || {};
      Utils.polyfillParam(i);
      if (Utils.checkParamKeyEmpty(i, 'id')) {
        return
      }
      const j = {
        id: i.id || '',
        output: 'json',
        key: k.key
      };
      wx.request(Utils.buildWxRequestConfig(i, {
        url: URL_AREA_LIST,
        data: j
      }))
    }
  }, {
    key: 'calculateDistance',
    value: function e(i) {
      const k = this;
      i = i || {};
      Utils.polyfillParam(i);
      if (Utils.checkParamKeyEmpty(i, 'to')) {
        return
      }
      const j = {
        mode: i.mode || 'walking',
        to: Utils.location2query(i.to),
        output: 'json',
        key: k.key
      };
      const l = function l(m) {
        j.from = m.latitude + ',' + m.longitude;
        wx.request(Utils.buildWxRequestConfig(i, {
          url: URL_DISTANCE,
          data: j
        }))
      };
      if (i.from) {
        i.location = i.from
      }
      Utils.locationProcess(i, l)
    }
  }]);
  return b
})();
module.exports = QQMapWX