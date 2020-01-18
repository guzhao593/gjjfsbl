Component({
	data: {
		active: 0,
		list: [
			{
        icon: 'phone-o',
        text: '预约中心',
        url: '/pages/appointment/index'
			},
			{
        icon: 'orders-o',
        text: '订单中心',
        url: '/pages/orderList/index'
			},
			{
        icon: 'friends-o',
        text: '个人中心',
        url: '/pages/user/index'
			}
		]
	},

	methods: {
		onChange(event) {
			this.setData({ active: event.detail });
			wx.switchTab({
				url: this.data.list[event.detail].url
			});
		},

		init() {
			const page = getCurrentPages().pop();
			this.setData({
				active: this.data.list.findIndex(item => item.url === `/${page.route}`)
			});
		}
	}
});
