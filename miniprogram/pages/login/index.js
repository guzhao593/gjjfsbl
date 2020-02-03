import Toast from '/@vant/weapp/toast/toast';
const app = getApp();
const db = wx.cloud.database();
const ui = require('../../utils/ui.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginType: '',
    loginForm: {
      account: '',
      password: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      loginType: options.loginType
    })
  },

  handleLogin () {
    if (!this.data.loginForm.account) {
      return Toast('请输入账号')
    }
    if (!this.data.loginForm.password) {
      return Toast('请输入密码')
    }

    ui.showLoading('登录中...')

    db.collection(this.data.loginType + 'Account')
      .where({
        account: this.data.loginForm.account,
        password: this.data.loginForm.password
      })
      .get({
        success: ({ data }) => {
          if (!data.length) return Toast.fail('账号或密码错误')
          Toast.success('登录成功')
          app.globalData.role = this.data.loginType
          app.globalData.isLogin =  true
          app.globalData.userInfo = data[0]
          app.globalData.token = Date.now()
          wx.setStorageSync('token', app.globalData.token)
          wx.setStorageSync('isLogin', app.globalData.isLogin)
          wx.setStorageSync('role', app.globalData.role)
          wx.setStorageSync('userInfo', app.globalData.userInfo)
          wx.reLaunch({
            url: '../user/index',
          })
        },
        fail () {
          Toast.fail('账号或密码错误')
        },
        complete () {
          ui.hideLoading()
        }
      })
  },

  onChange ({ target, detail }) {
    this.setData({
      [`loginForm.${target.id}`]: detail
    })
  }
})