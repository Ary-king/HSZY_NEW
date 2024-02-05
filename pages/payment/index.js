const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  dayClick(e) {
    console.log("manage_dayClickStart")
    //定义date颜色数组
    let dayStyleTemp = new Array
    //初始化选中颜色
    //获取当前时间
    const year = e.detail.year
    const month = e.detail.month
    const day = e.detail.day
    var date = year + "/" + month + "/" + day
    //设置选中日期颜色
    dayStyleTemp.push({
      month: 'current',
      day: day,
      color: 'white',
      background: '#aad4f5'
    }, );
    this.setData({
      dayStyle: dayStyleTemp,
      start_Day: date
    })

    console.log("date:" + date)
  },
  onLoad(options) {

  },

  gotoBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  gotoIndex() {
    console.log("111111111111111")
    wx.switchTab({
      url: '/pages/index/index',
    })
  }

})