<!-- 蓝色登录页面2 -->
<template>
	<view class="wrap">
		<view class="ret-btn" v-if="type === '2'" @click="retLogin">
			<image style="width: 60upx;height: 60upx;" src="~@/static/images/return.png" alt="" />
		</view>
		<view class="logo">
			<image src="~@/static/images/fenyun.png" />
		</view>
		<view class="login-view" style="">
			<view class="t-login">
				<view class="form" v-if="type === '1'">
					<view class="t-a">
						<!-- <text class="txt">账号</text> -->
						<input class="use" type="text" name="name" maxlength="16" placeholder="请输入6-16位账号"
							v-model="name" />
					</view>
					<view class="t-a">
						<!-- <text class="txt">密码</text> -->
						<input class="psd" type="password" name="code" maxlength="18" placeholder="请输入8-18位密码"
							v-model="password" />
					</view>
					<view class="checkbox">
						<checkbox-group @change="checkboxChange">
							<label>
								<checkbox value="1" :checked="rememberPsd" style="transform:scale(0.6)" />
								记住密码
							</label>
						</checkbox-group>
					</view>
					<button class="login" style="background-color: #7297c3;" @tap="login()">登入</button>
				</view>
				<view class="form-reg" v-if="type === '2'">
					<view class="t-a">
						<!-- <text class="txt">账号</text> -->
						<input class="use" type="text" name="name" placeholder="请输入6-16位账号" maxlength="11"
							v-model="name" />
					</view>
					<view class="t-a">
						<!-- <text class="txt">密码</text> -->
						<input class="psd" type="password" name="password" maxlength="18" placeholder="请输入8-18位密码"
							v-model="password" />
					</view>
					<view class="t-a">
						<!-- <text class="txt">密码</text> -->
						<input class="psd" type="password" name="password" maxlength="18" placeholder="请填写确认密码"
							v-model="passwords" />
					</view>
					<button class="reg" style="background-color: #7297c3;" @tap="subRegister()"></button>
				</view>
				<!-- <view class="reg" @tap="reg()">注 册</view> -->
				<view v-if="type === '1'" class="t-e cl" @click="userReg">
					<image src="~@/static/images/zc.png"></image>
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
	import rsa from '@/utils/rsaEncryption.js'
	export default {
		data() {
			return {
				type: '1', // type 1登入  2注册
				rememberPsd: true, //是否记住密码
				name: '',
				password: '',
				passwords: ''
			};
		},
		created() {
			const that = this;
			//检查是否登入
			if (this.$store.state.hasLodin) {
				console.log(this.$store.state.hasLodin);
				uni.showLoading({
					title: '正在登入...'
				});

				setTimeout(() => {
					uni.hideLoading();
					that.$routr({
						url: '/pages/home/home',
						type: 'redirectTo'
					});
					this.$operate.toast({
						title: '登入成功'
					});
				}, 800);
			}

			//获取用户密码
			let use = uni.getStorageSync('user');

			if (use) {
				this.name = use.name;
				this.password = this.$operate.fromCode(use.password);
				this.rememberPsd = use.rememberPsd;
			}
		},

		methods: {
			...mapMutations(['setUserInfo', 'emptyUserInfo']),
			...mapState(['hasLodin']),

			checkboxChange(e) {
				this.rememberPsd = e.detail.value == '1' ? true : false;
			},

			//注册用户
			subRegister() {
				const that = this;
				const {
					name,
					password,
					passwords
				} = this;
				const account = /^(?=\D*\d*\D+)\D*.{4,}$/;
				const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,}$/;

				if (!account.test(name)) {
					this.$operate.toast({
						title: '账号至少有4个字符, 只能数字或字母组合'
					});
					return;
				} else if (!regex.test(password)) {
					this.$operate.toast({
						title: '密码至少有6个字符，只能数字或字母组合'
					});
					return;
				}

				let data = {
					loginName: name,
					nickname: name,
					password: password
				};

				if (password != passwords) {
					this.$operate.toast({
						title: '密码不一致'
					});
					return;
				}

				this.$api.useRegister(data).then(res => {
					const {
						code,
						data,
						message
					} = res;

					if (code === 10200) {
						//注册登入成功  写入用户数据
						this.setUserInfo(res.data);
						this.$operate.toast({
							title: '注册成功, 马上登入...'
						});

						//跳转首页
						setTimeout(() => {
							uni.hideLoading();
							that.$routr({
								url: '/pages/home/home',
								type: 'redirectTo',
								login: true
							});

							this.$operate.toast({
								title: '登入成功'
							});
						}, 600);
					} else {
						this.$operate.toast({
							title: message
						});
					}
				});
			},

			//用户登录
			login() {
				var that = this;
				const {
					name,
					password,
					passwords
				} = this;

				let data = {
					loginName: name,
					password: password
				};

				if (!name) {
					this.$operate.toast({
						title: '请输入用户名'
					});
					return;
				}

				if (!password) {
					this.$operate.toast({
						title: '请输入用户密码'
					});
					return;
				}

				uni.showLoading({
					title: '正在登入'
				});

				//生成密钥对
				rsa.createKeyPair()
				this.$api.userLogin(data).then(res => {
					const {
						code,
						data,
						message
					} = res;

					if (code === 10200) {
						//登入成功  写入用户数据
						this.setUserInfo(res.data);

						//跳转首页
						setTimeout(() => {
							uni.hideLoading();
							that.$routr({
								url: '/pages/home/home',
								type: 'redirectTo',
								login: true
							});
							this.$operate.toast({
								title: '登入成功'
							});
						}, 300);

						//是否记住密码
						if (this.rememberPsd) {
							uni.setStorageSync('user', {
								name: name,
								password: this.$operate.toCode(password),
								rememberPsd: this.rememberPsd
							});
						} else {
							uni.removeStorageSync('user');
						}
					} else {
						this.$operate.toast({
							title: message
						});
					}
				});
			},

			//注册按钮点击
			userReg() {
				//生成密钥对
				rsa.createKeyPair()
				this.type = '2';
				this.name = ''
				this.password = ''
			},

			//返回登入
			retLogin() {
				this.type = '1';

				//重新加载用户数据
				let use = uni.getStorageSync('user');
				if (use) {
					this.name = use.name;
					this.password = this.$operate.fromCode(use.password);
					this.rememberPsd = use.rememberPsd;
				}
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
		position: relative;
	}

	.wrap .logo {
		width: 100%;
		font-size: 72upx;
		font-weight: 600;
		text-align: center;
		background-size: 100%;
		margin-top: 150upx;
	}

	.wrap .logo>image {
		width: 170upx;
		height: 170upx;
	}

	.wrap .ret-btn {
		position: absolute;
		top: 5%;
		margin-left: 30upx;
	}

	.reg {
		font-size: 28upx;
		height: 90upx;
		line-height: 90upx;
		border-radius: 10upx;
		font-weight: bold;
		background: #f5f6fa;
		color: #000000;
		text-align: center;
		margin-top: 30upx;
	}

	.txt {
		font-size: 32upx;
		font-weight: bold;
		color: #333333;
	}

	.login-view {
		width: 90%;
		position: relative;
		margin: 0 auto;
		border-radius: 10upx;
	}

	.t-login {
		width: 100%;
		margin: 0 auto;
		font-size: 28upx;
		padding-top: 80upx;
	}

	.t-login .form {
		width: 100%;
		height: 100%;
		padding: 30upx;
		background: url('~@/static/images/login.png') no-repeat;
		background-size: 100% 100%;
		border-radius: 10upx;
		margin-bottom: 30upx;
		overflow: hidden;
		padding: 60upx 30upx;
	}

	.form-reg {
		width: 100%;
		height: 100%;
		padding: 30upx;
		background: url('~@/static/images/zcbac.png') no-repeat;
		background-size: 100% 100%;
		border-radius: 10upx;
		margin-bottom: 30upx;
		overflow: hidden;
		padding: 60upx 30upx;
	}

	.login {
		width: 100%;
		font-size: 28upx;
		color: #fff;
		height: 90upx;
		line-height: 90upx;
		border-radius: 10upx;
		font-weight: bold;
		background: url('~@/static/images/btn-bcg.png') no-repeat;
		background-size: 100% 100%;
		position: relative;
		top: 15upx;
	}

	.reg {
		width: 100%;
		font-size: 28upx;
		color: #fff;
		height: 90upx;
		line-height: 90upx;
		border-radius: 10upx;
		font-weight: bold;
		background: url('~@/static/images/reg.png') no-repeat;
		background-size: 100% 100%;
		position: relative;
		top: 15upx;
	}

	.t-login input {
		height: 90upx;
		line-height: 90upx;
		color: #000;
		margin-bottom: 50upx;
		font-size: 32upx;
		border-radius: 50upx;
		margin-top: 15upx;
		padding: 0 60upx;
	}

	.t-login .t-a {
		position: relative;
	}

	.t-login .t-a .use {
		background: url('~@/static/images/use1.png') no-repeat;
		background-size: 100% 100%;
	}

	.t-login .t-a .psd {
		background: url('~@/static/images/use2.png') no-repeat;
		background-size: 100% 100%;
	}

	.t-b {
		text-align: left;
		font-size: 42upx;
		color: #ffffff;
		padding: 130upx 0 0 70upx;
		font-weight: bold;
		line-height: 70upx;
	}

	.t-login .t-c {
		position: absolute;
		right: 22upx;
		top: 22upx;
		background: #5677fc;
		color: #fff;
		font-size: 24upx;
		border-radius: 50upx;
		height: 50upx;
		line-height: 50upx;
		padding: 0 25upx;
	}

	.t-login .t-d {
		text-align: center;
		color: #999;
		margin: 80upx 0;
	}

	.t-login .t-g {
		float: left;
		width: 50%;
	}

	.checkbox {
		width: 30%;
		float: right;
		color: #000;
		margin-top: -30upx;
	}

	.t-login .t-e {
		text-align: center;
		margin-top: 100upx;
	}

	.t-login .t-e image {
		width: 100upx;
		height: 100upx;
	}

	.t-login .uni-input-placeholder {
		color: #aeaeae;
	}
</style>