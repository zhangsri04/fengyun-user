import store from '@/store';
import operate from "common/operate.js"
class socket {
	constructor(options) {
		//地址
		// this.socketUrl = base.socketUrl;
		this.socketStart = false;
		this.monitorSocketError();
		this.monitorSocketClose();
		this.socketReceive();
	}

	init(socketUrl, callback) {
		var token = uni.getStorageSync('userInfo').token || ""
		socketUrl = operate.urlPrefix() + socketUrl
		if (socketUrl) {
			if (this.socketStart) {
				console.log('webSocket已经启动了');
			} else {
				uni.connectSocket({
					url: socketUrl,
					header: {
						'content-type': 'application/json',
						'token': token
					},
					method: 'POST',
					success: function(res) {
						console.log('WebSocket连接创建', res)
					},
					fail: function(res) {
						console.log('网络异常', JSON.stringify(res.errMsg))
					},
				});
				uni.onSocketOpen((res) => {
					console.log('webSocket已经启动了');
					this.socketStart = true;
					callback && callback();
					console.log('WebSocket连接已打开！');
				});
			}
		}
	}

	//Socket给服务器发送消息
	send(data, callback) {
		const _this = this;
		if (store.state.userInfo.uid) {
			data.userUid = store.state.userInfo.uid;
		}
		console.log(data);
		uni.sendSocketMessage({
			data: JSON.stringify(data),
			success: () => {
				callback && callback(true);
			},
			fail: () => {
				callback && callback(false);
			}
		});
	}

	//Socket接收服务器发送过来的消息
	socketReceive() {
		const _this = this;
		uni.onSocketMessage(function(res) {
			let data = JSON.parse(res.data);
			console.log('收到服务器内容：', data);
			_this.acceptMessage && _this.acceptMessage(data);
		});
	}

	//关闭Socket
	closeSocket() {
		uni.closeSocket();
		_this.socketStart = false;
	}

	//监听Socket关闭
	monitorSocketClose() {
		const _this = this;
		uni.onSocketClose(function(res) {
			console.log('WebSocket 已关闭！');
			_this.socketStart = false;
			setTimeout(function() {
				_this.init();
			}, 3000);
		});
	}

	//监听Socket错误
	monitorSocketError() {
		const _this = this;
		uni.onSocketError(function(res) {
			_this.socketStart = false;
			console.log('WebSocket连接打开失败，请检查！');
		});
	}

};
const mySocket = new socket();
export default mySocket;