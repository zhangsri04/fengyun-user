<template>
	<view class="wrap">
		<view class="opt-item">
			<view class="switch-btn">
				<view :class="[globalId == item.globalId ? 'select' : '']" v-for="(item, index) in gameList" @click="selectGame(index)">{{ item.label }}</view>
			</view>
		</view>
		<scroll-view v-if="list.length > 0" class="list" :scroll-y="true" enable-flex="true" @scrolltolower="scorllClick">
			<view class="" v-for="(item, index) in list">
				<view class="item" @click="clickGame(index)">
					<view class="item-name">
						<view>
							{{ item.betting_Text }}
							<text :style="{ color: item.profit > 0 ? '#6ac0f2' : '#ea4025' }">{{ item.profit }}</text>
						</view>
						<text style="color: #808080;margin-right: 30rpx;">第{{ item.gameNumber }}期</text>
						<text style="color: #808080;">{{ item.createdAt }}</text>
					</view>
					<view v-if="item.profit > 0" class="state">赢</view>
					<view v-else class="state" style="background-color: #ee4c55;">输</view>
					<image class="show" src="~@/static/images/exp.png" />
				</view>
				<view class="box" v-if="index === gameInx">
					<view class="number">
						<view v-for="val in item.codeArr" class="nub" :class="'nub-bcg' + val">{{ val }}</view>
					</view>
					<!-- <view style="color: #808080;margin-top: 15upx;">冠亚和: 11 小 单 1-5龙虎: 虎 龙 虎 虎 虎</view> -->
					<view style="color: #808080;margin-top: 15upx;">
						冠亚和: {{ item.prizeResult.guanYaHe }} {{ item.prizeResult.guanYaHeSize }} {{ item.prizeResult.guanYaHeOddEven }} 1-5龙虎:
						<text v-for="res in item.prizeResult.longHuResult">{{ res }}</text>
					</view>
				</view>
			</view>
			<view class="hint">数据全部加载完成</view>
		</scroll-view>
		<view v-else class="hint">暂无记录</view>
	</view>
</template>
<script>
import moment from '../../utils/moment.min.js';
import lotteryCall from '../../common/lotteryCall.js';
export default {
	data() {
		return {
			pageNo: 0, //页
			pageSize: 15, //条
			roomId: '',
			globalId: '',
			list: [],
			gameList: [],
			selectIndex: 0,
			gameInx: ''
		};
	},
	onLoad(options) {
		let room = uni.getStorageSync('roomInfo');
		let gameList = uni.getStorageSync('gameList');
		let globalId = options.globalId;

		this.globalId = globalId ? globalId : gameList[0].globalId;
		this.roomId = room.roomId;
		this.gameList = gameList;

		//获取数据
		this.getGameRoduce();
	},
	methods: {
		scorllClick() {
			//每次触底增加页数
			this.pageNo += 1;
			this.getGameRoduce();
		},

		//选择游戏
		selectGame(index) {
			this.list = [];
			this.selectIndex = index;
			this.globalId = this.gameList[index].globalId;
			this.getGameRoduce();
		},

		//点击游戏
		clickGame(i) {
			this.gameInx = this.gameInx === i ? '' : i;
		},
		//获取游戏记录
		getGameRoduce() {
			const that = this;
			const { pageNo, pageSize, roomId, globalId } = this;
			this.$api
				.getGameRoduce({
					pageNo,
					pageSize,
					roomId,
					globalId
				})
				.then(res => {
					const { code, data, message } = res;
					if (code === 10200) {
						let list = data.map((bet, index) => {
							let betting_Text = '';

							const formattedAmount = bet.amount.toFixed(1);

							if (bet.isSum === 1) {
								const typeTextMap = {
									101: bet.number,
									1: '大',
									2: '小',
									3: '单',
									4: '双'
								};
								betting_Text = `冠亚和【${typeTextMap[bet.type]}】${formattedAmount}`;
							} else {
								const seatText = bet.seat === 1 ? '冠军' : bet.seat === 2 ? '亚军' : `第${bet.seat}名`;
								if (bet.type === 101) {
									betting_Text = `${seatText}【${bet.number}/${formattedAmount}】`;
								} else {
									const typeTextMap = {
										1: '大',
										2: '小',
										3: '单',
										4: '双',
										5: '龙',
										6: '虎'
									};
									betting_Text = `${seatText}【${typeTextMap[bet.type]}】`;
								}
							}

							let codeArr = bet.gameResult ? bet.gameResult.split(',') : [];
							codeArr.forEach((item, index) => {
								codeArr[index] = Number(item);
							});

							return {
								...bet,
								codeArr,
								betting_Text,
								profit: this.accSub(bet.winAmount, bet.amount),
								prizeResult: lotteryCall.getPK10Result([1, 2, 4, 5, 6, 7, 9, 6, 3, 10]),
								createdAt: moment(bet.createdAt).format('MM-DD HH:mm:ss')
							};
						});
						this.list = this.list.concat(list);
					} else {
						this.$operate.toast({
							title: message
						});
					}
				});
		},
		accSub(arg1, arg2) {
			let r1, r2, m, n;
			try {
				r1 = arg1.toString().split('.')[1].length;
			} catch (e) {
				r1 = 0;
			}
			try {
				r2 = arg2.toString().split('.')[1].length;
			} catch (e) {
				r2 = 0;
			}
			m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
			n = r1 >= r2 ? r1 : r2;
			return ((arg1 * m - arg2 * m) / m).toFixed(n);
		}
	}
};
</script>

<style>
.wrap {
	width: 100%;
	height: 100vh;
	background-color: #efefef;
	position: relative;
}
.wrap .opt-item {
	width: 100%;
	background-color: #fff;
	overflow: hidden;
}
.wrap .opt-item .switch-btn {
	width: 90%;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	margin-top: 30upx;
	margin-left: 30upx;
}
.wrap .opt-item .switch-btn > view {
	height: 45upx;
	line-height: 45upx;
	text-align: center;
	color: #808080;
	background-color: #efefef;
	font-size: 28upx;
	border-radius: 20upx;
	padding: 0 30upx;
	margin-right: 30upx;
	margin-bottom: 15upx;
}
.wrap .opt-item .switch-btn .select {
	color: #fff !important;
	background-color: #6d91ad;
}
.wrap .list {
	width: 100%;
	height: 88vh;
	background-color: #fff;
	margin-top: 30upx;
	padding: 15upx 0;
	box-sizing: border-box;
	position: absolute;
	bottom: 0;
}
.wrap .list .item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 30upx;
	width: 95%;
	margin: 0 auto;
}
.wrap .list .box {
	box-sizing: border-box;
	width: 100%;
	height: 120upx;
	background-color: #f5f6f9;
	padding: 15upx 20upx;
}
.wrap .list .item .state {
	width: 72upx;
	height: 72upx;
	line-height: 72upx;
	text-align: center;
	background-color: #52b565;
	border-radius: 50%;
	color: #fff;
	font-size: 38upx;
	font-weight: 500;
	position: relative;
	left: 70upx;
}
.wrap .list .item .show {
	width: 32upx;
	height: 32upx;
}
.wrap .list .number {
	width: 75%;
	display: flex;
	justify-content: space-between;
}
.wrap .list .number > view {
	display: inline-block;
	width: 40upx;
	height: 40upx;
	line-height: 40upx;
	text-align: center;
	color: #fff;
	border-radius: 8upx;
	font-size: 30upx;
	font-weight: 500;
}

.nub-bcg1 {
	background-color: #ede549;
}

.nub-bcg2 {
	background-color: #4090d7;
}

.nub-bcg3 {
	background-color: #4b4b4b;
}

.nub-bcg4 {
	background-color: #ee7e31;
}

.nub-bcg5 {
	background-color: #69dfe3;
}

.nub-bcg6 {
	background-color: #4e35f5;
}

.nub-bcg7 {
	background-color: #bfbfbf;
}

.nub-bcg8 {
	background-color: #ea4025;
}

.nub-bcg9 {
	background-color: #6e190b;
}

.nub-bcg10 {
	background-color: #57bc37;
}
.wrap .hint {
	width: 100%;
	text-align: center;
	color: #808080;
	margin-top: 15upx;
}
</style>
