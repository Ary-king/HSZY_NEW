const sdk = getApp().sdk;
const CGI = require('../../constant/cgi');
const {
  getPrevPageData
} = sdk.utils.pageData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectShow: true,
    collectTxt: '收藏职位',
    collectImg: 'https://heshiwork.com/storage/202401/6af5d1fb20f31981048d4ef3a9ce55ec.png',
    companyShow: false,
    reserve: '1',
    markers: [{
      id: 0,
      iconPath: "https://static.gjzwfw.gov.cn/location-icon.png",
      width: 50,
      height: 50,
      latitude: 39.958339,
      longitude: 116.313740,
      title: "北京理工大学",
      callout: {
        content: "超警",
        color: '#000000',
        fontSize: 12,
        // anchorX: item.lat,
        // anchorY: item.lgt,
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 3,
        bgColor: '#ffffff',
        padding: 5,
        textAlign: 'left'
      }
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const pageData = getPrevPageData()
    console.log("上一个页面带过来的数据----", pageData)
    this.setData({
      status: pageData.status,
      reserve: pageData.reserve,
      identId: pageData.identId,
      company: pageData.dataList.company,
      job: pageData.dataList.job,
      order:pageData.dataList.order
    })
  },

  gotoReserve() {
    this.setData({
      params: {
        id: this.data.identId,
        dataList: this.data.job
      }
    })
    wx.navigateTo({
      url: '/pages/reserve/index',
    })
  },
  showAll() {
    this.setData({
      companyShow: true
    })
  },
  goCollect() {
    const id = this.data.identId
    sdk.utils.extend.showLoading('加载中');
    sdk.request({
      url: CGI.getaddcollect,
      method: 'POST',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        id: id.toString()
      }
    }).then(res => {
      sdk.utils.extend.hideLoading()
      console.log(res)
      if (res.code == 0) {
        if (res.msg == '加入收藏成功！') {
          this.setData({
            collectShow: false,
            collectTxt: '取消收藏',
            collectImg: 'https://heshiwork.com/storage/202401/c5cbd6be5f2acc76d28da9fd266dd8cb.png'
          })
          wx.showToast({
            title: '您已收藏成功！'
          })
          return
        }
        if (res.msg == '取消收藏成功！') {
          this.setData({
            collectShow: true,
            collectTxt: '收藏职位',
            collectImg: 'https://heshiwork.com/storage/202401/6af5d1fb20f31981048d4ef3a9ce55ec.png'
          })
          wx.showToast({
            title: '您已取消收藏！'
          })
          return
        }
      }
    }).catch(err => {
      sdk.utils.extend.hideLoading()
      console.log(err);
    })
  },
  onShareAppMessage: function (ops) {

    //转发事件来源。
    //button：页面内转发按钮；
    //menu：右上角转发菜单

    if (ops.from === 'button') {
        var title = ops.target.dataset.title;
    };

    return {
        title: '荷适职业', //转发的标题。当前小程序名称
        path: `pages/index/index`, //转发的路径
        imageUrl: '',//自定义图片路径 支持PNG及JPG。显示图片长宽比是 5:4。
    }
},
goJiaobiao(e){
  console.log(e)
  wx.showModal({
    title: '备注',
    content: e.currentTarget.dataset.bz,
    showCancel: false
  });

}
})