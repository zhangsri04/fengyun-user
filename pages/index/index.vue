<template>
	<view class="wrap">
		<view class="navBarBox">
			<!-- 状态栏占位 -->
			<view class="statusBar" :style="{ paddingTop: statusBarHeight + 'px' }"></view>
			<!-- 真正的导航栏内容 -->
			<view class="navBar">
				<image @click="returnPage" class="fanhui" src="~@/static/images/return.png" mode="scaleToFill" />
				<view class="navBar-name">游戏大厅</view>
			</view>
		</view>
		<view class="notice">
			<image src="~@/static/images/horn.png" alt="" />
			<view style="width: 100%;right: 25upx;position: relative;">
				<uni-notice-bar scrollable style="margin-bottom: 0;padding: 15upx;" background-color="" color="#fff"
					:speed="30" :text="roomAnnouncement" />
			</view>
		</view>
		<!-- 		<view class="scroll-area" style="height: 400px;overflow: hidden;">
			<view class="">
				<view v-for="n in 50" class="item">{{ n }}</view>
			</view>
		</view> -->
		<!-- <scroll-view scroll-y="true" show-scrollbar="true" class="game-list" @touchmove.stop> -->
		<view class="game-list">
			<view>
				<view class="item" v-for="(item, index) in gameList" @click="startGameBet(item)">
					<view class="item-t">
						<view class="game-img">
							<image lazy-load="true" mode="heightFix" :src="item.avatar"
								style="height: 88upx;width: 0;" />
							<!-- <image src="~@/static/images/game1s.png" style="width: 50%;height: 50%;margin-left: 10upx;" /> -->
							<view style="font-size: 36upx;color: #fff;font-weight: 500;margin-left: 10upx;">
								{{ item.label }}
							</view>
						</view>
						<view class="info">
							<view>第{{ item.currentNumber }}期</view>
							<view v-if="item.status == 3" style="color: #ee8735;font-weight: 500;">正在开奖</view>
							<view v-if="item.status == 4" style="color: #ee8735;font-weight: 500;">未开始</view>
							<view v-else-if="item.status == 2" style="color: #bd5655;">封盘中</view>
							<uni-countdown v-else-if="item.status == 1" :show-day="false" :font-size="20"
								style="margin-top: 15upx;" :hour="item.gameTime.hour" :minute="item.gameTime.minute"
								:second="item.gameTime.second" :color="item.color" background-color="#edeff2" />
						</view>
					</view>
					<view class="item-b">
						<view style="color: #fff;">{{ item.code }}期</view>
						<view class="number">
							<view v-for="val in item.codeArr" :class="'nub-bcg' + val">{{ val }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="menu-b">
			<view @click="customerService">
				<image class="ico" src="~@/static/images/menu-2.png" alt="" />
			</view>
			<view @click="walletCenter">
				<image class="ico" src="~@/static/images/menu-4.png" alt="" />
			</view>
			<view @click="gameIntroduce">
				<image class="ico" src="~@/static/images/menu-1.png" alt="" />
			</view>
			<view @click="clickIndividual">
				<image class="ico" src="~@/static/images/menu-3.png" alt="" />
			</view>
		</view>
	</view>
</template>

<script>
	import {
		WebSocket
	} from '../../sockjs/websocket-uni.js';
	import {
		Stomp
	} from '../../sockjs/stomp.js';
	import BScroll from '../../utils/core.js';
	var socketTask = null;
	var initTiem;
	var timerIds = new Map();
	var gameTimer = new Map();
	var scroll = null;
	export default {
		data() {
			return {
				statusBarHeight: 0, // 导航栏高度
				navBarHeight: 82 + 11,
				gameList: [],
				roomId: '', //房间id
				m: '',
				s: '',
				roomAnnouncement: '', //房间公告
				gameTime: []
			};
		},
		created() {
			//获取手机状态栏高度
			this.statusBarHeight = uni.getSystemInfoSync()['statusBarHeight'];

			if (typeof window === 'object') {
				window.WebSocket = uni.webSocketBackup;
			}

			//获取游戏列表
			this.getGameList();

			this.socketOpen();
		},

		onLoad(options) {
			this.roomAnnouncement = uni.getStorageSync('roomInfo').roomAnnouncement;
			this.roomId = options.roomId;

			// setTimeout(() => {
			// 	this.scroll = new IScroll('.scroll-area', {
			// 		mouseWheel: true // 允许鼠标滚轮
			// 	});
			// });

			// setTimeout(() => {
			// 	scroll = new IScroll('.game-list', {
			// 		mouseWheel: true // 允许鼠标滚轮
			// 	});
			// }, 1000);
		},

		//页面卸载
		onUnload() {
			//断开链接
			this.sockDisconnect();
		},

		methods: {
			//连接socket
			socketOpen() {
				let that = this;
				const {
					roomId,
					gameList
				} = this;
				let wsUri = 'ws://106.55.199.100:8000/user-api/ws-app';
				let userInfo = uni.getStorageSync('userInfo');
				let token = userInfo.token || '';
				let userId = userInfo.id;
				let headers = {
					token: token,
					userId: userId
				};
				socketTask = Stomp.client(wsUri);
				socketTask.connect(
					headers,
					function(frame) {
						console.log('连接成功');
						socketTask.subscribe('/game', function(response) {
							let resData = JSON.parse(response.body);
							let gameEndTime = resData.end;
							// console.log('监听游戏返回数据' + resData.globalId, resData);
							that.gameList = that.gameList.map((item, index) => {
								let game = item;
								let hour = parseInt((gameEndTime / 60 / 60) % 24);
								let minute = parseInt((gameEndTime / 60) % 60);
								let second = parseInt(gameEndTime % 60);

								if (game.globalId == resData.globalId) {
									game.status = resData.status;
									game.currentNumber = resData.currentNumber;

									let codeArr = resData.lastCode ? resData.lastCode.split(',') : [];
									codeArr.forEach((item, index) => {
										codeArr[index] = Number(item);
									});

									game.codeArr = codeArr.length > 0 ? codeArr : game.codeArr;
									game.code = resData.lastNumber ? String(resData.lastNumber).substr(
										-3) : game.code;
									game.gameTime = {
										hour,
										minute,
										second
									};
									// console.log(item.label, gameEndTime);
									if (gameEndTime <= 10) {
										game.color = '#c00';
									} else {
										game.color = '#808080';
									}
								}
								return {
									...game
								};
							});
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

			//获取游戏列表
			getGameList(globalId) {
				uni.showLoading({
					title: '加载中'
				});
				const that = this;
				this.$api.getGameList().then(res => {
					uni.hideLoading();

					const {
						code,
						data,
						message
					} = res;
					if (code === 10200) {
						let arr = [];
						let flag = false;
						let gameArr = this.gameList;
						let list = data.map((item, index) => {
							arr.push({
								endTime: item.closeTime,
								forbidTime: item.closeDuration,
								settleTime: item.settleDuration
							});

							let codeArr = item.code ? item.code.split(',') : [];
							codeArr.forEach((item, index) => {
								codeArr[index] = Number(item);
							});

							let gameEndTime = item.end;
							let hour = parseInt((gameEndTime / 60 / 60) % 24);
							let minute = parseInt((gameEndTime / 60) % 60);
							let second = parseInt(gameEndTime % 60);

							return {
								...item,
								code: item.number ? String(item.number).substr(-3) : '',
								codeArr: codeArr,
								color: '#808080',
								gameTime: {
									hour,
									minute,
									second
								}
							};
						});

						this.gameList = list;
						//缓存游戏列表
						uni.setStorageSync('gameList', this.gameList);

						setTimeout(() => {
							let wrapper = document.querySelector('.game-list');
							let scroll = new BScroll(wrapper, {
								click: true,
								tap: true
							});
						});
					} else {
						this.$operate.toast({
							title: message
						});
					}
				});
			},

			//开启游戏倒计时
			updatetTime(item) {
				const that = this;
				const cutoffTime = (item.closeDuration + item.settleDuration) * 1000;
				const startTime = item.settleDuration * 1000;
				let time = gameTimer.has(item.globalId) ? gameTimer.get(item.globalId) : cutoffTime; //开奖时间  + 封盘时间

				const now = new Date();
				const timeDifference = new Date(item.closeTime).getTime() - now.getTime() - cutoffTime;

				if (timerIds.has(item.globalId)) {
					for (let i = 1; i <= timerIds.get(item.globalId); i++) {
						clearTimeout(i);
					}
					// clearTimeout(timerIds.get(item.globalId));
					timerIds.delete(item.globalId);
				}

				if (timeDifference < 0) {
					// console.log(item.label + '---------', time);
					if (time <= 0) {
						// console.log(item.label + '------游戏结束' + time);
						const timerId = setTimeout(async () => {
							let gameTime = '1';
							if (item.gameTime != '1') {
								that.gameList = that.gameList.map((game, index) => {
									return {
										...game,
										gameTime: game.globalId == item.globalId ? gameTime : game
											.gameTime
									};
								});
							}

							timerIds.set(item.globalId, timerId);
							gameTimer.set(item.globalId, time);

							that.getGameList();
						}, 1000);
					} else {
						let gameTime = '';
						if (time <= cutoffTime && time > startTime) {
							// console.log(item.label + '------封盘中');
							gameTime = '2';
						}
						if (time <= startTime && time > 0) {
							// console.log(item.label + '------开奖中');
							gameTime = '1';
						}

						that.gameList = that.gameList.map((game, index) => {
							return {
								...game,
								gameTime: game.globalId == item.globalId ? gameTime : game.gameTime
							};
						});
						const timerId = setTimeout(() => {
							if (time > 0) time -= 1000;

							// console.log(timerIds.get(item.globalId));
							timerIds.set(item.globalId, timerId);
							gameTimer.set(item.globalId, time);
							that.updatetTime(item);
						}, 1000);
					}
				} else {
					let min = Math.floor(timeDifference / 60000);
					let sec = Math.floor((timeDifference % 60000) / 1000);
					let minutes = min < 10 ? '0' + min : min;
					let seconds = sec < 10 ? '0' + sec : sec;

					const gameTime = `${minutes}${seconds}`;
					that.gameList = that.gameList.map((game, index) => {
						return {
							...game,
							gameTime: game.globalId == item.globalId ? gameTime : game.gameTime
						};
					});

					const timerId = setTimeout(() => {
						that.updatetTime(item);
					}, 1000);

					timerIds.set(item.globalId, timerId);
					gameTimer.set(item.globalId, cutoffTime);
				}
			},

			returnPage() {
				uni.showModal({
					title: '游戏提示',
					content: '您确定要退出游戏吗?',
					showCancel: true,
					cancelText: '取消',
					cancelColor: '#000000',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.$routr({
								url: '/pages/home/home',
								type: 'redirectTo',
								login: true
							});

							//关闭背景音乐
							getApp().bgmMusic.stop();
							getApp().bgmMusic.onStop(() => {
								console.log('背景音乐停止了');
							});
						} else if (res.cancel) {
							// console.log('用户点击取消');
						}
					}
				});
			},

			startGameBet(item) {
				//缓存游戏数据
				uni.setStorageSync('gameInfo', item);

				this.$routr({
					url: '/pages/gameBet/gameBet',
					type: 'redirectTo',
					login: false
				});
			},

			customerService() {
				this.$routr({
					url: '/pages/customerService/customerService',
					type: 'redirectTo',
					login: false
				});
			},

			walletCenter() {
				this.$routr({
					url: '/pages/walletCenter/walletCenter',
					type: 'navigateTo',
					login: false
				});
			},

			gameIntroduce() {
				this.$routr({
					url: '/pages/gameIntroduce/gameIntroduce',
					type: 'navigateTo',
					login: false
				});
			},

			clickIndividual() {
				this.$routr({
					url: '/pages/individual/individual',
					type: 'navigateTo',
					login: false
				});
			}
		}
	};
</script>

<style>
	.wrap {
		width: 100%;
		height: 100vh;
		background: url('~@/static/images/ftLoginBg.png');
		background-size: 100% 100%;
		overflow: hidden;
	}

	.navBarBox {}

	.navBarBox .statusBar {}

	.navBarBox .navBar {
		width: 120%;
		height: 150upx;
		line-height: 150upx;
		border: 1upx solid rgba(132, 145, 148, 1);
		border-top: 0;
		padding: 3upx 50upx;
		padding-bottom: 8upx;
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: center;
		position: relative;
		left: -10%;
		top: 0;
		border-radius: 0 0 50% 50%;
	}

	.navBarBox .navBar .fanhui {
		width: 60upx;
		height: 60upx;
		margin-right: 10upx;
		margin-left: 60upx;
	}

	.navBarBox .navBar .navBar-name {
		width: 65%;
		text-align: center;
		font-size: 32upx;
		color: #fff;
	}

	.wrap .head-top {
		width: 120%;
		height: 150upx;
		line-height: 150upx;
		font-size: 38upx;
		font-weight: 500;
		color: #fff;
		display: flex;
		justify-content: start;
		align-items: center;
		text-align: center;
		background-color: rgb(98, 107, 110, 0.6);
		border: 1upx solid rgba(132, 145, 148, 1);
		position: relative;
		left: -10%;
		top: 0;
		border-radius: 0 0 50% 50%;
	}

	.wrap .head-top .return {
		width: 60upx;
		height: 60upx;
		margin-left: 110upx;
	}

	.wrap .notice {
		display: flex;
		justify-content: start;
		align-items: center;
		width: 88%;
		height: 70upx;
		line-height: 70upx;
		background-color: rgba(132, 145, 148, 1);
		margin: 30upx auto;
		border-radius: 50upx;
		font-size: 32upx;
		color: #fff;
	}

	.wrap .notice>image {
		width: 45upx;
		height: 45upx;
		margin: 0 30upx;
	}

	.wrap .game-list {
		width: 100%;
		height: 60vh;
		overflow: hidden;
		/* padding-bottom: 30upx; */
		box-sizing: border-box;
	}

	.wrap .game-list .item {
		width: 90%;
		height: 230upx;
		background: url('~@/static/images/gameby.png');
		background-size: 100% 100%;
		margin: 0 auto;
		border-radius: 20upx;
		padding: 35upx 30upx;
		box-sizing: border-box;
		position: relative;
		margin-bottom: 15upx;
	}

	.wrap .game-list .item .item-t {
		display: flex;
		justify-content: space-between;
		align-content: center;
	}

	.wrap .game-list .item .item-t .game-img {
		width: 60%;
		display: flex;
		justify-content: start;
		align-items: center;
	}

	.wrap .game-list .item .item-t .info {
		text-align: center;
		color: #fff;
	}

	.wrap .game-list .item .item-t .info .time {
		width: 200upx;
		line-height: 70upx;
		display: flex;
		justify-content: start;
		align-items: center;
		margin-left: 30upx;
	}

	.wrap .game-list .item .item-t .info .time>view {
		width: 35upx;
		height: 45upx;
		text-align: center;
		line-height: 45upx;
		font-size: 32upx;
		color: #808080;
		background-color: #edeff2;
		box-sizing: border-box;
		border-radius: 10upx;
		margin-right: 10upx;
	}

	.wrap .game-list .item .item-b {
		width: 92%;
		display: flex;
		justify-content: space-around;
		position: absolute;
		bottom: 15upx;
	}

	.wrap .game-list .item .item-b .number {
		width: 80%;
		display: flex;
		justify-content: space-between;
	}

	.wrap .game-list .item .item-b .number>view {
		display: inline-block;
		width: 40upx;
		height: 40upx;
		line-height: 40upx;
		text-align: center;
		color: #f7f7f7;
		text-shadow: 1upx 1upx 1upx #000;
		border-radius: 3upx;
		font-size: 30upx;
		font-weight: 500;
	}

	.nub-bcg1 {
		background-color: #fff90a;
	}

	.nub-bcg2 {
		background-color: #118af5;
	}

	.nub-bcg3 {
		background-color: #4b4b4b;
	}

	.nub-bcg4 {
		background-color: #ff9006;
	}

	.nub-bcg5 {
		background-color: #81fefe;
	}

	.nub-bcg6 {
		background-color: #5001fe;
	}

	.nub-bcg7 {
		background-color: #e3e3e3;
	}

	.nub-bcg8 {
		background-color: #fc0203;
	}

	.nub-bcg9 {
		background-color: #760001;
	}

	.nub-bcg10 {
		background-color: #23c303;
	}

	.wrap .menu-b {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: fixed;
		bottom: 0;
		padding: 30upx 80upx;
		box-sizing: border-box;
	}

	.wrap .menu-b .ico {
		width: 120upx;
		height: 120upx;
	}
</style>