<template>
	<view class="wrap">
		<view class="opt-item">
			<view class="switch-btn">
				<view :class="[welfareInx == index ? 'select' : '']" v-for="(item, index) in welfare"
					@click="clickWelfare(index)">{{ item.name }}</view>
			</view>
		</view>
		<scroll-view v-if="list.length > 0" class="list" scroll-y="true" scroll-with-animation="true">
			<view class="item" v-for="(item, index) in list">
				<view class="item-name">
					<view style="color: #000;font-weight: 500;" v-if="item.tranTypeId === 6">彩票回水</view>
					<view style="color: #000;font-weight: 500;" v-if="item.tranTypeId === 8">佣金</view>
					<view style="color: #000;font-weight: 500;" v-if="item.tranTypeId === 11">红包</view>
					<view>{{ item.createdAt }}</view>
				</view>
				<view>{{ item.gameName }}</view>
				<view style="text-align: right;">
					<view style="color: #cec19b;">{{ item.amount }}</view>
					<view>余额 {{ item.prePoints }}</view>
				</view>
			</view>
		</scroll-view>
		<view v-else class="hint">暂无记录</view>
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
				welfareInx: 0,
				welfare: [{
						name: '全部',
						type: 30
					},
					{
						name: '佣金',
						type: 8
					},
					{
						name: '红包',
						type: 11
					},
					{
						name: '回水',
						type: 6
					}
				],
				startTime: '',
				endTime: ''
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
			//点击游戏
			clickWelfare(i) {
				this.welfareInx = this.welfareInx === i ? '' : i;
				this.gettTransactionList();
			},
			//获取申请记录
			gettTransactionList() {
				const that = this;
				const {
					pageNo,
					pageSize,
					roomId,
					welfare,
					welfareInx,
					startTime,
					endTime
				} = this;
				this.$api
					.gettTransactionList({
						start: startTime,
						end: endTime,
						pageNo,
						pageSize,
						roomId,
						type: welfare[welfareInx].type
					})
					.then(res => {
						const {
							code,
							data,
							message
						} = res;
						if (code === 10200) {
							let list = data.map((item, index) => {
								return {
									...item,
									createdAt: moment(item.createdAt).format('MM月DD日 HH:mm')
								};
							});
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
		background-color: #fff;
		overflow: hidden;
	}

	.wrap .opt-item .switch-btn {
		width: 90%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-top: 30rpx;
		margin-left: 30rpx;
	}

	.wrap .opt-item .switch-btn>view {
		height: 45rpx;
		line-height: 45rpx;
		text-align: center;
		color: #808080;
		font-size: 28rpx;
		border-radius: 20rpx;
		padding: 0 30rpx;
		margin-right: 30rpx;
		margin-bottom: 15rpx;
		background-color: #ededed;
	}

	.wrap .opt-item .switch-btn .select {
		color: #fff !important;
		background-color: #6d91ad;
	}

	.wrap .list {
		width: 100%;
		height: 85vh;
		margin-top: 30rpx;
		box-sizing: border-box;
	}

	.wrap .list .item {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		align-items: flex-end;
		font-size: 30rpx;
		color: #808080;
		padding: 15rpx 30rpx;
		border-top: 1px solid #edeff2;
	}

	.wrap .hint {
		width: 100%;
		text-align: center;
		color: #808080;
		margin-top: 15rpx;
	}
</style>