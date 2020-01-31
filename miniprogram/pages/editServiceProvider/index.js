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
    form: {
      serviceProviderName: '',
      account: '',
      serviceProviderContactsName: '',
      password: '',
      serviceProviderMobile: '',
      serviceProviderArea: '',
      serviceProviderAreaTemp: '',
      serviceProviderAddress: '',
      serviceProviderStorePictures: [],
      isDelete: 'N'
    },
    isAdd: true,
    rules: {
      serviceProviderName: {
        validator: function (value, cb) {
          value ? cb() : cb('请输入名称')
        },
        errorMessage: ''
      },
      account: {
        validator: function (value, cb) {
          value ? cb() : cb('请输入账户')
        },
        errorMessage: ''
      },
      serviceProviderContactsName: {
        validator: function (value, cb) {
          value ? cb() : cb('请输入联系人姓名')
        },
        errorMessage: ''
      },
      password: {
        validator: function (value, cb) {
          value ? cb() : cb('请输入密码')
        },
        errorMessage: ''
      },
      serviceProviderMobile: {
        validator: function (value, cb) {
          value ? cb() : cb('请输入手机号码')
        },
        errorMessage: ''
      },
      serviceProviderAreaTemp: {
        validator: function (value, cb) {
          value ? cb() : cb('请选择代理区域')
        },
        errorMessage: ''
      },
      serviceProviderAddress: {
        validator: function (value, cb) {
          value ? cb() : cb('请选择地址')
        },
        errorMessage: ''
      },
    },
    isShowAreaPopup: false,
    buttonConfig: [],
    buttonLoading: {
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
        isAdd: false
      })
    }
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', async (data) => {
      if (!this.data.isAdd) {
        data = await this.getAccount(data.serviceProviderCode, data)
      }
      this.setData({
        form: this.data.isAdd ? this.data.form : data,
        buttonConfig: [
          {
            show: this.data.isAdd,
            text: '保存',
            class: 'submit-button',
            formType: 'submit',
            type: 'primary',
            loading: 'submit'
          },
          {
            show: !this.data.isAdd,
            text: '修改',
            class: 'submit-button',
            formType: 'submit',
            type: 'primary',
            loading: 'submit'
          },
          {
            show: !this.data.isAdd,
            text: '删除',
            class: 'cancel-button',
            formType: '',
            type: 'warn',
            loading: 'cancel',
            isDelete: true
          },
        ]
      })
    })
  },

  async getAccount (serviceProviderCode, data) {
    return await db.collection('serviceProviderAccount')
      .where({
        serviceProviderCode,
        isMainAccount: 'Y'
      })
      .get()
      .then(({ data: serviceProviderAccount }) => {
        return { ...data, account: serviceProviderAccount[0].account, password: serviceProviderAccount[0].password }
      })
  },

  onChange: function ({ target, detail }) {
    this.setData({
      [`form.${target.id}`]: detail
    })
    this.data.rules[target.id] &&
      this.data.rules[target.id].validator(detail, (message) => {
        this.setData({
          [`rules.${target.id}.errorMessage`]: message || ''
        })
      })
  },

  showAreaPopup: function () {
    this.setData({ isShowAreaPopup: true });
  },
  onCloseAreaPopup: function () {
    this.setData({ isShowAreaPopup: false });
  },
  onConfirmArea: function ({ target, detail }) {
    this.setData({
      'form.serviceProviderAreaTemp': detail.values.map(item => item.name).join(''),
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
          fileList: [res.fileID],
          success: data => {
            this.setData({
              'form.serviceProviderStorePictures': this.data.form.serviceProviderStorePictures.concat([{
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

  deletePictures({ target, detail }) {
    const serviceProviderStorePictures = this.data.form[target.id]
    serviceProviderStorePictures.splice(detail.index, 1)
    this.setData({
      [`form.${target.id}`]: serviceProviderStorePictures
    })
  },

  addOrder: function () {
    const currentDate = Date.now()
    const { account, password, ...ret } = this.data.form
    db.collection('serviceProvider')
      .count()
      .then((res) => {
        const serviceProviderCode = `000${res.total + 1}`.slice(-4)
        db.collection('serviceProvider')
          .add({
            data: {
              ...ret,
              serviceProviderCode,
              lastUpdateTime: currentDate,
              createTime: currentDate
            },
            success: () => {
              db.collection('serviceProviderAccount')
                .add({
                  data: {
                    account,
                    password,
                    serviceProviderCode,
                    isMainAccount: 'Y',
                    lastUpdateTime: currentDate,
                    createTime: currentDate
                  },
                  success: function () {
                    Dialog
                      .alert({
                        message: '保存成功！'
                      })
                      .then(() => {
                        wx.reLaunch({
                          url: '../serviceProvider/index',
                        })
                      })
                  },
                  fail: function () {
                    Dialog
                      .alert({
                        message: '该服务中心保存成功，但该服务中心账户保存失败， 请去修改该服务中心！'
                      })
                  },
                  complete: () => {
                    this.setData({
                      'buttonLoading.submit': false
                    })
                  }
                })
            },
            fail: function () {
              Dialog
                .alert({
                  message: '保存失败， 请重新提交！'
                })
            },
            complete: () => {
              this.setData({
                'buttonLoading.submit': false
              })
            }
          })
      })
  },

  updateOrder: function (isDelete) {
    const saveText = isDelete ? '删除' : '修改'
    ui.showLoading(`${saveText}中...`)
    wx.cloud.callFunction({
      name: 'updateServiceProvider',
      data: {
        form: {
          ...this.data.form,
          isDelete: isDelete ? 'Y' : 'N'
        }
      },
      success: function (res) {
        console.log(res, 'res')
        Dialog
          .alert({
            message: `${saveText}成功！`
          })
          .then(() => {
            wx.reLaunch({
              url: '../serviceProvider/index',
            })
          })
      },
      fail: function () {
        console.log('error')
        Dialog
          .alert({
            message: `${saveText}失败， 请重新提交！`
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

  deleteOrder: function ({ currentTarget }) {
    if (currentTarget.dataset.delete) {
      Dialog.confirm({
        message: '确认要删除该服务中心？'
      })
        .then(() => {
          this.updateOrder(true)
        })
        .catch(() => {
          Dialog.close();
        });
    }
  },

  formSubmit: function (e) {
    let valid = true
    Object.keys(this.data.rules).forEach(key => {
      this.data.rules[key].validator(this.data.form[key], (message) => {
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
      this.data.isAdd ? this.addOrder() : this.updateOrder()
    }
  }
})