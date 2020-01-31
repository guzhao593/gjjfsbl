// miniprogram/pages/orderDetail/index.js
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
      orderState: '',
    },
    isScanEnter: true,
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
    },
    buttonConfig: [],
    buttonLoading:{
      submit: false,
      cancel: false
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        isScanEnter: false
      })
    }
    app.globalData.role = 'serviceProvider'
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      this.setData({
        orderForm: this.data.isScanEnter ? this.data.orderForm : data,
        buttonConfig: [
          {
            show: this.data.isScanEnter,
            text: '提交预约',
            class: 'submit-button',
            formType: 'submit',
            type: 'primary',
            loading: 'submit'
          },
          {
            show: !this.data.isScanEnter && app.globalData.role === 'serviceProvider' && data.orderState === 'appointment',
            text: '接收订单',
            class: 'submit-button',
            formType: 'submit',
            type: 'primary',
            loading: 'submit'
          },
          {
            show: !this.data.isScanEnter && app.globalData.role === 'serviceProvider' && data.orderState === 'receipting',
            text: '开始施工',
            class: 'submit-button',
            formType: 'submit',
            type: 'primary',
            loading: 'submit'
          },
          {
            show: !this.data.isScanEnter && app.globalData.role === 'serviceProvider' && data.orderState === 'abuilding',
            text: '完成订单',
            class: 'submit-button',
            formType: 'submit',
            type: 'primary',
            loading: 'submit'
          },
          {
            show: !this.data.isScanEnter && app.globalData.role === 'serviceProvider' && data.orderState === 'appointment',
            text: '取消订单',
            class: 'cancel-button',
            formType: '',
            type: 'warn',
            loading: 'cancel',
            isCancel: true
          },
        ]
      })
    })
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
    this.setData({ isShowDatePopup: this.data.isScanEnter });
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
    this.setData({ isShowAreaPopup: this.data.isScanEnter  });
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

  addOrder: function () {
    const currentDate = new Date()
    const orderCode = `GJJ${util.genarateCode(currentDate)}`
    db.collection('order')
      .add({
        data: {
          ...this.data.orderForm,
          lastUpdateTime: currentDate.getTime(),
          createTime: currentDate.getTime(),
          orderCode,
          orderState: 'appointment'
        },
        success: function () {
          Dialog
            .alert({
              message: '预约成功！'
            })
            .then(() => {
              wx.reLaunch({
                url: '../orderList/index',
              })
            })
        },
        fail: function () {
          Dialog
            .alert({
              message: '预约失败， 请重新提交！'
            })
        },
        complete: () => {
          this.setData({
            'buttonLoading.submit': false
          })
        }
      })
  },

  updateOrder: function (state, done) {
    const stateMap = {
      appointment: {
        nextState: 'receipting',
        nextStateName: '提交'
      },
      receipting: {
        nextState: 'abuilding',
        nextStateName: '提交'
      },
      abuilding: {
        nextState: 'completed',
        nextStateName: '提交'
      },
      terminated: {
        nextState: 'terminated',
        nextStateName: '取消'
      },
    }
    const { orderState, ...ret } = this.data.orderForm;
    if (!orderState) {
      return wx.showToast({
        title: '订单数据有误，无法提交！',
        duration: 60000
      })
    }
    ui.showLoading(`${stateMap[state || orderState].nextStateName}中...`)
    console.log(stateMap[state || orderState].nextState, 'state')
    wx.cloud.callFunction({
      name: 'updateOrder',
      data: {
        orderForm: {
          ...ret,
          orderState: stateMap[state || orderState].nextState
        }
      },
      success: function (res) {
        Dialog
          .alert({
            message: stateMap[state || orderState].nextStateName + '成功！'
          })
          .then(() => {
            wx.reLaunch({
              url: '../orderList/index',
            })
          })
      },
      fail: function () {
        Dialog
          .alert({
            message: stateMap[state || orderState].nextStateName + '失败， 请重新提交！'
          })
      },
      complete: (res) => {
        this.setData({
          'buttonLoading.submit': false
        })
        ui.hideLoading()
      }
    })
  },
  
  cancelOrder: function ({ currentTarget }) {
    if (currentTarget.dataset.cancel) {
      Dialog.confirm({
        message: '确认要取消该订单？'
      })
        .then(() => {
          this.updateOrder('terminated')
        })
        .catch(() => {
          Dialog.close();
        });
    }
  },

  formSubmit: function (e) {
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
      this.setData({
        'buttonLoading.submit': true
      })
      this.data.isScanEnter ? this.addOrder() : this.updateOrder()
    }
  }
})