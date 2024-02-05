"use strict";
/**
 * 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
 * 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
 */
const extend = {
    urlJoinParams(url, params) {
        if (!url || !params || typeof params !== 'object') {
            return url;
        }
        const separate = url.indexOf('?') === -1 ? '?' : '&';
        const tempStr = Object.keys(params).map(key => {
            if (typeof params[key] === 'object') {
                params[key] = JSON.stringify(params[key]);
            }
            if (params[key] !== undefined) {
                return `${key}=${params[key]}`;
            }
            return '';
        }).filter(value => value).join('&');
        return `${url}${separate}${tempStr}`;
    },
    // 返回业务页
    // 返回的路径: '/pages/xxx/xxx'
    // url: string
    navigateBackUrl(url) {
        const allPagesLength = getCurrentPages().length;
        const targetIndex = getCurrentPages().findIndex(page => url.indexOf(page.route) >= 0);
        const delta = allPagesLength - targetIndex - 1;
        if (!targetIndex) {
            console.log('back to url success: ', url);
            wx.navigateBack({
                delta
            });
        }
        else {
            console.log('back to url fail: ', url);
        }
    },
    showLoading(tle) {
        const globalData = getApp().globalData;
        globalData.isShowLoading = true;
        wx.showLoading({
            title: tle,
            mask: true
        });
        console.log('isShowLoading', globalData.isShowLoading);
    },
    hideLoading() {
        const globalData = getApp().globalData;
        if (globalData && globalData.isShowLoading) {
            globalData.isShowLoading = false;
            wx.hideLoading();
        }
        console.log('isShowLoading', globalData.isShowLoading);
    }
};
module.exports = extend;
