const app = getApp();
const db = wx.cloud.database();

Page({
  data: {
    isLogin: false,
    role: '',
    loginInfo: {}
  },
  onLoad () {
    const { globalData } = app
    this.setData({
      isLogin: globalData.isLogin,
      role: globalData.role,
      loginInfo: globalData.loginInfo
    })
  },
  onShow () {
    this.getTabBar().init();
  },
  login () {

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
