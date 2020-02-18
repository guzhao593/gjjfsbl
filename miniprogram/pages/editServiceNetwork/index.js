// miniprogram/pages/orderDetail/index.js
import Dialog from '/@vant/weapp/dialog/dialog';
import drawQrcode from '../../utils/weapp.qrcode.js'
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
    showSaveSuccess: false,
    qrcodeUrl: '',
    areaList: areaList.default,
    form: {
      serviceNetworkName: '',
      account: '',
      serviceNetworkContactsName: '',
      password: '',
      serviceNetworkMobile: '',
      serviceNetworkArea: '',
      serviceNetworkAreaTemp: '',
      serviceNetworkAddress: '',
      serviceNetworkStorePictures: [],
      comissionType: '',
      comissionTypeText: '',
      commissionRate: '',
      fixedCommission: '',
      isDelete: 'N'
    },
    isAdd: true,
    rules: {
      serviceNetworkName: {
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
      serviceNetworkContactsName: {
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
      serviceNetworkMobile: {
        validator: function (value, cb) {
          if (!value) {
            cb('请输入手机号码')
          } else {
            /^\d{11}$/.test(value) ? cb() : cb('请输入正确的手机号码')
          }
        },
        errorMessage: ''
      },
      serviceNetworkAreaTemp: {
        validator: function (value, cb) {
          value ? cb() : cb('请选择所在地区')
        },
        errorMessage: ''
      },
      serviceNetworkAddress: {
        validator: function (value, cb) {
          value ? cb() : cb('请输入详细地址')
        },
        errorMessage: ''
      },
      comissionTypeText: {
        validator: function (value, cb) {
          value ? cb() : cb('请输入佣金类型')
        },
        errorMessage: ''
      },
      fixedCommission: {
        validator: (value, cb, form) => {
          if (form.comissionType != 0) return cb()
          value 
            ? /^[1-9]\d{0,8}$/.test(value) 
                ? cb() 
                : cb('请输入正整数，长度不能超过9位')
            : cb('请输入固定佣金')
        },
        errorMessage: ''
      },
      commissionRate: {
        validator: (value, cb, form) => {
          if (form.comissionType != 1) return cb()
          value 
            ? /^[1-9]\d{0,1}$/.test(value) 
              ? cb() 
              : cb('请输入1~99的正整数')
            : cb('请输入佣金比例')
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
    commissionTypeList: [ '固定佣金', '比例佣金' ],
    isShowComissionTypePopup: false
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
      this.setData({
        form: this.data.isAdd ? this.data.form : data,
        qrcodeUrl: this.data.isAdd 
          ? '' 
          : this.generateQrcodeUrl(data),
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
      this.draw()
    })
  },

  generateQrcodeUrl (data) {
    return `http://gjjfc666666.gz01.bdysite.com/gjjfsbl?serviceNetworkCode=${data.serviceNetworkCode}&serviceProviderCode=${data.serviceProviderCode}`
  },

  draw(canvasId) {
    drawQrcode({
      width: 160,
      height: 160,
      x: 20,
      y: 20,
      canvasId: canvasId || 'qrcode',
      typeNumber: 10,
      text: this.data.qrcodeUrl,
      image: {
        imageResource: '../../images/logo.png',
        dx: 70,
        dy: 70,
        dWidth: 60,
        dHeight: 60
      },
      callback(e) {
        console.log('e: ', e)
      }
    })
  },

  download({ target }) {
    // 导出图片
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 300,
      height: 300,
      destWidth: 300,
      destHeight: 300,
      canvasId: target.id || 'qrcode',
      success(res) {
        let tempFilePath = res.tempFilePath

        // 保存到相册
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (res) {
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  },

  showComissionTypePopup () {
    this.setData({
      isShowComissionTypePopup: true
    })
  },

  onCloseComissionTypePopup () {
    this.setData({
      isShowComissionTypePopup: false
    })
  },

  onComissionTypeCancel () {
    this.onCloseComissionTypePopup()
  },

  onComissionTypeConfirm (event) {
    const { picker, value, index } = event.detail
    this.setData({
      'form.comissionType': index,
      'form.comissionTypeText': value,
      'form.comissionRate': '',
      'form.fixedComission': '',
    })
    this.onCloseComissionTypePopup()
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
      }, this.data.form)
  },

  showAreaPopup: function () {
    this.setData({ isShowAreaPopup: true });
  },
  onCloseAreaPopup: function () {
    this.setData({ isShowAreaPopup: false });
  },
  onConfirmArea: function ({ target, detail }) {
    this.setData({
      'form.serviceNetworkAreaTemp': detail.values.map(item => item.name).join(''),
    })
    this.onChange({ target, detail: detail.values[2].code })
    this.onCloseAreaPopup()
    this.findServiceProvider(detail.values[2].code)
  },
  findServiceProvider (areaCode) {
    ui.showLoading('正在获取对应服务中心...')
    db.collection('serviceProvider')
      .where({
        serviceProviderArea: areaCode
      })
      .get()
      .then(res => {
        ui.hideLoading()
        if (!res.data.length) {
          return Dialog
            .alert({
              message: '当前地区没有服务中心！'
            })
        }
        this.setData({
          'form.serviceProviderCode': res.data[0].serviceProviderCode,
          'form.serviceProviderName': res.data[0].serviceProviderName,
          'form.serviceProviderMobile': res.data[0].serviceProviderMobile,
        })
      })
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
              'form.serviceNetworkStorePictures': this.data.form.serviceNetworkStorePictures.concat([{
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
    const serviceNetworkStorePictures = this.data.form[target.id]
    serviceNetworkStorePictures.splice(detail.index, 1)
    this.setData({
      [`form.${target.id}`]: serviceNetworkStorePictures
    })
  },

  confirmSaveSuccess: function () {
    wx.reLaunch({
      url: '../serviceNetwork/index',
    })
  },

  addOrder: function () {
    console.log('add, add')
    const currentDate = Date.now()
    db.collection('serviceNetworkAccount')
      .count()
      .then((res) => {
        const serviceNetworkCode = `000${res.total + 1}`.slice(-4)
        db.collection('serviceNetworkAccount')
          .add({
            data: {
              ...this.data.form,
              serviceNetworkCode,
              lastUpdateTime: currentDate,
              createTime: currentDate
            },
            success: () => {
              this.setData({
                qrcodeUrl: this.generateQrcodeUrl({ ...this.data.form, serviceNetworkCode })
              })
              this.draw('successQrcode')
              this.setData({
                showSaveSuccess: true
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
      name: 'updateServiceNetwork',
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
              url: '../serviceNetwork/index',
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
          console.log(message, 'message')
          valid = false
        }
        this.setData({
          [`rules.${key}.errorMessage`]: message || ''
        })
      }, this.data.form)
    })

    if (!this.data.form.serviceProviderCode) {
      return Dialog
        .alert({
          message: '所在地区没有代理商'
        })
    }
    console.log(valid, 'valid')
    
    if (valid) {
      console.log(valid, 'valid')
      this.setData({
        'buttonLoading.submit': true
      })
      this.data.isAdd ? this.addOrder() : this.updateOrder()
    }
  }
})