// miniprogram/pages/appointment.js
const ui = require('../../utils/ui.js')
const db = wx.cloud.database()
const PAGE_SIZE = 10
const INIT_CONFIG = {
  orderList: [],
  pageIndex: 1,
  total: 0,
  isGet: false
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 'appointment',
    abuildingOrderList: [],
    orderConfig: {
      appointment: INIT_CONFIG,
      receipting: INIT_CONFIG,
      abuilding: INIT_CONFIG,
      completed: INIT_CONFIG,
      terminated: INIT_CONFIG
    },
    orderState: [
      'appointment',
      'receipting',
      'abuilding',
      'completed',
      'terminated'
    ],
    orderStateName: [
      '已预约',
      '接单中',
      '施工中',
      '已完成',
      '已终止'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData(true)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.loadMoreCom = this.selectComponent("#load-more"); 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().init();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadMoreCom.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getAllOrderStateTotal () {
    const fucArray = this.data.orderState.map(orderState => {
      return function () {
        return db.collection('order')
          .where({
            appointmentMobile: '18823287243',
            orderState
          }).count()
      }
    })
    return Promise.all(fucArray.map(func => func()))
  },

  loadData: async function (isGetTotal) {
    if (!this.data.orderConfig[this.data.active].isGet)(
      ui.showLoading('加载中...')
    )
    if (isGetTotal) {
      const totalArray = await this.getAllOrderStateTotal()
      this.data.orderState.forEach((key, index) => {
        this.setData({
          [`orderConfig.${this.data.orderState[index]}.total`]: totalArray[index].total
        })
      })
    }

    db.collection('order')
      .where({
        appointmentMobile: '18823287243',
        orderState: this.data.active
      })
      .skip((this.data.orderConfig[this.data.active].pageIndex - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .get({
        success: (res) => {
          this.setData({
            [`orderConfig.${this.data.active}.orderList`]: this.data.orderConfig[this.data.active].orderList.concat(res.data),
            [`orderConfig.${this.data.active}.isGet`]: true
          })
          ui.hideLoading()
          const data = {
            curPage: this.data.orderConfig[this.data.active].pageIndex,
            pageCount: Math.ceil(this.data.orderConfig[this.data.active].total / PAGE_SIZE)
          }
          this.loadMoreCom.loadMoreComplete(data)
        },
        fail: function () {
          ui.hideLoading()
        }
      })
  },
  
  onChange: function (e) {
    this.setData({
      active: e.detail.name
    })
    !this.data.orderConfig[this.data.active].isGet && this.loadData()
  },

  loadMoreListener: function (e) {
    this.setData({
      [`orderConfig.${this.data.active}.pageIndex`]: ++this.data.orderConfig[this.data.active].pageIndex
    })
    this.loadData()
  }
})