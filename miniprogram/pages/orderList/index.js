// miniprogram/pages/appointment.js

const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    abuildingOrderList: [],
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData()
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

  loadData: function () {
    console.log(22222)
    db.collection('order').get({
      success: function (res) {
        console.log(res.data[0], 'res')
        delete res.data[0]._id
        db.collection('order')
          .add({
            data: res.data[0],
            success: function () {
              console.log('success')
            },
            fail: function () {
              console.log('fail')
            }
          })
      },
      fail: function () {
        console.log('error')
      }
    })
  },
  
  onChange: function () {
  },

  loadMoreListener: function () {
    const data = {
      curPage: 1,
      pageCount: 2
    }
    setTimeout(() => {
     this.loadMoreCom.loadMoreComplete(data)
    }, 500)
  }
})