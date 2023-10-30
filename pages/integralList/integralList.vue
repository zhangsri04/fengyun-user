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
		<view class="list">
			<view class="type">
				<view>全部记录</view>
				<view @click="shoePick = !shoePick">
					筛选
					<image class="show" src="~@/static/images/exp.png" />
				</view>
			</view>
			<view class="opt-item" v-if="shoePick" style="background-color: #fff;padding-top: 15upx;">
				<view class="switch-btn-s">
					<view :class="[typeInx === index ? 'select' : '']" v-for="(item, index) in arr" @click="selectItem(index)">{{ item.name }}</view>
				</view>
			</view>
			<scroll-view v-if="list.length > 0" class="scroll-box" :scroll-y="true" enable-flex="true" @scrolltolower="scorllClick">
				<view class="item" v-for="item in list">
					<view>
						<view>{{ item.name }}</view>
						<view>{{ item.createdAt }}</view>
					</view>
					<view>
						<view>账变前: {{ item.prePoints }}</view>
						<view>账变后: {{ item.nextPoints }}</view>
					</view>
					<view style="text-align: center;" :style="[{ color: item.profit > 0 ? '#6ac0f2' : '#ea4025' }, { width: '10%' }]">{{ item.profit }}</view>
					<!-- <view style="color: #5985c1;text-align: right;">{{ item.approvedAt }}</view> -->
				</view>
				<view class="hint">数据全部加载完成</view>
			</scroll-view>
		</view>
		<view v-if="list.length <= 0" class="hint">暂无记录</view>
	</view>
</template>

<script>
import moment from '../../utils/moment.min.js';
export default {
	data() {
		return {
			pageNo: 0, //页
			pageSize: 10, //条
			roomId: '',
			list: [],
			shoePick: false,
			start: '1680904800000',
			end: '1680991200000',
			timeArr: '',
			timeInx: 1,
			typeInx: 0,
			arr: [
				{
					name: '全部',
					type: ''
				},
				{
					name: '上分',
					type: 1
				},
				{
					name: '下分',
					type: 2
				},
				{
					name: '上下分',
					type: 0
				},
				{
					name: '彩票下注',
					type: 10
				},
				{
					name: '彩票结算',
					type: 4
				},
				{
					name: '彩票回水',
					type: 6
				},
				{
					name: '彩票取消注单',
					type: 3
				},
				{
					name: '红包',
					type: 11
				},
				{
					name: '佣金',
					type: 8
				}
			]
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
		this.gettTransactionList();
	},
	methods: {
		scorllClick() {
			//每次触底增加页数
			this.pageNo += 1;
			this.gettTransactionList();
		},
		timeChange(idx) {
			this.timeInx = idx;
			this.pageNo = 0;
			this.list = [];

			this.gettTransactionList();
		},

		selectItem(index) {
			this.typeInx = index;
			this.pageNo = 0;
			this.list = [];

			this.gettTransactionList();
		},

		screening(tranTypeId) {
			let arr = this.arr;
			let name = '';
			for (let i in arr) {
				if (tranTypeId === arr[i].type) {
					name = arr[i].name;
				}
			}
			return name;
		},

		//获取记录
		gettTransactionList() {
			const that = this;
			const { pageNo, pageSize, roomId, timeArr, timeInx, arr, typeInx } = this;
			this.$api
				.gettTransactionList({
					start: timeArr[timeInx].startStamp,
					end: timeArr[timeInx].endStamp,
					pageNo,
					pageSize,
					roomId,
					type: arr[typeInx].type
				})
				.then(res => {
					const { code, data, message } = res;
					if (code === 10200) {
						let list = data.map((item, index) => {
							return {
								...item,
								profit: this.accSub(item.nextPoints, item.prePoints),
								name: this.screening(item.tranTypeId),
								createdAt: moment(item.createdAt).format('MM-DD HH:mm:ss')
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
}
.wrap .opt-item {
	width: 100%;
	overflow: hidden;
}
.wrap .opt-item .switch-btn {
	width: 30%;
	display: flex;
	justify-content: space-around;
	margin-top: 30upx;
	margin-left: 30upx;
}
.wrap .opt-item .switch-btn > view {
	width: 88upx;
	height: 45upx;
	line-height: 45upx;
	text-align: center;
	color: #808080;
	font-size: 28upx;
	border-radius: 20upx;
}
.switch-btn-s {
	width: 80%;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	margin: 0 auto;
}
.switch-btn-s > view {
	width: 30%;
	height: 45upx;
	line-height: 45upx;
	text-align: center;
	color: #808080;
	font-size: 28upx;
	border-radius: 20upx;
	background-color: #ededed;
	margin-bottom: 15upx;
}
.wrap .opt-item .select {
	color: #fff !important;
	background-color: #6d91ad;
}
.wrap .opt-item .time {
	width: 70%;
	font-size: 24upx;
	display: flex;
	justify-content: space-around;
	margin: 15upx auto;
	color: #808080;
}
.wrap .list {
	width: 100%;
	margin-top: 30upx;
}
.wrap .list .scroll-box {
	width: 100%;
	height: 85vh;
}
.wrap .list .type {
	width: 100%;
	line-height: 66upx;
	display: flex;
	justify-content: space-between;
	padding: 15upx 30upx;
	background-color: #fff;
	font-size: 28upx;
	font-size: 500;
	text-align: center;
	border-bottom: 1px solid #edeff2;
}
.wrap .list .type .show {
	width: 28upx;
	height: 28upx;
	margin-left: 15upx;
}
.wrap .list .type > view {
	width: 20%;
}
.wrap .list .item {
	width: 100%;
	display: flex;
	background-color: #fff;
	justify-content: space-between;
	align-items: center;
	text-align: center;
	border-top: 1px solid #edeff2;
	color: #808080;
	font-size: 22upx;
	text-align: left;
	padding: 15upx 30upx;
	box-sizing: border-box;
}
.wrap .list .item > view {
	width: 33%;
	text-align: left;
}

.wrap .hint {
	width: 100%;
	text-align: center;
	color: #808080;
	margin-top: 15upx;
}
</style>
