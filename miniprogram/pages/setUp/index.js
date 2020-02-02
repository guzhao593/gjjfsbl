// miniprogram/pages/account/index.js
import Dialog from '/@vant/weapp/dialog/dialog';
const app = getApp()
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
    this.setData({
      role: app.globalData.role
    })
  },

  handleLogout () {
    Dialog.confirm({
        message: '确定要退出登录吗？'
      }).then(() => {
        app.globalData = {}
        wx.reLaunch({
          url: '../user/index'
        })
      })
  },

})