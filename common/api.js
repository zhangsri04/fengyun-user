import Request from '@/utils/requset.js'
let request = new Request().http

//全局定义请求头
export default {
	//用户注册
	useRegister: function(data) {
		return request({
			url: "/user-api/auth/logon", //请求头
			method: "POST", //请求方式
			data: data, //请求数据
			isKey: true
		})
	},

	//用户登入
	userLogin: function(data) {
		return request({
			url: "/user-api/auth/signin", //请求头
			method: "POST", //请求方式
			data: data, //请求数据
			hideLoading: true,
			isKey: true
		})
	},

	//退出登入
	logoutUser: function() {
		return request({
			url: "/user-api/user/logout",
			method: "POST",
		})
	},

	//获取历史房间
	getRoomList: function(data) {
		return request({
			url: "/user-api/room/getHistory",
			method: "POST",
			data: data,
		})
	},

	//加入房间
	joinRoom: function(data) {
		return request({
			url: "/user-api/room/join",
			method: "POST",
			data: data,
			hideLoading: true
		})
	},

	//获取用户信息
	getUseInfo: function() {
		return request({
			url: "/user-api/user/info",
			method: "GET",
		})
	},

	//编辑用户昵称
	editUserName(data) {
		return request({
			url: "/user-api/user/update",
			method: "POST",
			data: data,
		})
	},

	//编辑用户密码
	editUserPassword(data) {
		return request({
			url: "/user-api/user/updatePassword",
			method: "POST",
			data: data,
		})
	},
	//获取游戏列表
	getGameList: function() {
		return request({
			url: "/user-api/room/getGameList",
			method: "GET",
			hideLoading: true
		})
	},

	//客服发送消息
	sendMessage: function(data) {
		return request({
			url: "/user-api/message/send",
			method: "POST",
			data: data,
		})
	},

	//客服获取消息列表
	getMessageList: function(data) {
		return request({
			url: "/user-api/message/list",
			method: "POST",
			data: data,
		})
	},


	//获取游戏房间消息列表
	getRoomMessage: function(globalId) {
		return request({
			url: "/user-api/room/messageList?globalId=" + globalId,
			method: "GET",
		})
	},


	//获取游戏房间积分数据统计
	getStatistics: function(roomId, globalGameId) {
		return request({
			url: "/user-api/order/getData?roomId=" + roomId + '&globalGameId=' + globalGameId,
			method: "GET",
		})
	},

	//获取开奖结果
	getPrizeList: function(data) {
		return request({
			url: "/user-api/room/getOpenList?globalId=" + data.globalId + '&pageNo=' + data.pageNo +
				'&pageSize=' + data.pageSize,
			method: "GET",
			hideLoading: true
		})
	},

	//获取下注列表
	getBetList: function(data) {
		return request({
			url: "/user-api/room/orderList?globalId=" + data.globalId,
			method: "GET",
		})
	},


	//获取回水金额
	getRebateMoney(data) {
		return request({
			url: "/user-api/order/rebateMoney?globalId=" + data.globalId,
			method: "GET",
		})
	},

	//用户回水
	userRebate(data) {
		return request({
			url: "/user-api/order/rebate",
			method: "POST",
			data: {
				globalId: data.globalId
			}
		})
	},

	//获取游戏记录
	getGameRoduce: function(data) {
		return request({
			url: "/user-api/order/betList?globalId=" + data.globalId + '&pageNo=' + data.pageNo +
				'&pageSize=' + data.pageSize + '&roomId=' +
				data.roomId,
			method: "GET",
		})
	},

	//获取竞猜报表
	gettContestList(data) {
		return request({
			url: "/user-api/room/getGameOrderData?start=" + data.start + '&end=' + data.end,
			method: "GET",
		})
	},

	//获取交易数据
	gettTransactionList(data) {
		return request({
			url: "/user-api/order/transactionList?type=" + data.type + '&pageNo=' + data.pageNo +
				'&pageSize=' + data.pageSize + '&roomId=' + data.roomId + "&start=" + data.start + '&end=' +
				data.end,
			method: "GET",
		})
	}

}

/*
请求样式：
	自定义名字: function(data) {
		return request({
			url: "/banner", //请求头
			method: "GET", //请求方式
			data: data,	//请求数据
			token: token, // 可传 
			hideLoading: false, //加载样式
		})
	},
页面请求方法样式 1 在请求页面中调用
	1.先导入本页面
		import api from '@/common/api.js'
		
	2.在methods 中 调用：
		api.classifyLeft().then((res) => {
			console.log(res);
		})
页面请求方法样式 2 全局调用
	1. 在main.js 中引入api.js
		import api from '@/common/api.js'
		
		Vue.prototype.$api = api
		
	2. 在页面中调用
	//不传参数
		this.$api.classifyLeft().then((res) => {
			console.log(res);
		})
	//传参
		this.$api.classifyLeft({参数}).then((res) => {
			console.log(res);
		})
*/