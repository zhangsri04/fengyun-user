<template>
	<view class="wrap">
		<view class="box">
			<view style="margin-top: 30rpx;">总资产</view>
			<view>
				<view class="line">
					<view style="font-size: 56rpx;">{{ info.money }}</view>
					<view>红利: {{ info.bonus }}</view>
				</view>
				<view class="line">
					<view>流水: {{ info.betMoney }}</view>
					<view>回水: {{ info.rebate }}</view>
					<view>盈亏: {{ info.winMoney }}</view>
				</view>
				<view class="statistics">今日统计</view>
			</view>
		</view>
		<view class="list">
			<view class="item" style="border-top:none;border-left:none;" @click="applyRecord">
				<image class="item-img" src="~@/static/images/ico1.png"></image>
				<view class="">申请记录</view>
			</view>
			<view class="item" style="border-top:none;" @click="gameRecord">
				<image class="item-img" src="~@/static/images/ico2.png"></image>
				<view class="">游戏记录</view>
			</view>
			<view class="item" style="border-top:none;border-right:none;" @click="contestList">
				<image class="item-img" src="~@/static/images/ico3.png"></image>
				<view class="">竞猜报表</view>
			</view>
			<view class="item" style="border-bottom:none;border-left:none;" @click="welfareList">
				<image class="item-img" src="~@/static/images/ico4.png"></image>
				<view class="">福利报表</view>
			</view>
			<view class="item" style="border-bottom:none;" @click="redEnvelope">
				<image class="item-img" src="~@/static/images/ico5.png"></image>
				<view class="">红包报表</view>
			</view>
			<view class="item" style="border-bottom:none;border-right:none;" @click="integralList">
				<image class="item-img" src="~@/static/images/ico6.png"></image>
				<view class="">积分账变</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {}
			};
		},
		onLoad() {
			let room = uni.getStorageSync('roomInfo');
			this.roomId = room.roomId;

			//获取统计数据
			this.getStatistics();
		},
		methods: {
			//统计数据数据
			getStatistics() {
				const that = this;
				this.$api.getStatistics(that.roomId, '').then(res => {
					const {
						code,
						data,
						message
					} = res;
					if (code === 10200) {
						this.info = data;
					} else {
						this.$operate.toast({
							title: message
						});
					}
				});
			},

			applyRecord() {
				this.$routr({
					url: '/pages/applyRecord/applyRecord',
					type: 'navigateTo',
					login: true
				});
			},
			gameRecord() {
				this.$routr({
					url: '/pages/gameRecord/gameRecord',
					type: 'navigateTo',
					login: true
				});
			},
			contestList() {
				this.$routr({
					url: '/pages/contestList/contestList',
					type: 'navigateTo',
					login: true
				});
			},
			redEnvelope() {
				this.$operate.toast({
					title: '此功能未开放'
				});
				return;
			},
			welfareList() {
				this.$routr({
					url: '/pages/welfareList/welfareList',
					type: 'navigateTo',
					login: true
				});
			},
			integralList() {
				this.$routr({
					url: '/pages/integralList/integralList',
					type: 'navigateTo',
					login: true
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

	.wrap .box {
		width: 90%;
		color: #fff;
		background-color: #6392b0;
		margin: 30rpx auto;
		border-radius: 20rpx;
		padding: 15rpx 30rpx;
		box-sizing: border-box;
		position: relative;
	}

	.wrap .box .line {
		width: 95%;
		display: flex;
		justify-content: space-between;
		text-align: left;
	}

	.wrap .box .statistics {
		width: 150rpx;
		text-align: center;
		background-color: #79b4d9;
		position: absolute;
		top: 15rpx;
		right: 0;
		border-top-left-radius: 30rpx;
		border-bottom-left-radius: 30rpx;
	}

	.wrap .list {
		width: 90%;
		background-color: #fff;
		border: 1rpx solid #d5d5d5;
		margin: 30rpx auto;
		border-radius: 20rpx;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
	}

	.item {
		width: 33.33%;
		height: 150rpx;
		text-align: center;
		border: 1rpx solid #d5d5d5;
	}

	.item .item-img {
		width: 45rpx;
		height: 40rpx;
		margin-top: 30rpx;
	}
</style>