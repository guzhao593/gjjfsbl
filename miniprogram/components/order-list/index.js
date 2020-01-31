// components/order-list/index.js
Component({
  options: {
    styleIsolation: 'shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
    orderList: {
      type: Array,
      value: [{}]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    routerToDetail: function ({ currentTarget, ...ret }) {
      wx.navigateTo({
        url: `../../pages/orderDetail/index?id=${currentTarget.id}`,
        success: (res) => {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { 
            ...this.properties.orderList.find(item => item.orderCode === currentTarget.id) 
          })
        }
      })
    }
  }
})
