<template>
	<view>
		<view class="tui-actionsheet-class tui-actionsheet" :class="[show ? 'tui-actionsheet-show' : '']">
			<view class="tui-tips">自助回水</view>
			<view class="tui-item">
				<view>回水积分</view>
				<view style="color: #6ac0f2;">2.9</view>
			</view>
			<view class="tui-item">
				<view>可返回</view>
				<view style="color: #6ac0f2;">1.00</view>
			</view>
			<view class="tui-tips" style="margin-bottom: 12rpx">取消回水</view>
			<view class="tui-actionsheet-btn" hover-class="tui-actionsheet-hover" :hover-stay-time="150">确定</view>
		</view>
		<view class="tui-actionsheet-mask" :class="[show ? 'tui-mask-show' : '']" @tap="handleClickMask"></view>
	</view>
</template>

<script>
export default {
	name: 'tuiActionsheet',
	data() {
		return {
			maskClosable: {
				type: Boolean,
				default: true
			},
			//显示操作菜单
			show: {
				type: Boolean,
				default: false
			},
			//提示文字
			tips: {
				type: String,
				default: ''
			},
			//提示文字颜色
			color: {
				type: String,
				default: '#9a9a9a'
			},
			//提示文字大小 rpx
			size: {
				type: Number,
				default: 26
			},
			//是否需要取消按钮
			isCancel: {
				type: Boolean,
				default: true
			},
			itemList: [
				{
					text: '红包节点',
					color: '#333'
				},
				{
					text: '广告节点',
					color: '#333'
				}
			]
		};
	},
	methods: {
		handleClickMask() {
			if (!this.maskClosable) return;
			this.handleClickCancel();
		},
		handleClickItem(e) {
			if (!this.show) return;
			const dataset = e.currentTarget.dataset;
			this.$emit('click', {
				index: dataset.index
			});
		},
		handleClickCancel() {
			this.$emit('chooseCancel');
		}
	}
};
</script>

<style>
.tui-actionsheet {
	width: 100%;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 9999;
	visibility: hidden;
	transform: translate3d(0, 100%, 0);
	transform-origin: center;
	transition: all 0.3s ease-in-out;
	background: #eaeaec;
	min-height: 100rpx;
}

.tui-actionsheet-show {
	transform: translate3d(0, 0, 0);
	visibility: visible;
}

.tui-tips {
	width: 100%;
	padding: 30rpx 60rpx;
	box-sizing: border-box;
	text-align: center;
	background: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #808080;
	border-bottom: 1px solid #edeff2;
}

.tui-item {
	width: 100%;
	padding: 30rpx;
	box-sizing: border-box;
	text-align: center;
	background: #fff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1px solid #edeff2;
}

.tui-actionsheet-btn {
	width: 100%;
	height: 100rpx;
	background: #fff;
	color: #6ac0f2;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	font-size: 36rpx;
	position: relative;
	padding-bottom: env(safe-area-inset-bottom);
}

.tui-actionsheet-divider::before {
	content: '';
	width: 100%;
	border-top: 1rpx solid #d9d9d9;
	position: absolute;
	top: 0;
	left: 0;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
}
.tui-actionsheet-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.6);
	z-index: 9996;
	transition: all 0.3s ease-in-out;
	opacity: 0;
	visibility: hidden;
}

.tui-mask-show {
	opacity: 1;
	visibility: visible;
}
</style>
