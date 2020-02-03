import Toast from '/@vant/weapp/toast/toast';
import Dialog from '/@vant/weapp/dialog/dialog';
const app = getApp();
const db = wx.cloud.database();
const ui = require('../../utils/ui.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountForm: {
      account: '',
      password: ''
    },
    type: 'add'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.account ? 'modify' : 'add',
      'accountForm.account': options.account || ''
    })
  },

  onChange({ target, detail }) {
    this.setData({
      [`accountForm.${target.id}`]: detail
    })
  },

  handleConfirm() {
    const form = this.data.accountForm
    const type = this.data.type
    if (!form.account) return Toast('请输入账户名')
    if (type === 'add' && !form.password) return Toast('请输入密码')
    if (type === 'modify' && !form.newPassword) return Toast('请输入新密码')
    if (type === 'modify' && !form.confirmPassword) return Toast('请输入确认密码')
    if (type === 'modify' && form.newPassword !== form.confirmPassword) return Toast('两次输入的密码不一致，请确认')
    ui.showLoading('保存中...')
    this.data.type ? this.addAcount() : this.modifyAccount()
  },

  addAcount () {
    db.collection('serviceProviderAccount')
      .where({
        account: this.data.accountForm.account
      })
      .get({
        success: ({ data }) => {
          if (data.length) {
            ui.hideLoading()
            return Toast('该账户已经存在')
          }
          const now = Date.now()
          db.collection('serviceProviderAccount')
            .add({
              data: {
                ...this.data.accountForm,
                serviceProviderCode: app.globalData.userInfo.serviceProviderCode,
                isMainAccount: 'N',
                createTime: now,
                lastUpdateTime: now
              },
              success: (res) => {
                Dialog
                  .alert({
                    message: '保存成功！'
                  })
                  .then(() => {
                    wx.navigateTo({
                      url: '../serviceProviderAccount/index?reload=Y'
                    })
                  })
              },
              fail: () => {
                Dialog
                  .alert({
                    message: '保存失败，请重新提交！'
                  })
              },
              complete: () => {
                ui.hideLoading()
              }
            })
        }
      })
  },

  modifyAccount() {
    wx.cloud.callFunction({
      name: 'updateServiceProviderPassword',
      data: this.data.accountForm,
      success: (res) => {
        Dialog
          .alert({
            message: '修改成功！'
          })
          .then(() => {
            wx.navigateTo({
              url: '../serviceProviderAccount/index'
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