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
