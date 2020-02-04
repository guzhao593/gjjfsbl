import drawQrcode from '../../utils/weapp.qrcode.js'
const app = getApp();
const db = wx.cloud.database();

Page({
  data: {
    isLogin: false,
    role: '',
    userInfo: {}
  },

  onLoad (options) {
    if (options.fromLogin === 'Y') {
      const queryMap = {
        admin: {},
        serviceProvider: {
          serviceProviderCode: app.globalData.userInfo.serviceProviderCode
        },
        serviceNetwork: {
          serviceNetworkCode: app.globalData.userInfo.serviceNetworkCode
        }
      }
      const $ = db.command.aggregate
      db.collection('order')
        .aggregate()
        .match(queryMap[options.role])
        .group({
          _id: null,
          orderTotal: $.sum(1),
          amountTotal: $.sum('$orderAmount'),
          commissionTotal: $.sum('$orderCommission')
        })
        .end()
        .then(res => {
          console.log(res.list[0], 'res')
          this.setData({
            orderTotal: res.list[0].orderTotal,
            amountTotal: res.list[0].amountTotal,
            commissionTotal: res.list[0].commissionTotal
          })
        })
    }
  },

  onShow () {
    const { globalData } = app
    this.setData({
      isLogin: globalData.isLogin,
      role: globalData.role,
      userInfo: globalData.userInfo
    })
    this.getTabBar().init();
  },

  draw () {
    drawQrcode({
      width: 160,
      height: 160,
      x: 20,
      y: 20,
      canvasId: 'qrcode',
      typeNumber: 10,
      text: this.generateQrcodeUrl(app.globalData.userInfo),
      image: {
        imageResource: '../../images/logo.png',
        dx: 70,
        dy: 70,
        dWidth: 60,
        dHeight: 60
      },
      callback(e) {
        console.log('e: ', e)
      }
    })
  },

  generateQrcodeUrl (data) {
    return `http://gjjfc666666.gz01.bdysite.com/gjjfsbl?serviceNetworkCode=${data.serviceNetworkCode}&serviceProviderCode=${data.serviceProviderCode}`
  },

  handleShowQrcode () {
    this.draw()
    this.setData({
      showQrcode: true
    })
  },

  download () {
    // 导出图片
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 300,
      height: 300,
      destWidth: 300,
      destHeight: 300,
      canvasId: 'qrcode',
      success(res) {
        let tempFilePath = res.tempFilePath

        // 保存到相册
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (res) {
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  },

  confirm () {
    this.setData({
      showQrcode: false
    })
  },

  handleLoginType ({ target }) {
    wx.navigateTo({
      url: `../login/index?loginType=${target.id}`,
      events: {
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
        }
      }
    })
  },
});
