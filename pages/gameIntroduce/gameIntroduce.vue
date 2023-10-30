<template>
	<view class="wrap">
		<view class="title">房间介绍:</view>
		<view>
			<view class="title" style="text-align: center;">幸运飞艇</view>
			<view class="content"><img src="~@/static/images/racingRule.png" alt="" /></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {}
};
</script>

<style>
.wrap {
	width: 100%;
	height: 100vh;
	background-color: #efefef;
}

.wrap .title {
	width: 90%;
	height: 75upx;
	line-height: 75upx;
	font-size: 32upx;
	background-color: rgba(245, 245, 245, 0.9);
	border: 1px solid #f5f5f5;
	padding-left: 30upx;
	border-radius: 20upx;
	margin: 30upx auto;
}

.wrap .content {
	width: 90%;
	height: 90vh;
	overflow: auto;
	margin: 0 auto;
	margin-top: -30upx;
	background-color: #fff;
	overflow-y: auto;
}

.wrap .content > img {
	width: 100%;
}
</style>
