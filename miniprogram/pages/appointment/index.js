import Dialog from '/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().init();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  scan () {
    wx.scanCode({
      success: (res) => {
        this.handleScanResult(res.result)
      },
      fail: () => {
        Dialog.alert({ message: '无法识别的文件' })
      }
    })
  },

  handleScanResult (data) {
    if (!data.includes('http://gjjfc666666.gz01.bdysite.com/gjjfsbl')) return Dialog.alert({ message: '无效的二维码' })

    wx.navigateTo({
      url: '../orderDetail/index?' + data.split('?')[1],
      success: (res) => {
        res.eventChannel.emit('acceptDataFromOpenerPage', {})
      }
    })
  }
})