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
        this.clearUserInfo()
        wx.reLaunch({
          url: '../user/index'
        })
      })
  },

  clearUserInfo () {
    app.globalData = {
      openId: app.globalData.openId,
      role: 'customer',
      isLogin: false,
      token: '',
      userInfo: {}
    }
    wx.setStorageSync('token', app.globalData.token)
    wx.setStorageSync('isLogin', app.globalData.isLogin)
    wx.setStorageSync('role', app.globalData.role)
    wx.setStorageSync('userInfo', app.globalData.userInfo)
  }

})