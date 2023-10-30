<template>
	<view class="wrap">
		<view class="item" @touchend="editAvatar">
			<view class="l" alt="">
				<image class="head-img" :src="userInfo.avatar" />
				<view>
					<view>{{ userInfo.nickname }}</view>
					<view>账号: {{ userInfo.membershipNumber }}</view>
				</view>
			</view>
			<view class="r">
				<image class="arrows" src="~@/static/images/arrows.png" alt="" />
			</view>
		</view>
		<view class="line" @click="showEdName">
			<view class="l">修改昵称</view>
			<view class="r">
				<view>{{userInfo.nickname}}</view>
				<image class="arrows" src="~@/static/images/arrows.png" alt="" />
			</view>
		</view>
		<view class="line" @click="showPassword">
			<view class="l">重置密码</view>
			<view class="r ">
				<view>修改密码</view>
				<image class="arrows" src="~@/static/images/arrows.png" alt="" />
			</view>
		</view>
		<view class="line">
			<view class="l">背景音乐</view>
			<view class="r uni-list-cell uni-list-cell-pd">
				<switch :checked="autoplay" color="#68b5da" style="transform:scale(0.9)" @change="changeAutoplay" />
				<!-- <image class="arrows" src="~@/static/images/arrows.png" alt=""> -->
			</view>
		</view>
		<view class="line">
			<view class="l">音乐音量</view>
			<view style="width: 80%;">
				<slider @change="durationChange" activeColor="#68b5da" :value="duration" min="0" max="10" />
				<!-- <image class="arrows" src="~@/static/images/arrows.png" alt=""> -->
			</view>
		</view>
		<view class="line">
			<view class="l">当前版本</view>
			<view class="r">
				<view style="margin-right: 15upx;">V 0.1.1</view>
			</view>
		</view>

		<view class="btn" @click="emptyLogin">退出登入</view>

		<view :hidden="showName" class="popup_content">
			<view class="popup_title">用户昵称</view>
			<view class="popup_textarea_item"><input class="popup_ipt" placeholder="请输入用户昵称" v-model="useName" /></view>
			<view @click="editUserInfo"><button class="popup_button">保存</button></view>
		</view>
		<view :hidden="showName" class="popup_overlay" @click="hideEdName"></view>

		<view :hidden="showPsd" class="popup_content">
			<view class="popup_title">用户密码</view>
			<view class="popup_textarea_item"><input type="password" class="popup_ipt" placeholder="请输入用户密码"
					v-model="password" /></view>
			<view @click="editUserPassword"><button class="popup_button">保存</button></view>
		</view>
		<view :hidden="showPsd" class="popup_overlay" @click="hideaPssword"></view>
	</view>
</template>

<script>
	import operate from '@/common/operate.js';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				use: '',
				autoplay: true,
				duration: 3,
				userInfo: {},
				useName: '',
				password: '',
				showName: true,
				showPsd: true,
				avatar: ''
			};
		},

		created() {
			this.requestUrl = operate.api();
			this.autoplay = uni.getStorageSync('bcMusic');

			//获取用户信息
			this.use = uni.getStorageSync('user');
			this.getUserInfo();
		},

		methods: {
			...mapMutations(['emptyUserInfo']),

			showEdName() {
				// 显示输入弹出框
				this.showName = false;
			},

			hideEdName() {
				// 隐藏输入弹出框
				this.showName = true;
			},

			showPassword() {
				// 显示输入弹出框
				this.showPsd = false;
			},

			hideaPssword() {
				// 隐藏输入弹出框
				this.showPsd = true;
			},
			//获取用户信息
			getUserInfo() {
				this.$api.getUseInfo().then(res => {
					const {
						code,
						data,
						message
					} = res;
					if (code === 10200) {
						this.useName = data.nickname
						this.avatar = data.avatar
						this.userInfo = data;
					} else {
						this.$operate.toast({
							title: message
						});
					}
				});
			},

			//退出登入
			emptyLogin() {
				uni.showModal({
					title: '退出登入',
					content: '您确定要退出游戏吗!',
					showCancel: true,
					cancelText: '取消',
					cancelColor: '#000000',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
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

			editUserInfo() {
				const {
					useName,
					avatar
				} = this
				let data = {
					avatar: avatar,
					nickname: useName,
				};

				this.$api.editUserName(data).then(res => {
					console.log(res);
					const {
						code,
						data,
						message
					} = res;

					if (code === 10200) {
						this.getUserInfo()

						this.$operate.toast({
							title: '修改成功'
						});
						this.hideaPssword();
						this.hideEdName();
					} else {
						this.$operate.toast({
							title: message
						});
					}
				});
			},

			editUserPassword() {
				const {
					password,
					use
				} = this
				console.log(use.password)
				let data = {
					newPassword: password,
					oldPassword: this.$operate.fromCode(use.password)
				};

				this.$api.editUserPassword(data).then(res => {
					console.log(res);
					const {
						code,
						data,
						message
					} = res;

					if (code === 10200) {
						this.hideaPssword();
						this.emptyUserInfo();


						const that = this
						setTimeout(() => {
							that.$operate.toast({
								title: '修改密码成功,请重新登入!'
							});
						}, )
					} else {
						this.$operate.toast({
							title: message
						});
					}
				});
			},

			changeAutoplay(e) {
				let autoplay = e.detail.value;
				this.autoplay = autoplay;

				uni.setStorageSync('bcMusic', autoplay);

				if (autoplay) {
					//播放游戏音乐
					getApp().bgmMusic.play();
				} else {
					//关闭背景音乐
					getApp().bgmMusic.stop();
				}
			},
			durationChange(e) {
				getApp().bgmMusic.volume = e.target.value / 10;
			},

			returnPage() {
				this.$router.go(-1);
			},

			editAvatar() {
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

						that.uploadAvatar(res.tempFilePaths[0])

						// if (res.tempFiles[0]['size'] < 5 * 1024 * 1024) { //图片小于5M不压缩，大于5M压缩
						// 	that.uploadAvatar(res.tempFilePaths[0])
						// } else {
						// 	uni.compressImage({
						// 		src: res.tempFilePaths[0],
						// 		quality: 80,
						// 		success: res => {
						// 			console.log(res, '=========res');
						// 			that.uploadAvatar(res.tempFilePath)
						// 		}
						// 	})
						// }
					}
				});
			},

			//修改头像
			uploadAvatar(tempFilePaths) {
				uni.uploadFile({
					url: this.requestUrl + '/user-admin/upload/file',
					filePath: tempFilePaths,
					name: 'file',
					success: res => {
						console.log(JSON.parse(res.data));
						let url = this.requestUrl + JSON.parse(res.data).data;
						this.userInfo.avatar = url;
						this.avatar = url;
						this.editUserInfo(url);
						// console.log('upload success', res.data);
					},
					fail: err => {
						uni.showToast({
							title: '上传图片大',
							icon: 'none',
							duration: 3000
						});
						// console.log('upload fail', err);
					}
				});
			}
		}
	};
</script>

<style>
	.wrap {
		width: 100%;
		height: 100vh;
		background-color: #efefef;
	}

	.wrap .item {
		width: 100%;
		height: 150upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		border-bottom: 1upx solid rgba(132, 145, 148, 1);
		padding: 30upx;
		margin-bottom: 30upx;
	}

	.wrap .item .l {
		display: flex;
		justify-content: start;
		align-items: center;
		color: #000;
	}

	.wrap .item .l .head-img {
		width: 102upx;
		height: 102upx;
		margin-right: 15upx;
	}

	.wrap .r {
		width: 50%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.wrap .arrows {
		width: 30upx;
		height: 25upx;
		margin-left: 15upx;
	}

	.wrap .line {
		width: 100%;
		height: 75upx;
		line-height: 75upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		border-bottom: 1upx solid rgba(132, 145, 148, 1);
		padding: 30upx;
	}

	.wrap .line .r>image {
		width: 20upx;
	}

	.wrap .btn {
		width: 100%;
		height: 95upx;
		line-height: 95upx;
		background-color: #fff;
		border-top: 1upx solid rgba(132, 145, 148, 1);
		border-bottom: 1upx solid rgba(132, 145, 148, 1);
		text-align: center;
		margin-top: 30upx;
		font-size: 32upx;
		font-weight: 500;
	}

	/* 弹框输入*/
	.popup_overlay {
		position: fixed;
		top: 0%;
		left: 0%;
		width: 100%;
		height: 100%;
		background-color: black;
		z-index: 100;
		-moz-opacity: 0.8;
		opacity: 0.8;
		filter: alpha(opacity=88);
	}

	.popup_content {
		position: fixed;
		top: 50%;
		left: 50%;
		width: 520upx;
		height: 350upx;
		margin-left: -270upx;
		margin-top: -270upx;
		border: 10px solid white;
		background-color: white;
		z-index: 1002;
		overflow: auto;
		border-radius: 20upx;
	}

	.popup_title {
		padding-top: 20upx;
		width: 480upx;
		text-align: center;
		font-size: 32upx;
	}

	.popup_textarea_item {
		padding-top: 5upx;
		width: 440upx;
		background-color: #f1f1f1;
		margin-top: 30upx;
		margin-left: 20upx;
	}

	.popup_ipt {
		width: 410upx;
		height: 72upx;
		font-size: 26upx;
		margin-left: 20upx;
	}

	.popup_button {
		width: 90%;
		color: white;
		background-color: #6d91ad;
		border-radius: 20upx;
		margin-top: 60upx;
		font-size: 28upx;
	}
</style>