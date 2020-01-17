// miniprogram/pages/appointment.js
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  scan () {
    wx.scanCode({
      success (res) {
        wx.showToast({
          title: res,
        })
        qrcodeFn();
        function qrcodeFn() {
          wx.request({
            url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx803dbaf7ff67e7fd&secret=小程序密钥',
            complete: function (tokenRes) {
              wx.request({
                url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + tokenRes.data.access_token,
                method: 'POST',
                data: {
                  scene: 1012,
                  // 是否为Png，默认jpeg
                  is_hyaline: true,
                  // 是否自动取色
                  auto_color: true,
                  page: 'pages/orderDetails/index',
                },
                responseType: 'arraybuffer',
                complete: function (res) {
                  // 自动复制到剪切板
                  wx.setClipboardData({
                    data: wx.arrayBufferToBase64(res.data),
                    success(res) { }
                  })
                  console.log(wx.arrayBufferToBase64(res.data));
                },
              })
            },
          });
        }
      }
    })
  }
})