const sdk = getApp().sdk;
const CGI = require('../../constant/cgi');
const {
	request
} = sdk;
Page({
	data: {
		cityName: '北京',
		pitch: false,
		modelShow: false,
		interval: 20,
		current: 1,
		zPges: 0,
		listData: [],
		logSucces: false
	},
	onLoad() {
		if (wx.getStorageSync('userinfoData')) {
			this.setData({
				logSucces: wx.getStorageSync('logSucces'),
				userinfoData: wx.getStorageSync('userinfoData'),
				userPhone: wx.getStorageSync('userPhone'),
			})
		} else {
			this.setData({
				logSucces: wx.getStorageSync('logSucces')
			})
		}
	},
	gotoDetail(e) {
		const _this = this;
		console.log(e)
		const ident = e.currentTarget.dataset.item
		console.log(ident)
		console.log(ident.id)
		console.log(ident.id.toString())
		sdk.utils.extend.showLoading('加载中');
		if (wx.getStorageSync('logSucces')) {
			sdk.request({
				url: CGI.getjob_detail,
				method: 'GET',
				header: {
					token: wx.getStorageSync('token')
				},
				data: {
					id: ident.id.toString()
				}
			}).then(res => {
				sdk.utils.extend.hideLoading()
				console.log(res)
				if (res.code == 0) {
					_this.setData({
						params: {
							reserve: "1",
							identId: ident.id,
							dataList: res.data
						}
					});
					wx.navigateTo({
						url: '/pages/hotdetail/index',
					})
				}
			}).catch(err => {
				sdk.utils.extend.hideLoading()
				console.log(err);
			})
		} else {
			wx.showToast({
				title: '您暂未登录小程序',
			})
		}
	},

	getIndexDataInfo(current, dataListSelect, dataListFilt, cityName, bjCity) {
		console.log('传入的参数-----', dataListSelect, dataListFilt)
		sdk.utils.extend.showLoading('加载中');
		sdk.request({
			url: CGI.getIndexData,
			method: 'GET',
			data: {
				page: 1,
				keysword: dataListSelect.searchName || '',
				open_groups: dataListFilt.opengroups || '',
				type: dataListFilt.type || '',
				title: dataListFilt.posName || dataListSelect.posName || '',
				industry: dataListFilt.industry || '',
				time: dataListFilt.setupTim || '',
				number: dataListFilt.scaleCom || '',
				city: cityName || '',
				prod: bjCity || ''
			}
		}).then(res => {
			sdk.utils.extend.hideLoading();
			console.log("首页数据--------", res)
			if (res.msg == '请求成功') {
				if (res.data.list.total > 0) {
					let alldataList = res.data.list.data;
					if (current > 1) {
						alldataList = this.data.listData.concat(alldataList);
					}
					this.setData({
						listData: alldataList,
						zPges: res.data.list.last_page,
						swiperBanner: res.data.banner,
						scrollbar: res.data.scrollbar,
						text: res.data.scrollbar[0].name
					})
				} else {
					this.setData({
						listData: res.data.list.data,
						zPges: res.data.list.last_page,
						swiperBanner: res.data.banner,
						scrollbar: res.data.scrollbar,
						text: res.data.scrollbar[0].name
					})
				}
			}
		})
	},

	// 登录获取手机号
	bindgetphonenumber(e) {
		sdk.utils.extend.showLoading('加载中');
		// 接口正常
		if (e.detail.errMsg == "getPhoneNumber:ok") {
			console.log()
			sdk.utils.session.getphonenumber(e.detail.code).then(logSucces => {
				this.setData({
					logSucces,
					modelShow: false
				})
			})
		} else {
			sdk.utils.extend.hideLoading();
			console.log("取消获取数据")
			const logSucces = false;
			wx.setStorageSync('logSucces', logSucces)
		}

	},
	onShow() {
		console.log("-------------------------", wx.getStorageSync('againData') == '1')
		if (wx.getStorageSync('againData') == '1') {
			const dataListSelect = wx.getStorageSync('dataListSelect')
			const dataListFilt = wx.getStorageSync('dataListFilt')
			const cityName = wx.getStorageSync('cityName')
			const bjCity = wx.getStorageSync('bjCity')
			this.getIndexDataInfo(this.data.current, dataListSelect, dataListFilt, cityName, bjCity)
		} else {
			this.getIndexDataInfo(this.data.current, [], [], '', '')
		}
		// this.getIndexDataInfo(this.data.current); // 确保重新进入小程序请求一次数据
		if (wx.getStorageSync('userinfoData')) {
			this.setData({
				logSucces: wx.getStorageSync('logSucces'),
				userinfoData: wx.getStorageSync('userinfoData'),
				userPhone: wx.getStorageSync('userPhone'),
				modelShow: false,
				cityName: wx.getStorageSync('cityName') || '北京'
			})
		} else {
			this.setData({
				logSucces: wx.getStorageSync('logSucces'),
				cityName: wx.getStorageSync('cityName') || '北京'
			})
		}
		
	},


	goSelect() {
		wx.navigateTo({
			url: '/pages/select/index',
		})
	},
	goSearch() {
		wx.navigateTo({
			url: '/pages/search/index',
		})
	},

	onReachBottom(e) {
		let zPges = this.data.zPges;
		let current = this.data.current;
		current++;
		console.log(current)
		console.log(zPges)
		if (current <= zPges) {
			this.setData({
				current
			}, () => {
				this.getIndexDataInfo(current);
			});
		}
	},
	gopitch() {
		this.setData({
			pitch: !this.data.pitch
		})
	},
	goLogin() {
		this.setData({
			modelShow: true
		})
	},
	goAgreement() {
		wx.navigateTo({
			url: '/pages/agreement/index',
		})
	},
	goCity(e) {
		let city = e.currentTarget.dataset.city
		wx.navigateTo({
			url: '/pages/bjcity/index?cityname=' + city,
		})
	},
	goNoBut() {
		this.setData({
			modelShow: false
		})
	},
	bindtaPhone() {
		if (!this.data.pitch) {
			wx.showToast({
				title: '请先查看协议同意后再登录',
				icon: 'none'
			})
		}
	}
})