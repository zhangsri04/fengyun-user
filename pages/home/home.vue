<template>
	<view class="wrap">
		<view class="navBarBox">
			<!-- 状态栏占位 -->
			<view class="statusBar" :style="{ paddingTop: statusBarHeight + 'px' }"></view>
			<!-- 真正的导航栏内容 -->
			<view class="head-top">
				<!-- 状态栏占位 -->
				<view style="width: 100vw;display: flex;justify-content: space-between;margin-left: 10%;">
					<view class="l">
						<image :src="userInfo.avatar" alt="" />
						<view>
							<view>{{ userInfo.loginName }}</view>
							<view>账号: {{ userInfo.membershipNumber }}</view>
						</view>
					</view>
					<view class="r">
						<view class="opt-btn" style="background-color: #febf37;" @click="clickIndividual">个人设置</view>
						<view class="opt-btn" style="background-color: #1eabff;" @click="emptyLogin">安全退出</view>
					</view>
				</view>
			</view>
		</view>

		<view class="type-btn">
			<view class="code" style="background-color: #6292ce;">房间号码</view>
			<view class="code">推荐号码</view>
		</view>
		<view class="code-box">
			<!-- <input class="ipt" type="text" v-model="NUM" @focus="show = true" onfocus="this.blur()" /> -->
			<view class="ipt" type="number">{{ result[0] }}</view>
			<view class="ipt" type="number">{{ result[1] }}</view>
			<view class="ipt" type="number">{{ result[2] }}</view>
			<view class="ipt" type="number">{{ result[3] }}</view>
			<view class="ipt" type="number">{{ result[4] }}</view>
			<view class="ipt" type="number">{{ result[5] }}</view>
		</view>
		<view class="enter" @click="joinRoom()">进入房间</view>
		<view class="list">
			<view class="hint">历史房间</view>
			<view class="box">
				<view class="item" v-for="(item, index) in roomList" @click="clickRoom(item.roomNumber)">
					<image :src="item.avatar" alt="" />
					<view>{{ item.roomNumber }}</view>
				</view>
			</view>
		</view>

		<!-- jianpan -->
		<view class="keyboard-wrapper">
			<view class="keyboard" v-if="show">
				<view class="num">
					<table>
						<tr>
							<td @click="change(1)" :class="[active === 1 ? 'active' : '']" @touchstart="msDown(1)"
								@touchend="msUp(1)">1</td>
							<td @click="change(2)" :class="[active === 2 ? 'active' : '']" @touchstart="msDown(2)"
								@touchend="msUp(2)">2</td>
							<td @click="change(3)" :class="[active === 3 ? 'active' : '']" @touchstart="msDown(3)"
								@touchend="msUp(3)">3</td>
							<td :class="[active === 'del' ? 'active' : '']" @touchstart="msDown('del')"
								@touchend="msUp('del')" rowspan="2" class="del" @click="del">×</td>
						</tr>
						<tr>
							<td @click="change(4)" :class="[active === 4 ? 'active' : '']" @touchstart="msDown(4)"
								@touchend="msUp(4)">4</td>
							<td @click="change(5)" :class="[active === 5 ? 'active' : '']" @touchstart="msDown(5)"
								@touchend="msUp(5)">5</td>
							<td @click="change(6)" :class="[active === 6 ? 'active' : '']" @touchstart="msDown(6)"
								@touchend="msUp(6)">6</td>
						</tr>
						<tr>
							<td @click="change(7)" :class="[active === 7 ? 'active' : '']" @touchstart="msDown(7)"
								@touchend="msUp(7)">7</td>
							<td @click="change(8)" :class="[active === 8 ? 'active' : '']" @touchstart="msDown(8)"
								@touchend="msUp(8)">8</td>
							<td @click="change(9)" :class="[active === 9 ? 'active' : '']" @touchstart="msDown(9)"
								@touchend="msUp(9)">9</td>
							<td :class="['comfirm', active === 'cfg' ? 'active-c' : '']" @touchstart="msDown('cfg')"
								@touchend="msUp('cfg')" rowspan="2" @click="comfirm">确定</td>
						</tr>
						<tr>
							<td colspan="3" @click="change(0)" :class="[active === 0 ? 'active' : '']"
								@touchstart="msDown(0)" @touchend="msUp(0)">0</td>
							<!-- 							<td colspan="1" @click="change('.')" :class="[active === '.' ? 'active' : '']"
								@touchstart="msDown('.')" @touchend="msUp('.')">
								.
							</td> -->
						</tr>
					</table>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';

	export default {
		data() {
			return {
				// 导航栏高度
				statusBarHeight: 0,
				navBarHeight: 82 + 11,
				active: null,
				show: true,
				active: '',
				NUM: '',
				result: [],
				roomList: [],
				userInfo: {}
			};
		},

		created() {
			//获取手机状态栏高度
			this.statusBarHeight = uni.getSystemInfoSync()['statusBarHeight'];

			//获取历史房间
			this.getRoomList();
			//获取用户
			this.getUserInfo();

			// window.onload = function() {
			// 	// 阻止双击放大
			// 	var lastTouchEnd = 0;
			// 	document.addEventListener('touchstart', function(event) {
			// 		if (event.touches.length > 1) {
			// 			event.preventDefault();
			// 		}
			// 	});
			// 	document.addEventListener(
			// 		'touchend',
			// 		function(event) {
			// 			var now = new Date().getTime();
			// 			if (now - lastTouchEnd <= 300) {
			// 				event.preventDefault();
			// 			}
			// 			lastTouchEnd = now;
			// 		},
			// 		false
			// 	);

			// 	// 阻止双指放大
			// 	document.addEventListener('gesturestart', function(event) {
			// 		event.preventDefault();
			// 	});
			// };
		},

		methods: {
			...mapMutations(['emptyUserInfo']),

			//获取用户信息
			getUserInfo() {
				this.$api.getUseInfo().then(res => {
					const {
						code,
						data,
						message
					} = res;
					if (code === 10200) {
						this.userInfo = data;
					} else {
						this.$operate.toast({
							title: message
						});
					}
				});
			},

			//获取历史房间
			getRoomList: function() {
				this.$api.getRoomList().then(res => {
					const {
						code,
						data,
						message
					} = res;
					if (code === 10200) {
						this.roomList = data;
					} else {
						this.$operate.toast({
							title: message
						});
					}
				});
			},

			//加入房间
			joinRoom() {
				const that = this;
				if (this.NUM === '') {
					this.$operate.toast({
						title: '请输入完整房间号'
					});
					return;
				}
				let data = {
					roomNumber: this.NUM
				};

				uni.showLoading({
					title: '加载中'
				});
				this.$api.joinRoom(data).then(res => {
					const {
						code,
						data,
						message
					} = res;

					if (code === 10200) {
						let roomData = data ? data : {};
						uni.setStorageSync('roomInfo', roomData);

						setTimeout(() => {
							uni.hideLoading();

							//初始游戏背景音乐配置
							let bcMusic = typeof uni.getStorageSync('bcMusic') == 'boolean' ? uni
								.getStorageSync('bcMusic') : true;
							uni.setStorageSync('bcMusic', bcMusic);

							if (bcMusic) {
								//播放游戏音乐
								getApp().bgmMusic.play();
							}

							that.$routr({
								url: '/pages/index/index',
								type: 'redirectTo',
								login: true
							});
						}, 100);
					} else {
						this.$operate.toast({
							title: message
						});
					}
				});
			},

			//进入历史房间
			clickRoom(roomNumber) {
				this.NUM = roomNumber;
				this.joinRoom();
			},

			//退出登入
			emptyLogin() {
				uni.showModal({
					title: '用户提示',
					content: '您确定要退出登入吗?',
					showCancel: true,
					cancelText: '取消',
					cancelColor: '#000000',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							//退出登入
							this.$api.logoutUser().then(res => {
								const {
									code,
									data,
									message
								} = res;
								if (code === 10200) {
									this.emptyUserInfo();
								} else {
									this.$operate.toast({
										title: message
									});
								}
							});
						} else if (res.cancel) {
							// console.log('用户点击取消');
						}
					}
				});
			},

			startGame() {
				this.$routr({
					url: '/pages/index/index',
					type: 'navigateTo',
					login: true
				});
			},

			clickIndividual() {
				this.$routr({
					url: '/pages/individual/individual',
					type: 'navigateTo',
					login: false
				});
			},

			//键盘操作
			msDown(v) {
				this.active = v;
			},

			msUp(v) {
				this.active = '';
			},

			stopInput() {
				return false;
			},

			change(val, $event) {
				if (this.result.length === 6) {
					return false;
				} else {
					this.result.push(val);
					this.NUM = this.result.join('');
				}
			},

			del() {
				this.result.pop();
				this.NUM = this.result.join('');
				this.$emit('del', this.NUM);
			},

			comfirm() {
				this.$emit('comfirm', this.NUM);

				//进入房间
				this.joinRoom();
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

	.wrap .head-top .statusBar {}

	.wrap .head-top {
		width: 120%;
		height: 150upx;
		border: 1upx solid rgba(132, 145, 148, 1);
		position: relative;
		left: -10%;
		top: 0;
		border-radius: 0 0 50% 50%;
		border-top: 0;
	}

	.wrap .head-top .l {
		display: flex;
		justify-content: space-between;
		color: #fff;
		padding: 30upx;
	}

	.wrap .head-top .l>image {
		width: 72upx;
		height: 72upx;
		margin-right: 15upx;
	}

	.wrap .head-top .r {
		width: 50%;
		display: flex;
		justify-content: space-between;
		color: #fff;
		padding: 30upx;
	}

	.wrap .head-top .r .opt-btn {
		width: 150upx;
		height: 50upx;
		text-align: center;
		line-height: 50upx;
		font-size: 22upx;
		border-radius: 50upx;
	}

	.wrap .type-btn {
		width: 60%;
		margin: 35upx auto;
		display: flex;
		justify-content: space-around;
	}

	.wrap .type-btn .code {
		width: 170upx;
		height: 65upx;
		line-height: 65upx;
		text-align: center;
		color: #fff;
		border-radius: 10upx;
		background-color: #969696;
		font-size: 22upx;
	}

	.wrap .code-box {
		width: 95%;
		height: 140upx;
		background: url('~@/static/images/GameRoom.png');
		background-size: 100% 100%;
		margin: 0 auto;
		padding: 0 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.wrap .code-box .ipt {
		width: 90upx;
		height: 90upx;
		line-height: 30upx;
		background: url('~@/static/images/ipt.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		padding: 30upx;
		text-align: center;
		font-size: 56upx;
		box-sizing: border-box;
	}

	.wrap .enter {
		width: 90%;
		font-size: 28upx;
		text-align: center;
		color: #fff;
		height: 90upx;
		line-height: 90upx;
		border-radius: 10upx;
		font-weight: bold;
		background: url('~@/static/images/btn-bcg.png') no-repeat;
		background-size: 100% 100%;
		margin: 30upx auto;
	}

	.wrap .list .hint {
		width: 90%;
		margin: 0 auto;
		text-align: left;
		font-size: 32upx;
		font-weight: 600;
	}

	.wrap .list .box {
		width: 90%;
		margin: 30upx auto;
		display: flex;
		flex-wrap: wrap;
	}

	.wrap .list .box .item {
		width: 100upx;
		text-align: center;
		margin-right: 60upx;
	}

	.wrap .list .box .item>image {
		width: 100upx;
		height: 100upx;
		border-radius: 10upx;
		border: 1px solid #fff;
	}

	.keyboard-wrapper {
		user-select: none;
	}

	.keyboard-wrapper input {
		width: 100%;
		height: 50px;
		font-size: 25px;
	}

	.keyboard-wrapper .keyboard {
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: #dcdcdc;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.keyboard-wrapper .keyboard .num table {
		width: 100%;
		border: 1px solid #ccc;
		border-collapse: collapse;
		background: #fff;
	}

	.keyboard-wrapper .keyboard .num table td {
		height: 50px;
		vertical-align: middle;
		color: #333;
		font-size: 20px;
		border: 1px solid #ccc;
		text-align: center;
	}

	.keyboard-wrapper .keyboard .num table td.active {
		background: #ccc;
	}

	.keyboard-wrapper .keyboard .num table .del {
		background: #eee;
	}

	.keyboard-wrapper .keyboard .num table .comfirm {
		font-size: 16px;
		width: 80px;
		background: #118eeb;
		color: #fff;
	}

	.keyboard-wrapper .keyboard .num table td.active-c {
		background: #107cca;
	}
</style>