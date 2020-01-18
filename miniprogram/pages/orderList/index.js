// miniprogram/pages/appointment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    hasMore: true,
    abuildingOrderList: [],
    orderList: [
      {
        orderId: 'gjj2020011800001',
        appointmentName: '蓝茂智',
        appointmentMobile: 18823282233,
        appointmentAddress: '广东省广州市白云区白云小区1栋1202号',
        appointmentDate: '2020-01-18 12:00:00',
        contractPictures: ['https://img.yzcdn.cn/public_files/2017/10/24/e5a5a02309a41f9f5def56684808d9ae.jpeg']
      },
      {
        orderId: 'gjj2020011800001',
        appointmentName: '蓝茂智',
        appointmentMobile: 18823282233,
        appointmentAddress: '广东省广州市白云区白云小区1栋1202号',
        appointmentDate: '2020-01-18 12:00:00',
        contractPictures: ['https://img.yzcdn.cn/public_files/2017/10/24/e5a5a02309a41f9f5def56684808d9ae.jpeg']
      },
      {
        orderId: 'gjj2020011800001',
        appointmentName: '蓝茂智',
        appointmentMobile: 18823282233,
        appointmentAddress: '广东省广州市白云区白云小区1栋1202号',
        appointmentDate: '2020-01-18 12:00:00',
        contractPictures: ['https://img.yzcdn.cn/public_files/2017/10/24/e5a5a02309a41f9f5def56684808d9ae.jpeg']
      },
      {
        orderId: 'gjj2020011800002',
        appointmentName: '蓝小智',
        appointmentMobile: 18823282233,
        appointmentAddress: '广东省广州市白云区白云小区1栋',
        appointmentDate: '2020-01-18 12:00:00',
        contractPictures: ['https://img.yzcdn.cn/public_files/2017/10/24/e5a5a02309a41f9f5def56684808d9ae.jpeg']
      }
    ]
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
  
  onChange: function () {
  },

  loadMoreListener: function () {
    const data = {
      curPage: 1,
      pageCount: 2
    }
    this.setData({
      hasMore: data.curPage < data.pageCount
    })
    setTimeout(() => {
     this.loadMoreCom.loadMoreComplete(data)
    }, 500)
  }
})