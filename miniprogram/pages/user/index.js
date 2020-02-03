const app = getApp();
const db = wx.cloud.database();

Page({
  data: {
    isLogin: false,
    role: '',
    userInfo: {}
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
