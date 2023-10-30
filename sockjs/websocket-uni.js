(function() {

	uni.webSocketBackup = WebSocket;
	WebSocket = function(uri) {
		this.uri = uri;
		uni.connectSocket({
			url: uri
		});
		this.eventMap = {};
		var that = this;
		uni.onSocketOpen(function() {
			console.log('uni:: ws open');
			if (that.eventMap.hasOwnProperty('open')) {
				that.eventMap['open']();
			} else {
				that.onopen();
			}

		});
		uni.onSocketMessage(function(res) {
			if (that.eventMap.hasOwnProperty('message')) {
				that.eventMap['message'](res);
			} else {
				that.onmessage(res);
			}
		});
		uni.onSocketClose(function() {
			if (that.eventMap.hasOwnProperty('close')) {
				that.eventMap['close']();
			} else {
				if (typeof(that.onclose) == "function") {
					that.onclose();
				} else {
					uni.closeSocket({
						complete: (e) => {
							console.log(e);
						}
					})
				}
			}
		});
		uni.onSocketError(function(res) {
			if (that.eventMap.hasOwnProperty('error')) {
				that.eventMap['error'](res);
			} else {
				that.onerror(res);
			}
		});
	};

	var event = {};

	WebSocket.prototype = {
		addEventListener: function(event, callback) {
			this.eventMap[event] = callback;
		},
		onopen: function() {

		},
		onmessage: function(res) {
			console.log('default 实现:: ' + res)
		},
		onclose: function() {

		},
		onerror: function(res) {

		},
		send: function(data) {
			uni.sendSocketMessage({
				data: data
			});
		},
		close: function(data) {
			uni.closeSocket({
				complete: () => {
					if (typeof(data) === "function") {
						data();
					}
				}
			})
		}
	};

	if (typeof exports !== "undefined" && exports !== null) {
		exports.WebSocket = WebSocket;
	}

}).call(this);