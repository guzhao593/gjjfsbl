import Toast from '/@vant/weapp/toast/toast';
import Dialog from '/@vant/weapp/dialog/dialog';
const app = getApp();
const ui = require('../../utils/ui.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountForm: {
      newPassword: '',
      confirmPassword: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  onChange({ target, detail }) {
    this.setData({
      [`accountForm.${target.id}`]: detail
    })
  },

  handleConfirm() {
    const form = this.data.accountForm
    if (!form.newPassword) return Toast('请输入新密码')
    if (!form.confirmPassword) return Toast('请输入确认密码')
    if (form.newPassword !== form.confirmPassword) return Toast('两次输入的密码不一致，请确认')
    ui.showLoading('保存中...')
   this.modifyAccount()
  },

  modifyAccount() {
    wx.cloud.callFunction({
      name: 'modifyPassword',
      data: {
        accountForm: {
          ...this.data.accountForm,
          account: app.globalData.loginInfo.account
        },
        databaseName: app.globalData.role + 'Account'
      },
      success: (res) => {
        Dialog
          .alert({
            message: '修改成功！'
          })
          .then(() => {
            wx.navigateTo({
              url: '../setUp/index'
            })
          })
      },
      fail: () => {
        Dialog
          .alert({
            message: '修改失败，请重新提交！'
          })
      },
      complete: () => {
        ui.hideLoading()
      }
    })
  }
})