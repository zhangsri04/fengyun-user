<template>
	<view class="wrap">
		<!-- 		<view class="opt-item">
			<view class="switch-btn">
				<view class="select">今日</view>
				<view>昨日</view>
			</view>
			<view class="time">
				<view>2030-04-02 06:00:00</view>
				-
				<view>2030-04-02 06:00:00</view>
			</view>
		</view> -->
		<view class="list" v-if="list.length > 0">
			<view class="type">
				<view>所有</view>
				<view>时间</view>
				<view>积分</view>
				<view>状态</view>
			</view>
			<scroll-view class="scroll-box" scroll-y="true" scroll-with-animation="true">
				<view class="item" v-for="item in list">
					<view style="color: #5985c1;">{{ item.tranTypeId === 1 ? '上分' : '下分' }}</view>
					<view style="line-height: 36upx;margin-top:10upx">{{ item.createdAt }}</view>
					<view style="color: #5985c1;">{{ item.amount }}</view>
					<view v-if="item.status == 0">申请</view>
					<view style="color: #5985c1;" v-if="item.status == 1">通过</view>
					<view style="color: #8b4756;" v-if="item.status == 2">拒绝</view>
				</view>
			</scroll-view>
		</view>
		<view v-else class="hint">暂无记录</view>
	</view>
</template>

<script>
import moment from '../../utils/moment.min.js';
export default {
	data() {
		return {
			pageNo: 0, //页
			pageSize: 100000, //条
			roomId: '',
			startTime: '',
			endTime: '',
			list: []
		};
	},
	onLoad() {
		let room = uni.getStorageSync('roomInfo');
		this.roomId = room.roomId;

		let now = moment(new Date());
		let ming = moment(new Date()).add(1, 'days');

		let nowTime = now.format('YYYY-MM-DD 06:00:00');
		let mingTime = ming.format('YYYY-MM-DD 06:00:00');

		this.startTime = moment(nowTime).valueOf();
		this.endTime = moment(mingTime).valueOf();

		//获取统计数据
		this.gettTransactionList();
	},
	methods: {
		//获取申请记录
		gettTransactionList() {
			const that = this;
			const { pageNo, pageSize, roomId, startTime, endTime } = this;
			this.$api
				.gettTransactionList({
					start: startTime,
					end: endTime,
					pageNo,
					pageSize,
					roomId,
					type: 20
				})
				.then(res => {
					const { code, data, message } = res;
					if (code === 10200) {
						let list = data.map((item, index) => {
							return {
								...item,
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
	background-color: #fff;
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
.wrap .opt-item .switch-btn .select {
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
.wrap .scroll-box {
	box-sizing: border-box;
	width: 100%;
	height: 85vh;
}
.wrap .scroll-box:last-child {
	margin-bottom: 30rpx;
}
.wrap .list .type {
	width: 100%;
	line-height: 66upx;
	display: flex;
	background-color: #fff;
	justify-content: space-around;
	margin: 0 auto;
	font-size: 32upx;
	font-size: 500;
	text-align: center;
}
.wrap .list .type > view {
	width: 20%;
}
.wrap .list .item {
	width: 100%;
	height: 80upx;
	line-height: 80upx;
	display: flex;
	justify-content: space-around;
	text-align: center;
	border-top: 1px solid #edeff2;
	background-color: #fff;
}
.wrap .list .item > view {
	width: 20%;
	color: #808080;
}

.wrap .hint {
	width: 100%;
	text-align: center;
	color: #808080;
	margin-top: 15upx;
}
</style>
