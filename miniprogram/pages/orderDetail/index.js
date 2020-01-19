// miniprogram/pages/orderDetail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderForm: {
      appointmentName: '',
      appointmentMobile: '',
      appointmentAddress: '',
      appointmentDate: '',
      detailsInfo: ''
    },
    rules: {
      appointmentName: {
        validator: function (value, cb) {
          value ? cb() : cb('请输入姓名')
        },
        errorMessage: ''
      },
      appointmentMobile: {
        validator: function (value, cb) {
          value ? cb() : cb('请输入手机号码')
        },
        errorMessage: ''
      },
      appointmentAddress: {
        validator: function (value, cb) {
          value ? cb() : cb('请输入地址')
        },
        errorMessage: ''
      },
      appointmentDate: {
        validator: function (value, cb) {
          value ? cb() : cb('请输入预约时间')
        },
        errorMessage: ''
      },
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onChange: function ({ target, detail }) {
    this.setData({
      [`orderForm.${target.id}`]: detail
    })
    this.data.rules[target.id] && 
    this.data.rules[target.id].validator(detail, (message) => {
      this.setData({
        [`rules.${target.id}.errorMessage`]: message || ''
      })
    })
  },

  formSubmit: function () {
    let valid = true
    Object.keys(this.data.rules).forEach(key => {
      this.data.rules[key].validator(this.data.orderForm[key], (message) => {
        if (message && valid) {
          valid = false
        }
        this.setData({
          [`rules.${key}.errorMessage`]: message || ''
        })
      })
    })
    if (valid) {
      console.log('输入成功')
    }
  }
})