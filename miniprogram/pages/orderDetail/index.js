// miniprogram/pages/orderDetail/index.js
import Dialog from '/@vant/weapp/dialog/dialog';
const util = require('../../utils/index.js');
const ui = require('../../utils/ui.js');
const areaList = require('../../mockdata/area.js')
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaList: areaList.default,
    orderForm: {
      appointmentName: '',
      appointmentMobile: '',
      appointmentAddress: '',
      appointmentAddressTemp: '',
      appointmentAddressDetail: '',
      appointmentDate: '',
      appointmentDateTemp: '',
      detailsInfo: '',
      pictures: [],
      orderState: 'appointment'
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
      appointmentAddressTemp: {
        validator: function (value, cb) {
          value ? cb() : cb('请选择所在地区')
        },
        errorMessage: ''
      },
      appointmentAddressDetail: {
        validator: function (value, cb) {
          value ? cb() : cb('请选择详细地址')
        },
        errorMessage: ''
      },
      appointmentDateTemp: {
        validator: function (value, cb) {
          value ? cb() : cb('请选择预约时间')
        },
        errorMessage: ''
      },
    },
    isShowDatePopup: false,
    isShowAreaPopup: false,
    minDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`;
      } else if (type === 'hour') {
        return `${value}时`;
      } else if (type === 'minute') {
        return `${value}分`;
      }
      return value;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      this.setData({
        orderForm: data
      })
      console.log(this.data.orderForm, 'orderForm')
    })
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

  showDatePopup: function () {
    this.setData({ isShowDatePopup: true });
  },

  onCloseDatePopup: function () {
    this.setData({ isShowDatePopup: false });
  },
  onCancelDate: function ({ target, detail }) {
    this.onCloseDatePopup()
  },
  onConfirmDate: function ({ target, detail }) {
    this.setData({
      'orderForm.appointmentDateTemp': util.formatTime(new Date(detail))
    })
    this.onChange({ target, detail })
    this.onCloseDatePopup()
  },

  showAreaPopup: function () {
    this.setData({ isShowAreaPopup: true });
  },
  onCloseAreaPopup: function () {
    this.setData({ isShowAreaPopup: false });
  },
  onConfirmArea: function ({ target, detail }) {
    this.setData({
      'orderForm.appointmentAddressTemp': detail.values.map(item => item.name).join(''),
    })
    this.onChange({ target, detail: detail.values[2].code })
    this.onCloseAreaPopup()
  },
  onCancelArea: function ({ target, detail }) {
    this.onCloseAreaPopup()
  },

  afterRead(event) {
    const { file } = event.detail;
    const cloudPath = `${Date.now()}.png`;
    ui.showLoading('图片上传中...')
    wx.cloud.uploadFile({
      cloudPath,
      filePath: file.path,
      success: (res) => {
        wx.cloud.getTempFileURL({
          fileList: [ res.fileID ],
          success: data => {
            this.setData({ 
              'orderForm.pictures': this.data.orderForm.pictures.concat([{ 
                url: data.fileList[0].tempFileURL, 
                fileID: res.fileID
              }])
             })
          },
          fail: console.error,
          complete: () => {
            ui.hideLoading()
          }
        })
      },
      fail: function () {
        console.log('error')
      }
    });
  },

  deletePictures ({ target, detail }) {
    const pictures = this.data.orderForm[target.id]
    pictures.splice(detail.index, 1)
    this.setData({
      [`orderForm.${target.id}`]: pictures
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
      const orderCode = `GJJ${util.genarateCode(new Date(this.data.orderForm.appointmentDate))}`
      console.log(orderCode, 'orderCode')
      db.collection('order')
        .add({
          data: {
            ...this.data.orderForm,
            orderCode
          },
          success: function () {
            Dialog
              .alert({
                message: '预约成功！'
              })
              .then(() => {
                wx.switchTab({
                  url: '../orderList/index',
                })
              })
          }
        })
    }
  }
})