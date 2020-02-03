// miniprogram/pages/adminAccount/index.js
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
  onLoad() {
    this.loadData()
  },
  onShow: function () {
    const page = getCurrentPages().pop()
    if (page.options.reload === 'Y') this.loadData()
  },

  loadData() {
    ui.showLoading()
    const queryParam = this.getQueryParam()
    db.collection('serviceNetworkAccount')
      .where({
        ...queryParam,
        isDelete: 'N'
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

  getQueryParam () {
    const role = app.globalData.role
    if (role === 'admin') {
      return {}
    }
    if (role === 'serviceProvider') {
      return {
        serviceProviderCode: app.globalData.userInfo.serviceProviderCode
      }
    }
  },

  viewAccount ({ currentTarget }) {
    wx.navigateTo({
      url: `../editServiceNetwork/index?id=${currentTarget.id}`,
      success: (res) => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          ...this.data.accountList.find(item => item.serviceNetworkCode === currentTarget.id)
        })
      }
    })
  },

  handleAdd() {
    wx.navigateTo({
      url: `../editServiceNetwork/index`,
      success: (res) => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {})
      }
    })
  }
})