<template>
	<view class="wrap">
		<view class="opt-item">
			<view class="switch-btn">
				<view :class="[timeInx === 1 ? 'select' : '']" @click="timeChange(1)">今日</view>
				<view :class="[timeInx === 0 ? 'select' : '']" @click="timeChange(0)">昨日</view>
			</view>
			<view class="time">
				<view>{{ timeArr[timeInx].start }}</view>
				-
				<view>{{ timeArr[timeInx].end }}</view>
			</view>
		</view>
		<view style="background-color: #f5f5f5;">
			<view>
				<view class="line">
					<view>总注单</view>
					<view>总注额</view>
					<view>游戏总结果</view>
				</view>
				<view class="line" style="color: #808080;">
					<view>{{ summary.betCount }}</view>
					<view>{{ summary.betMoney }}</view>
					<view>{{ summary.gameMoney }}</view>
				</view>
			</view>
			<view>
				<view class="line">
					<view>红利合计</view>
					<view>返点合计</view>
					<view>玩家总结果</view>
				</view>
				<view class="line" style="color: #808080;">
					<view>{{ summary.bonus }}</view>
					<view>{{ summary.rebate }}</view>
					<view>{{ summary.userMoney }}</view>
				</view>
			</view>
		</view>
		<view class="list" v-for="item in list" @click="inspectionGame(item.globalId)">
			<view class="line">
				<view class="line-img">
					<image mode="heightFix" :src="item.avatar" style="height: 50upx;width: 0;margin-right: 15upx;" />
					{{ item.label }}
				</view>
				<view class="line-img" style="width: 5%;"><image class="arrows" src="~@/static/images/arrows.png" /></view>
			</view>
			<view class="line" style="text-align: left;">
				<view>注单 {{ item.betCount }}</view>
				<view>红利 {{ item.bonus }}</view>
				<view>游戏结果 {{ item.gameMoney }}</view>
			</view>
			<view class="line" style="text-align: left;">
				<view>注额 {{ item.betMoney }}</view>
				<view>彩票回水 {{ item.rebate }}</view>
				<view>玩家结果 {{ item.userMoney }}</view>
			</view>
		</view>
		<view class="hint">数据全部加载完成</view>
	</view>
</template>

<script>
import moment from '../../utils/moment.min.js';
export default {
	data() {
		return {
			pageNo: 0, //页
			pageSize: 100, //条
			roomId: '',
			list: [],
			summary: '',
			timeArr: '',
			timeInx: 1
		};
	},
	onLoad() {
		let room = uni.getStorageSync('roomInfo');
		this.roomId = room.roomId;

		let before = moment(new Date()).add(-1, 'days');
		let now = moment(new Date());
		let ming = moment(new Date()).add(1, 'days');

		let beforeTime = before.format('YYYY/MM/DD 06:00:00');
		let nowTime = now.format('YYYY/MM/DD 06:00:00');
		let mingTime = ming.format('YYYY/MM/DD 06:00:00');

		let beStamp = moment(beforeTime).valueOf();
		let nowStamp = moment(nowTime).valueOf();
		let mingStamp = moment(mingTime).valueOf();

		console.log(beStamp, nowStamp, mingStamp);
		let timeArr = [];
		timeArr.push({
			start: beforeTime,
			end: nowTime,
			startStamp: beStamp,
			endStamp: nowStamp
		});
		timeArr.push({
			start: nowTime,
			end: mingTime,
			startStamp: nowStamp,
			endStamp: mingStamp
		});

		this.timeArr = timeArr;

		//获取数据
		this.gettContestList();
	},
	methods: {
		timeChange(idx) {
			this.timeInx = idx;
			this.gettContestList();
		},

		inspectionGame(globalId) {
			this.$routr({
				url: '/pages/gameRecord/gameRecord?globalId=' + globalId,
				type: 'navigateTo',
				login: true
			});
		},
		//获取申请记录
		gettContestList() {
			const that = this;
			const { timeArr, timeInx } = this;
			this.$api
				.gettContestList({
					start: timeArr[timeInx].startStamp,
					end: timeArr[timeInx].endStamp
				})
				.then(res => {
					const { code, data, message } = res;
					let summary = {
						betCount: 0,
						betMoney: 0,
						userMoney: 0,
						bonus: 0,
						rebate: 0,
						gameMoney: 0
					};
					if (code === 10200) {
						let list = data.map((item, index) => {
							//计算总和
							summary.betCount += item.betCount;
							summary.betMoney += item.betMoney;
							summary.userMoney += item.userMoney;
							summary.bonus += item.bonus;
							summary.rebate += item.rebate;
							summary.gameMoney += item.gameMoney;

							return {
								...item,
								createdAt: moment(item.createdAt).format('MM-DD HH:mm:ss')
							};
						});

						this.summary = summary;
						this.list = list;
					} else {
						this.$operate.toast({
							title: message
						});
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
.wrap .opt-item {
	width: 100%;
	overflow: hidden;
	margin-bottom: 15rpx;
}
.wrap .opt-item .switch-btn {
	width: 30%;
	display: flex;
	justify-content: space-around;
	margin-top: 30rpx;
	margin-left: 30rpx;
}
.wrap .opt-item .switch-btn > view {
	width: 88rpx;
	height: 45rpx;
	line-height: 45rpx;
	text-align: center;
	color: #808080;
	font-size: 28rpx;
	border-radius: 20rpx;
}
.wrap .opt-item .switch-btn .select {
	color: #fff !important;
	background-color: #6d91ad;
}
.wrap .opt-item .time {
	width: 70%;
	font-size: 24rpx;
	display: flex;
	justify-content: space-around;
	margin: 15rpx auto;
	color: #808080;
}
.wrap .line {
	width: 100%;
	line-height: 46rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 0 auto;
	font-size: 22rpx;
	font-size: 500;
	text-align: center;
}
.wrap .line .line-img {
	font-size: 28rpx;
	font-weight: 500;
	display: flex;
	justify-content: start;
	align-items: center;
}
.wrap .line > view {
	width: 30%;
}

.wrap .list {
	width: 100%;
	background-color: #fff;
	margin-top: 30rpx;
	padding: 15rpx 30rpx;
}
.wrap .list .arrows {
	width: 28rpx;
	height: 28rpx;
	float: right;
}
.wrap .list .item {
	width: 100%;
	line-height: 80rpx;
	display: flex;
	justify-content: space-around;
	text-align: center;
	border-top: 1px solid #edeff2;
}
.wrap .list .item > view {
	width: 20%;
	color: #808080;
}

.wrap .hint {
	width: 100%;
	text-align: center;
	color: #808080;
	margin-top: 15rpx;
}
</style>
