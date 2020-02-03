import Dialog from '/@vant/weapp/dialog/dialog';
const util = require('../../utils/index.js');
const ui = require('../../utils/ui.js');
const areaList = require('../../mockdata/area.js')
const db = wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    this.loadData()
  },
  onShow: function () {
    const page = getCurrentPages().pop()
    if (page.options.reload === 'Y') this.loadData()
  },

  loadData () {
    ui.showLoading()
    db.collection('serviceProviderAccount')
      .where({
        serviceProviderCode: app.globalData.userInfo.serviceProviderCode,
        isMainAccount: 'N'
      })
      .orderBy('lastUpdateTime', 'desc')
      .get({
        success: (res) => {
          this.setData({
            accountList: res.data
          })
        },
        fail: () => {
          console.log(222)
        },
        complete: () => {
          ui.hideLoading()
        }
      })
  },

  handleAdd () {
    wx.navigateTo({
      url: '../editServiceProviderAccount/index'
    })
  },

  handleModify({ target }) {
    wx.navigateTo({
      url: `../editServiceProviderAccount/index?account=${target.id}`
    })
  },


  handleDelete() {

  },

  handleDelete({ target }) {
    Dialog.confirm({
      message: '确认要删除该账户？'
    })
      .then(() => {
        ui.showLoading('删除中...')
        wx.cloud.callFunction({
          name: 'deleteServiceProviderAccount',
          data: {
            account: target.id
          },
          success: (res) => {
            Dialog.alert({
              message: '删除成功！'
            })
              .then(() => {
                this.loadData()
              })
          },
          fail: () => {
            Dialog.alert({
              message: '删除失败！'
            })
          },
          complete: () => { ui.hideLoading() }
        })
      })
  }
})