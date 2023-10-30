<template>
	<view class="wrap">
		<view class="navBarBox">
			<!-- 状态栏占位 -->
			<view class="statusBar" :style="{ paddingTop: statusBarHeight + 'px' }"></view>
			<!-- 真正的导航栏内容 -->
			<view class="navBar">
				<image @click="returnPage" class="fanhui" src="~@/static/images/fanhui.png" mode="scaleToFill"></image>
				<view class="navBar-name">在线客服</view>
			</view>
		</view>

		<!-- 聊天内容 -->
		<scroll-view :style="{ height: 'calc(100% - 150upx)' }" class="chat" scroll-y="true"
			scroll-with-animation="true" :scroll-into-view="scrollToView">
			<view class="chat-main" v-for="(item, index) in msgList" :key="index" :id="'msg' + index">
				<view class="chat-ls">
					<!-- <view class="chat-time">2032-20-20</view> -->
					<view v-if="item.senderId != userInfo.id" class="msg-m msg-left">
						<image class="user-img" :src="item.send.avatar"></image>
						<view class="message">
							<!-- 文字 -->
							<view v-if="item.content" class="msg-text">{{ item.content }}</view>
						</view>
						<view v-if="item.imgUrl" class="message" @tap="previewImg(item.imgUrl)">
							<!-- 图像 -->
							<image :src="item.imgUrl" class="msg-img" mode="widthFix" />
						</view>
					</view>
					<view v-else class="msg-m msg-right">
						<image class="user-img" :src="userInfo.avatar"></image>
						<view class="message">
							<view v-if="item.content" class="msg-text">{{ item.content }}</view>
						</view>
						<view v-if="item.imgUrl" class="message" @tap="previewImg(item.imgUrl)">
							<image :src="item.imgUrl" class="msg-img" mode="widthFix" />
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="submit">
			<view class="submit-chat">
				<view class="bt-img" @touchend="sendImg">
					<image src="~@/static/images/imgs.png"></image>
				</view>
				<!-- 文本框 -->
				<textarea height="true" class="chat-send btn" v-model="msg" @focus="focus"></textarea>
				<view class="bt-img" @tap="sendMessage('')">
					<image src="~@/static/images/send.png"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import operate from '@/common/operate.js';
	import moment from '../../utils/moment.min.js';
	import {
		WebSocket
	} from '../../sockjs/websocket-uni.js';
	import {
		Stomp
	} from '../../sockjs/stomp.js';

	var socketTask = null;

	export default {
		data() {
			return {
				statusBarHeight: 0, // 导航栏高度
				navBarHeight: 82 + 11,
				userInfo: '',
				roomInfo: '',
				msgList: [],
				scrollToView: '',
				inputh: '60',
				pageY: 0,
				msg: '',
				vlength: 0
			};
		},

		created() {
			//获取手机状态栏高度
			this.statusBarHeight = uni.getSystemInfoSync()['statusBarHeight'];

			if (typeof window === 'object') {
				window.WebSocket = uni.webSocketBackup;
			}

			//建立websock
			this.socketOpen();
		},

		onLoad() {
			this.requestUrl = operate.api();
			this.userInfo = uni.getStorageSync('userInfo');
			this.roomInfo = uni.getStorageSync('roomInfo');
			//获取消息
			this.getMsgList();
		},

		//页面卸载
		onUnload() {
			this.sockDisconnect();
		},

		methods: {
			//连接socket
			socketOpen() {
				let that = this;
				const {
					roomId,
					userInfo
				} = this;
				let useId = userInfo.id;
				const globalId = 1;
				let wsUri = 'ws://106.55.199.100:8000/user-api/ws-app';
				let token = userInfo.token || '';

				console.log('URL=' + wsUri);

				let headers = {
					token: token,
					userId: useId
				};
				socketTask = Stomp.client(wsUri);
				socketTask.connect(
					headers,
					function(frame) {
						console.log('连接成功');

						socketTask.subscribe('/private/' + useId, function(response) {
							let resData = JSON.parse(response.body);
							console.log('监听用户返回数据', resData);
							if (resData.code == 10202) {
								that.getMsgList();
							} else {
								that.$operate.toast({
									title: resData.message
								});
							}
						});
					}
				);
			},

			//断开sock连接
			sockDisconnect() {
				socketTask.disconnect(function() {
					console.log('断开连接');
				});
			},

			//获取消息列表
			getMsgList() {
				let data = {
					pageNo: 0,
					pageSize: 1000,
					roomId: this.roomInfo.roomId,
					userId: this.userInfo.id
				};
				this.$api.getMessageList(data).then(res => {
					const {
						code,
						data,
						message
					} = res;
					if (code === 10200) {
						this.msgList = data;

						if (this.msgList <= 0) return;
						this.$nextTick(function() {
							this.scrollToView = 'msg' + (this.msgList.length - 1);
						});
					} else {
						this.$operate.toast({
							title: message
						});
					}
				});
			},

			//发送消息
			sendMessage(imgUrl) {
				// if (this.msg === '' || this.imgUrl === '') {
				// 	this.$operate.toast({
				// 		title: '请输入消息内容'
				// 	});
				// 	return;
				// }

				let data = {
					content: this.msg,
					imgUrl,
					roomId: this.roomInfo.roomId,
					userId: this.userInfo.id
				};
				this.$api.sendMessage(data).then(res => {
					const {
						code,
						data,
						message
					} = res;
					if (code === 10200) {
						this.getMsgList();
						this.msg = '';
						this.$operate.toast({
							title: '已发送'
						});
					} else {
						this.$operate.toast({
							title: message
						});
					}
				});
			},

			changeInput(e) {
				this.msg = e.detail.value;
			},

			// 输入框聚焦
			focus() {},

			sendImg() {
				const that = this
				uni.chooseImage({
					count: 1, // 最多可以选择的图片张数，默认9
					sizeType: ['original', 'compressed'], //original 原图，compressed 压缩图，默认二者都有
					sourceType: ['album', 'camera'], //album 从相册选图，camera 使用相机，默认二者都有。如需直接开相机或直接选相册，请只使用一个选项
					success: function(res) {
						console.log('chooseImage-----》》》》》》》》', res);
						//判断图片格式
						let tempStr = res.tempFilePaths[0].split('.');
						let lowerStr = tempStr[1].toLowerCase();
						// if (lowerStr != 'png' && lowerStr !== 'jpg' && lowerStr !== 'jpeg') {
						// 	uni.showToast({
						// 		title: '请上传PNG、JPG、JPEG格式的图片',
						// 		icon: 'none',
						// 		duration: 3000
						// 	});
						// 	return;
						// }
						if (res.tempFiles[0]['size'] > 1 * 1024 * 1024) {
							uni.showToast({
								title: '图片大小不能超过1M',
								icon: 'none',
								duration: 3000
							});
							return;
						}
						that.uploadImg(res.tempFilePaths[0])

						// if (res.tempFiles[0]['size'] < 1 * 1024 * 1024) { //图片小于5M不压缩，大于5M压缩
						// 	that.uploadImg(res.tempFilePaths[0])
						// } else {
						// 	uni.compressImage({
						// 		src: res.tempFilePaths[0],
						// 		quality: 20,
						// 		success: res => {
						// 			console.log(res, '=========res');
						// 			that.uploadImg(res.tempFilePath)
						// 		},
						// 		fail: err => {
						// 			alert('压缩失败:', JSON.stringify(err))
						// 		}
						// 	})
						// }
					}
				});
			},

			//图片发送
			uploadImg(tempFilePath) {
				// alert(tempFilePath)
				const that = this
				uni.uploadFile({
					url: that.requestUrl + '/user-admin/upload/file',
					filePath: tempFilePath,
					name: 'file',
					success: res => {
						console.log(JSON.parse(res.data));

						let url = that.requestUrl + JSON.parse(res.data).data;
						that.sendMessage(url);
						// console.log('upload success', res.data);
					},
					fail: err => {
						uni.showToast({
							title: '上传图片大',
							icon: 'none',
							duration: 3000
						});
						console.log('upload fail', err);
					}
				});
			},

			//发送
			send(msg, type) {
				let date = {
					message: msg,
					type: type
				};
				this.$emit('inputs', date);
				setTimeout(() => {
					this.msg = '';
				}, 0);
			},

			// 进行图片的预览
			previewImg(imgUrl) {
				// 预览图片
				uni.previewImage({
					current: 0,
					urls: [imgUrl],
					longPressActions: {
						itemList: [],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},

			//接受输入内容
			inputs(e) {
				//时间间隔处理
				let data = {
					sendName: '゛时光い',
					receviceName: 'xpq',
					sendText: e.message,
					createTime: new Date(),
					updateTime: new Date(),
					chatmState: 1,
					TextType: e.type
				};
				// 发送给服务器消息
				// onSendWS(JSON.stringify(data));

				this.unshiftmsg.push(data);
				// 跳转到最后一条数据 与前面的:id进行对照
				this.$nextTick(function() {
					this.scrollToView = 'msg' + (this.unshiftmsg.length - 1);
				});
				if (e.type == 1) {
					this.imgMsg.push(e.message);
				}
				console.log(e);
			},
			returnPage() {
				//快捷指令面板判断
				if (this.isFast) {
					this.isFast = false;
				} else {
					// let canNavBack = getCurrentPages();
					// if (canNavBack && canNavBack.length > 1) {
					// 	uni.navigateBack();
					// } else {
					// 	history.back();
					// }
					this.$routr({
						url: '/pages/index/index',
						type: 'redirectTo',
						login: false
					});
				}
			},
			// 滚动到底部
			goBottom() {
				this.scrollToView = '';
				this.$nextTick(function() {
					this.scrollToView = 'msg' + (this.unshiftmsg.length - 1);
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		height: calc(100% - 44px);
		height: calc(100% - 44px - constant(safe-area-inset-top));
		height: calc(100% - 44px - env(safe-area-inset-top));
	}

	.navBarBox .statusBar {
		background-color: #5285a6;
	}

	.navBarBox .navBar {
		width: 100%;
		height: 100upx;
		padding: 3upx 30upx;
		padding-bottom: 8upx;
		display: flex;
		flex-direction: row;
		color: #fff;
		align-items: center;
		background-color: #5285a6;
	}

	.navBarBox .navBar .navBar-name {
		width: 95%;
		text-align: center;
		font-size: 32upx;
		color: #fff;
	}

	.navBarBox .navBar .fanhui {
		width: 30upx;
		height: 30upx;
		margin-right: 10upx;
	}

	.navBarBox .navBar .flow-info {
		width: 65%;
		height: 100%;
		display: flex;
		flex-flow: column;
		font-size: 28upx;
		position: relative;
		top: 15upx;
	}

	.navBarBox .navBar .flow-info text {
		display: inline-block;
		width: 50%;
		text-align: left;
	}

	.wrap {
		width: 100%;
		height: 100%;
	}

	.wrap .chat {
		height: 100%;
		// position: relative;
		// padding-bottom: env(safe-area-inset-bottom);
		// padding-bottom: constant(safe-area-inset-bottom);
		// padding-bottom: env(safe-area-inset-bottom);
		position: fiexd;
		z-index: 10;
	}

	.wrap .chat .chat-main {
		// height: 100%;
		// box-sizing: border-box;
		// padding-left: 32upx;
		// padding-right: 32upx;
		// padding-bottom: 120upx;
		// display: flex;
		// z-index: 100;
		// flex-direction: column;
		padding-left: 32rpx;
		padding-right: 32rpx;
		padding-top: 20rpx;
		padding-bottom: 120rpx; //获取动态高度
		display: flex;
		flex-direction: column;
	}

	.chat-main .last-chat-item {
		padding-bottom: 60upx;
	}


	.wrap .chat .chat-ls .chat-time {
		font-size: 24upx;
		color: rgba(39, 40, 50, 0.3);
		line-height: 34upx;
		padding: 10upx 0upx;
		text-align: center;
	}

	.wrap .chat .chat-ls .msg-m {
		display: flex;
		padding: 20upx 0;
	}

	.wrap .chat .chat-ls .msg-m .user-img {
		flex: none;
		width: 80upx;
		height: 80upx;
		border-radius: 20upx;
	}

	.wrap .chat .chat-ls .msg-m .message {
		flex: none;
		max-width: 480upx;
	}

	.wrap .chat .chat-ls .msg-m .msg-text {
		font-size: 32upx;
		color: #272832;
		line-height: 44upx;
		padding: 18upx 24upx;
	}

	.wrap .chat .chat-ls .msg-m .msg-img {
		max-width: 400upx;
		border-radius: 20upx;
		margin: 0 30upx;
	}

	.wrap .chat .chat-ls .msg-m .msg-map {
		background: #fff;
		width: 464upx;
		height: 284upx;
		overflow: hidden;
	}

	.wrap .chat .chat-ls .msg-m .msg-map .map-name {
		font-size: 32upx;
		color: #272832;
		line-height: 44upx;
		padding: 18upx 24upx 0 24upx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	.wrap .chat .chat-ls .msg-left {
		flex-direction: row;
	}

	.wrap .chat .chat-ls .msg-left .msg-text {
		margin-left: 16upx;
		background-color: #fff;
		border-radius: 0upx 20upx 20upx 20upx;
	}

	.wrap .chat .chat-ls .msg-left .ms-img {
		margin-left: 16upx;
	}

	.wrap .chat .chat-ls .msg-right {
		flex-direction: row-reverse;
	}

	.wrap .chat .chat-ls .msg-right .msg-text {
		margin-right: 16upx;
		background-color: #a2e575;
		border-radius: 20upx 0upx 20upx 20upx;
	}

	.wrap .chat .chat-ls .msg-right .ms-img {
		margin-right: 16upx;
	}

	.wrap .chat .chat-ls .msg-right .msh-map {
		margin-left: 16upx;
		border-radius: 20upx 0upx 20upx 20upx;
	}

	.wrap .chat .chat-ls .msg-right .voice {
		text-align: left;
	}

	.wrap .chat .chat-ls .msg-right .voice-img {
		float: right;
		padding: 4upx;
		width: 28upx;
		height: 36upx;
	}

	.wrap .submit {
		background: #fff;
		border-top: 1px solid rgba(39, 40, 50, 0.1);
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: 100;
		padding-bottom: 30upx;
	}

	.wrap .submit .displaynone {
		display: none;
	}

	.wrap .submit .submit-chat {
		width: 100%;
		display: flex;
		align-items: flex-end;
		box-sizing: border-box;
		padding: 14upx 14upx;
	}

	.wrap .submit .submit-chat image {
		width: 56upx;
		height: 56upx;
		margin: 0 10upx;
		flex: auto;
	}

	.wrap .submit .submit-chat .chat-send {
		width: 100%;
		height: 60upx;
		line-height: 60upx;
		border: 1upx solid #dcdcdc;
		background-color: #f4f4f4;
	}
</style>