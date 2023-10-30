<template>
	<!-- 聊天界面展示https://www.bilibili.com/video/BV1hT4y1P75N?p=22  搭建1和2 -->
	<view class="content">
		<!-- 聊天内容 -->
		<scroll-view class="chat" scroll-y="true" scroll-with-animation="true" :scroll-into-view="scrollToView">
			<view class="chat-main" :style="{ paddingBottom: inputh + 'px' }">
				<view class="chat-ls" v-for="(item, index) in unshiftmsg" :key="index" :id="'msg' + index">
					<view class="chat-time" v-if="item.createTime != ''">{{ changeTime(item.createTime) }}</view>
					<view class="msg-m msg-left" v-if="item.sendName == friendName">
						<!-- <image class="user-img" src="../../../static/logo.png"></image> -->
						<view class="message" v-if="item.TextType == 0">
							<!-- 文字 -->
							<view class="msg-text">{{ item.sendText }}</view>
						</view>
						<view class="message" v-if="item.TextType == 1" @tap="previewImg(item.sendText)">
							<!-- 图像 -->
							<image :src="item.sendText" class="msg-img" mode="widthFix"></image>
						</view>
						<view class="message" v-if="item.TextType == 2" @tap="playVoice(item.sendText.voice)">
							<!-- 音频 -->
							<view class="msg-text voice" :style="{ width: item.sendText.time * 4 + 'rpx' }">
								<!-- <image src="../../../static/icon/Hotline.png" class="voice-img"></image> -->
								{{ item.sendText.time }}″
							</view>
						</view>
						<view class="message" v-if="item.TextType == 3" @tap="openLocation(item.sendText)">
							<!-- 位置 -->
							<view class="msg-map">
								<view class="map-name">{{ item.sendText.name }}</view>
								<view class="map-address">{{ item.sendText.address }}</view>
								<!-- 如果map不起作用，就可以直接用一张图片去替代 -->
								<map class="map" :longitude="item.sendText.longitude" :latitude="item.sendText.latitude" :markers="covers(item.sendText)"></map>
							</view>
						</view>
					</view>
					<view class="msg-m msg-right" v-if="item.sendName != friendName">
						<!-- <image class="user-img" src="../../../static/logo.png"></image> -->
						<view class="message" v-if="item.TextType == 0">
							<view class="msg-text">{{ item.sendText }}</view>
						</view>
						<view class="message" v-if="item.TextType == 1" @tap="previewImg(item.sendText)"><image :src="item.sendText" class="msg-img" mode="widthFix"></image></view>
						<view class="message" v-if="item.TextType == 2" @tap="playVoice(item.sendText.voice)">
							<!-- 音频 -->
							<view class="msg-text voice" :style="{ width: item.sendText.time * 4 + 'rpx' }">
								{{ item.sendText.time }}″
								<!-- <image src="../../../static/icon/Hotline.png" class="voice-img"></image> -->
							</view>
						</view>
						<view class="message" v-if="item.TextType == 3" @tap="openLocation(item.sendText)">
							<!-- 位置 -->
							<view class="msg-map">
								<view class="map-name">{{ item.sendText.name }}</view>
								<view class="map-address">{{ item.sendText.address }}</view>
								<map class="map" :longitude="item.sendText.longitude" :latitude="item.sendText.latitude" :markers="covers(item.sendText)"></map>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="submit">
			<view class="submit-chat">
				<view class="bt-img" @tap="records"><image :src="toc"></image></view>
				<!-- 文本框 -->
				<textarea auto-height="true" class="chat-send btn" :class="{ displaynone: isrecord }" @input="inputs" @focus="focus"></textarea>
				<view class="record btn" :class="{ displaynone: !isrecord }" @touchstart="touchstart" @touchend="touchend" @touchmove="touchmove">按住说话</view>
				<!-- <view class="bt-img" @tap="emoji"><image src="../../static/icon/commonproblem.png"></image></view> -->
				<!-- <view class="bt-img" @tap="more"><image src="../../static/icon/news.png"></image></view> -->
			</view>
			<!-- 表情 -->
			<view class="emoji" :class="{ displaynone: !isemoji }">
				<view class="emoji-send">
					<!-- <view class="emoji-send-det" @tap="emojiBack"><image src="../../static/icon/leftbrackets.png"></image></view> -->
					<view class="emoji-send-bt" @tap="emojiSend">发送</view>
				</view>
				<emoji @emotion="emotion" :height="260"></emoji>
			</view>
			<!-- 更多 -->
			<view class="more" :class="{ displaynone: !ismore }">
				<view class="more-list" @tap="sendImg('album')">
					<!-- <image src="../../static/icon/noreceive.png"></image> -->
					<view class="more-list-title">图片</view>
				</view>
				<view class="more-list" @tap="sendImg('camera')">
					<!-- <image src="../../static/icon/noreceive.png"></image> -->
					<view class="more-list-title">拍照</view>
				</view>
				<view class="more-list" @tap="choseLocation">
					<!-- <image src="../../static/icon/noreceive.png"></image> -->
					<view class="more-list-title">定位</view>
				</view>
				<view class="more-list">
					<!-- <image src="../../static/icon/noreceive.png"></image> -->
					<view class="more-list-title">视频</view>
				</view>
				<view class="more-list">
					<!-- <image src="../../static/icon/noreceive.png"></image> -->
					<view class="more-list-title">文件</view>
				</view>
			</view>
		</view>
		<view class="voice-bg" :class="{ displaynone: !voicebg }">
			<view class="voice-bg-len">
				<view class="voice-bg-time" :style="{ width: vlength / 0.6 + '%' }">{{ vlength }}″</view>
				<view class="voice-del">上滑取消录音</view>
			</view>
		</view>
	</view>
</template>

<script>
// import dateTime from '../../../common/dateTime.js';

//音频播放
const innerAudioContext = uni.createInnerAudioContext();

export default {
	data() {
		return {
			isrecord: false,
			isemoji: false,
			ismore: false,
			voicebg: false,
			pageY: 0,
			msg: '',
			// 直接引用地址可能出不来，需要用require
			// toc: require('../../static/icon/allorder.png'),
			timer: '', //计时器
			vlength: 0,
			friendName: 'xpq',
			msg: [
				{
					sendName: 'xpq',
					receviceName: '゛时光い',
					sendText: {
						address: '湖南省岳阳市湘阴县新世纪大道',
						latitude: 28.68925,
						longitude: 112.90917,
						name: '湘阴县政府(新世纪大道北)'
					},
					createTime: '2022-01-06 12:40:12',
					updateTime: null,
					chatmState: 1,
					TextType: 3
				},
				{
					sendName: '゛时光い',
					receviceName: 'xpq',
					sendText: {
						voice: '时光匆匆流过',
						time: 2 //秒
					},
					createTime: '2022-01-06 12:22:12',
					updateTime: null,
					chatmState: 1,
					TextType: 2
				},
				{
					sendName: 'xpq',
					receviceName: '゛时光い',
					sendText: {
						voice: '谢谢你',
						time: 60 //秒
					},
					createTime: '2022-01-06 12:00:12',
					updateTime: null,
					chatmState: 1,
					TextType: 2
				},
				{
					sendName: '゛时光い',
					receviceName: 'xpq',
					sendText: '这是第九条未读消息',
					createTime: '2022-01-03 12:22:12',
					updateTime: null,
					chatmState: 1,
					TextType: 0
				},
				{
					sendName: '゛时光い',
					receviceName: 'xpq',
					sendText: '这是第八条未读消息',
					createTime: '2022-01-02 12:22:07',
					updateTime: null,
					chatmState: 1,
					TextType: 0
				},
				{
					sendName: 'xpq',
					receviceName: 'xpq',
					sendText: '这是第七条未读消息',
					createTime: '2021-12-19 12:22:03',
					updateTime: null,
					chatmState: 1,
					TextType: 0
				},
				{
					sendName: '゛时光い',
					receviceName: 'xpq',
					sendText: '这是第六条未读消息',
					createTime: '2021-12-19 12:21:58',
					updateTime: null,
					chatmState: 1,
					TextType: 0
				},
				{
					sendName: '゛时光い',
					receviceName: 'xpq',
					sendText: 'http://demo.rageframe.com/attachment/images/2021/11/18/image_1637224530_diIlZlmm.jpeg',
					createTime: '2021-12-19 12:21:54',
					updateTime: null,
					chatmState: 1,
					TextType: 1
				},
				{
					sendName: 'xpq',
					receviceName: '゛时光い',
					sendText: 'http://demo2.rageframe.com/attachment/images/2021/09/01/image_1630483477_N03W37zs.jpg',
					createTime: '2021-12-19 12:21:48',
					updateTime: null,
					chatmState: 1,
					TextType: 1
				},
				{
					sendName: '゛时光い',
					receviceName: 'xpq',
					sendText: '这是第三条未读消息',
					createTime: '2021-12-19 12:21:42',
					updateTime: null,
					chatmState: 1,
					TextType: 0
				},
				{
					sendName: '゛时光い',
					receviceName: 'xpq',
					sendText: '这是第二条未读消息',
					createTime: '2021-12-19 12:21:33',
					updateTime: null,
					chatmState: 1,
					TextType: 0
				},
				{
					sendName: '゛时光い',
					receviceName: 'xpq',
					sendText: 'http://demo2.rageframe.com/attachment/images/2021/09/01/image_1630483477_N03W37zs.jpg',
					createTime: '2021-12-19 11:02:18',
					updateTime: null,
					chatmState: 1,
					TextType: 1
				},
				{
					sendName: '゛时光い',
					receviceName: 'xpq',
					sendText: '爱你啊',
					createTime: '2021-12-18 20:37:03',
					updateTime: null,
					chatmState: 0,
					TextType: 0
				}
			],
			// 反转数据接收
			unshiftmsg: [],
			imgMsg: [],
			scrollToView: '',
			oldTime: new Date(),
			inputh: '60'
		};
	},
	onShow() {
		// 数组倒叙 主要是应对后端传过来的数据
		for (var i = 0; i < this.msg.length; i++) {
			//时间间隔处理
			if (i < this.msg.length - 1) {
				//这里表示头部时间还是显示一下
				let t = '2018-8-8';
				if (t) {
					this.oldTime = t;
				}
				this.msg[i].createTime = t;
			}
			// 获取图片，为下面的预览做准备
			if (this.msg[i].TextType == 1) {
				this.imgMsg.unshift(this.msg[i].sendText);
			}
			this.unshiftmsg.unshift(this.msg[i]);
		}
		// 跳转到最后一条数据 与前面的:id进行对照
		this.$nextTick(function() {
			this.scrollToView = 'msg' + (this.unshiftmsg.length - 1);
		});
	},
	methods: {
		changeTime(date) {
			return '';
		},
		// 进行图片的预览
		previewImg(e) {
			let index = 0;
			for (let i = 0; i < this.imgMsg.length; i++) {
				if (this.imgMsg[i] == e) {
					index = i;
				}
			}
			console.log('index', index);
			// 预览图片
			uni.previewImage({
				current: index,
				urls: this.imgMsg,
				longPressActions: {
					itemList: ['发送给朋友', '保存图片', '收藏'],
					success: function(data) {
						console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					},
					fail: function(err) {
						console.log(err.errMsg);
					}
				}
			});
		},
		//音频播放
		playVoice(e) {
			innerAudioContext.src = e;
			innerAudioContext.onPlay(() => {
				console.log('开始播放');
			});
		},
		//地图定位
		covers(e) {
			let map = [
				{
					latitude: e.latitude,
					longitude: e.longitude,
					iconPath: '../../../static/logo.png'
				}
			];
			return map;
		},
		//跳转地图信息
		openLocation(e) {
			uni.openLocation({
				latitude: e.latitude,
				longitude: e.longitude,
				name: e.name,
				address: e.address,
				success: function() {
					console.log('success');
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
		//输入框高度
		heights(e) {
			console.log('高度:', e);
			this.inputh = e;
			this.goBottom();
		},
		// 滚动到底部
		goBottom() {
			this.scrollToView = '';
			this.$nextTick(function() {
				this.scrollToView = 'msg' + (this.unshiftmsg.length - 1);
			});
		}
	},
	//获取高度方法
	getElementHeight() {
		const query = uni.createSelectorQuery().in(this);
		query
			.select('.submit')
			.boundingClientRect(data => {
				this.$emit('heights', data.height);
			})
			.exec();
	},
	//切换音频
	records() {
		//切换的时候关闭其他界面
		this.ismore = false;
		this.isemoji = false;
		//切换高度
		setTimeout(() => {
			this.getElementHeight();
		}, 10);
		if (this.isrecord) {
			this.isrecord = false;
			// this.toc = require('../../static/icon/allorder.png');
		} else {
			this.isrecord = true;
			// this.toc = require('../../static/icon/wechat.png');
		}
	},
	// 表情
	emoji() {
		this.isemoji = !this.isemoji;
		//切换的时候关闭其功能
		this.ismore = false;
		this.isrecord = false;
		// this.toc = require('../../static/icon/allorder.png');
		//切换高度
		setTimeout(() => {
			this.getElementHeight();
		}, 10);
	},
	//接收表情
	emotion(e) {
		console.log(e), (this.msg = this.msg + e);
	},
	//文字发送
	inputs(e) {
		var chatm = e.detail.value;
		var pos = chatm.indexOf('\n');
		// 检索字符串没有数据，返回-1
		// if (pos != -1 && chatm.length > 1) {
		// this.$emit('inputs', this.msg);
		// setTimeout(() => {
		//  this.msg = '';
		// }, 0)
		// }

		if (pos != -1 && chatm.length > 1) {
			// 0为表情和文字
			this.send(this.msg, 0);
		}
	},
	// 输入框聚焦
	focus() {
		//关闭其他项
		this.isemoji = false;
		this.ismore = false;
		setTimeout(() => {
			this.getElementHeight();
		}, 10);
	},
	// 表情内发送
	emojiSend() {
		// if (this.msg.length > 0) {
		//  this.$emit('inputs', this.msg);
		//  setTimeout(() => {
		//      this.msg = '';
		//  }, 0)
		// }

		if (this.msg.length > 0) {
			//0为表情和文字
			this.send(this.msg, 0);
		}
	},
	// 表格退格
	emojiBack() {
		if (this.msg.length > 0) {
			this.msg = this.msg.substring(0, this.msg.length - 1);
		}
	},
	//更多功能
	more() {
		this.ismore = !this.ismore;
		//切换的时候关闭其他界面
		this.isemoji = false;
		this.isrecord = false;
		// this.toc = require('../../static/icon/allorder.png');
		setTimeout(() => {
			this.getElementHeight();
		}, 10);
	},
	//图片发送
	sendImg(e) {
		let count = 9;
		if (e == 'album') {
			count = 9;
		} else {
			count = 1;
		}
		uni.chooseImage({
			count: count, //默认9
			sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: [e], //从相册选择
			// success: function (res) { //用function的方式会找不到send方法
			success: res => {
				console.log(JSON.stringify(res.tempFilePaths));
				const filePaths = res.tempFilePaths;
				for (let i = 0; i < filePaths.length; i++) {
					this.send(filePaths[i], 1);
				}
			}
		});
	},
	//音频处理
	//开始录音
	touchstart(e) {
		console.log('开始录音');
		console.log('点击产生数据', e);
		this.pageY = e.changedTouches[0].pageY;
		this.voicebg = true;
		let i = 1;
		this.timer = setInterval(() => {
			this.vlength = i;
			i++;
			console.log('计时器开始工作,第几秒', i);
			//结束计时
			if (i > 60) {
				clearInterval(this.timer);
				this.touchend();
			}
		}, 1000);
		recorderManager.start();
	},
	//删除录音
	touchmove(e) {
		// console.log("滑动到的y轴高度：",e.changedTouches[0].pageY);
		if (this.pageY - e.changedTouches[0].pageY > 100) {
			// 关闭录音界面
			this.voicebg = false;
		}
	},
	// 结束录音
	touchend() {
		console.log('结束录音');
		clearInterval(this.timer);
		recorderManager.stop();
		// recorderManager.onStop(function(res) {
		recorderManager.onStop(res => {
			let data = {
				voice: res.tempFilePath,
				time: this.vlength
			};
			if (this.voicebg) {
				this.send(data, 2);
			}
			// //时长归位
			this.vlength = 0;
			this.voicebg = false;
			console.log('recorder stop' + JSON.stringify(res));
			// self.voicePath = res.tempFilePath;
		});
	},
	//获取位置
	choseLocation() {
		uni.chooseLocation({
			// success: function(res) {
			success: res => {
				let data = {
					name: res.name,
					address: res.address,
					latitude: res.latitude,
					longitude: res.longitude
				};
				this.send(data, 3);
				// console.log('位置名称：' + res.name);
				// console.log('详细地址：' + res.address);
				// console.log('纬度：' + res.latitude);
				// console.log('经度：' + res.longitude);
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
	}
};
</script>

<style lang="scss">
page {
	height: 100%;
}

.content {
	height: 100%;
	background-color: rgba(244, 244, 244, 1);
}

.chat {
	height: 100%;

	.chat-main {
		padding-left: 32rpx;
		padding-right: 32rpx;
		padding-top: 20rpx;
		// padding-bottom: 120rpx;  //获取动态高度
		display: flex;
		flex-direction: column;
	}

	.chat-ls {
		.chat-time {
			font-size: 24rpx;
			color: rgba(39, 40, 50, 0.3);
			line-height: 34rpx;
			padding: 10rpx 0rpx;
			text-align: center;
		}

		.msg-m {
			display: flex;
			padding: 20rpx 0;

			.user-img {
				flex: none;
				width: 80rpx;
				height: 80rpx;
				border-radius: 20rpx;
			}

			.message {
				flex: none;
				max-width: 480rpx;
			}

			.msg-text {
				font-size: 32rpx;
				color: rgba(39, 40, 50, 1);
				line-height: 44rpx;
				padding: 18rpx 24rpx;
			}

			.msg-img {
				max-width: 400rpx;
				border-radius: 20rpx;
			}

			.msg-map {
				background: #fff;
				width: 464rpx;
				height: 284rpx;
				overflow: hidden;

				.map-name {
					font-size: 32rpx;
					color: rgba(39, 40, 50, 1);
					line-height: 44rpx;
					padding: 18rpx 24rpx 0 24rpx;
					//下面四行是单行文字的样式
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}

				.map-address {
					font-size: 24rpx;
					color: rgba(39, 40, 50, 0.4);
					padding: 0 24rpx;
					//下面四行是单行文字的样式
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}

				.map {
					padding-top: 8rpx;
					width: 464rpx;
					height: 190rpx;
				}
			}

			.voice {
				// width: 200rpx;
				min-width: 100rpx;
				max-width: 400rpx;
			}

			.voice-img {
				width: 28rpx;
				height: 36rpx;
			}
		}

		.msg-left {
			flex-direction: row;

			.msg-text {
				margin-left: 16rpx;
				background-color: #fff;
				border-radius: 0rpx 20rpx 20rpx 20rpx;
			}

			.ms-img {
				margin-left: 16rpx;
			}

			.msh-map {
				margin-left: 16rpx;
				border-radius: 0rpx 20rpx 20rpx 20rpx;
			}

			.voice {
				text-align: right;
			}

			.voice-img {
				float: left;
				transform: rotate(180deg);
				width: 28rpx;
				height: 36rpx;
				padding-bottom: 4rpx;
			}
		}

		.msg-right {
			flex-direction: row-reverse;

			.msg-text {
				margin-right: 16rpx;
				background-color: rgba(255, 228, 49, 0.8);
				border-radius: 20rpx 0rpx 20rpx 20rpx;
			}

			.ms-img {
				margin-right: 16rpx;
			}

			.msh-map {
				margin-left: 16rpx;
				border-radius: 20rpx 0rpx 20rpx 20rpx;
			}

			.voice {
				text-align: left;
			}

			.voice-img {
				float: right;
				padding: 4rpx;
				width: 28rpx;
				height: 36rpx;
			}
		}
	}
}
</style>

<style lang="scss" scoped>
.submit {
	background: rgba(244, 244, 244, 0.96);
	border-top: 1px solid rgba(39, 40, 50, 0.1);
	width: 100%;
	position: fixed;
	bottom: 0;
	z-index: 100;
	// padding-bottom: var(--status-bar-height);
	padding-bottom: env(safe-area-inset-bottom);
}

.displaynone {
	display: none;
}

.submit-chat {
	width: 100%;
	display: flex;
	align-items: flex-end;
	box-sizing: border-box;
	padding: 14rpx 14rpx;

	image {
		width: 56rpx;
		height: 56rpx;
		margin: 0 10rpx;
		flex: auto;
	}

	.btn {
		flex: auto;
		background-color: #fff;
		border-radius: 10rpx;
		padding: 20rpx;
		max-height: 160rpx;
		margin: 0 10rpx;
	}

	.chat-send {
		line-height: 44rpx;
	}

	.record {
		line-height: 44rpx;
		text-align: center;
		font-size: 20rpx;
		color: rgba(39, 40, 50, 0.6);
	}
}

.emoji {
	width: 100%;
	height: 460rpx;
	background: rgba(236, 237, 238, 1);
	box-shadow: 0px 11rpx 0px 0px rgba(0, 0, 0, 0.1);

	.emoji-send {
		width: 280rpx;
		height: 104rpx;
		padding-top: 24rpx;
		background-color: rgba(236, 237, 238, 0.8);
		position: fixed;
		// bottom: 0;
		bottom: env(safe-area-inset-bottom);
		right: 0;
		display: flex;

		.emoji-send-bt {
			flex: 1;
			margin: 0 32rpx 0 20rpx;
			height: 80rpx;
			background: rgba(255, 228, 49, 1);
			font-size: 32rpx;
			text-align: center;
			line-height: 80rpx;
			border-radius: 12rpx;
		}

		.emoji-send-det {
			flex: 1;
			margin-left: 24rpx;
			height: 80rpx;
			background: #fff;
			font-size: 32rpx;
			text-align: center;
			line-height: 80rpx;
			border-radius: 12rpx;

			image {
				width: 42rpx;
				height: 32rpx;
			}
		}
	}
}

.more {
	width: 100%;
	height: 436rpx;
	background: rgba(236, 237, 238, 1);
	box-shadow: 0px 11rpx 0px 0px rgba(0, 0, 0, 0.1);
	bottom: env(safe-area-inset-bottom);
	padding: 8rpx 20rpx;
	box-sizing: border-box;

	.more-list {
		width: 25%;
		text-align: center;
		float: left;
		padding-top: 32rpx;

		image {
			width: 72rpx;
			height: 72rpx;
			padding: 24rpx;
			background: rgba(255, 255, 255, 1);
			border-radius: 24rpx;
		}

		.more-list-title {
			font-size: 24rpx;
			color: rgba(39, 40, 50, 0.5);
			line-height: 34rpx;
		}
	}
}

.voice-bg {
	height: 100%;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.3);
	position: fixed;
	top: 0;
	bottom: 0;
	z-index: 1001;

	.voice-bg-len {
		height: 84rpx;
		width: 600rpx;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 42rpx;
		text-align: center;
	}

	.voice-bg-time {
		display: inline-block;
		min-width: 120rpx;
		line-height: 84rpx;
		background-color: rgba(255, 228, 49, 1);
		border-radius: 42rpx;
	}

	.voice-del {
		position: absolute;
		bottom: -480rpx;
		width: 100%;
		text-align: center;
		color: #fff;
		font-size: 28rpx;
	}
}
</style>
