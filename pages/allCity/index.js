//先引用城市数据文件
var city = require('../../constant/city.js')
var lineHeight = 0;
var endWords = "";
var isNum;
const sdk = getApp().sdk;
Page({
  data: {
    "hidden": true,
    cityName: "北京", //获取选中的城市名
  },
  onLoad(options) {},
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    var cityChild = city.City[0];
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        lineHeight = (res.windowHeight - 100) / 22;
        console.log(res.windowHeight - 100)
        that.setData({
          city: cityChild,
          winHeight: res.windowHeight - 40,
          lineHeight: lineHeight
        })
      }
    })
  },
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  //触发全部开始选择
  chStart: function () {
    this.setData({
      trans: ".3",
      hidden: false
    })
  },
  //触发结束选择
  chEnd: function () {
    this.setData({
      trans: "0",
      hidden: true,
      scrollTopId: this.endWords
    })
  },
  //获取文字信息
  getWords: function (e) {
    var id = e.target.id;
    this.endWords = id;
    isNum = id;
    this.setData({
      showwords: this.endWords
    })
  },
  //设置文字信息
  setWords: function (e) {
    var id = e.target.id;
    this.setData({
      scrollTopId: id
    })
  },

  // 滑动选择城市
  chMove: function (e) {
    var y = e.touches[0].clientY;
    var offsettop = e.currentTarget.offsetTop;
    var height = 0;
    var that = this;;
    var cityarr = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"]
    // 获取y轴最大值
    wx.getSystemInfo({
      success: function (res) {
        height = res.windowHeight - 10;
      }
    });

    //判断选择区域,只有在选择区才会生效
    if (y > offsettop && y < height) {
      // console.log((y-offsettop)/lineHeight)
      var num = parseInt((y - offsettop) / lineHeight);
      endWords = cityarr[num];
      // 这里 把endWords 绑定到this 上，是为了手指离开事件获取值
      that.endWords = endWords;
    };


    //去除重复，为了防止每次移动都赋值 ,这里限制值有变化后才会有赋值操作，
    //DOTO 这里暂时还有问题，还是比较卡，待优化
    if (isNum != num) {
      // console.log(isNum);
      isNum = num;
      that.setData({
        showwords: that.endWords
      })
    }
  },
  //选择城市，并让选中的值显示在文本框里
  bindCity: function (e) {
    console.log(e);
    let idxName = e.currentTarget.dataset.idx
    let cityName = e.currentTarget.dataset.city;
    this.data.city[idxName].forEach(res => {
      console.log(res)
      if (cityName == res.names) {
        res.checkShow = false
      } else {
        res.checkShow = true
      }
    })
    let allCitys = this.data.city
    console.log(allCitys)
    for (let key in allCitys) {
      console.log("for in循环" + key);
      if (idxName != key) {
        console.log(allCitys[key])
        let arr = allCitys[key]
        for (var i = 0; i < arr.length; i++) {
          console.log(arr[i])
          arr[i].checkShow = true
        }
      }
    }

    this.setData({
      city: allCitys,
      cityName: cityName
    })
  },
  goSkip(e) {
    console.log(e)
    console.log(e.currentTarget.dataset.cityname)
    let city = e.currentTarget.dataset.cityname
    // if (city == '北京') {
    //   wx.navigateTo({
    //     url: '/pages/bjcity/index?cityname=' + city,
    //   })
    // } else {
      wx.setStorageSync('cityName', city)
      wx.setStorageSync('againData', '1')
      wx.switchTab({
        url: '/pages/index/index',
      })
    // }
  }

})



























// const sdk = getApp().sdk;
// const CGI = require('../../constant/cgi');
// const {
//   getPrevPageData
// } = sdk.utils.pageData;
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {

//   },
//   onLoad() {
//     this.goCollect()
//   },

//   goCollect() {
//     sdk.utils.extend.showLoading('加载中');
//     sdk.request({
//       url: CGI.getAllCity,
//       method: 'GET',
//       data: {}
//     }).then(res => {
//       sdk.utils.extend.hideLoading()
//       console.log(res)
//     }).catch(err => {
//       sdk.utils.extend.hideLoading()
//       console.log(err);
//     })
//   },
// })