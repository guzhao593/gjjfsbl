// 角色类型  客户：customer  网点： serviceNetwork  服务商： serviceProvider  管理员： amdin


App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'gjj-dev-9j42a',
      traceUser: true
    })
    this.globalData = {
      opendId: '',
      role: 'customer',
      token: ''
    }
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        this.globalData.openId = res.result.userInfo.openId
      }
    })
  }
})