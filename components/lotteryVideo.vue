<template>
	<view><iframe id="iframe" :style="{ width: 100 + 'vw', height: 270 + 'px', border: 'none' }" :src="typeUrl" ref="iframe"></iframe></view>
</template>

<script>
export default {
	name: 'lotteryVideo',
	data() {
		return {
			typeUrl: 'https://kj.kjose122.com/view/video/PK10/video.html?10037?www.1682018.co',
			frameHeight: getApp().globalData.windowHeight
		};
	},
	methods: {
		receiveMessage(arg) {
			console.log('接收到renderjs回传的消息', arg);
			// const action = data.data.data.arg.action;
			// console.log('收到消息 arg', data.data.data.arg);
			const action = arg.action;
			console.log(' 收到消息action', action);

			if (action == 'back') {
				this.back();
			} else if (action == 'share') {
				this.uniShare(arg);
			} else if (action == 'LANDSCAPE') {
				// #ifdef APP-PLUS
				plus.screen.lockOrientation('landscape');
				this.$nextTick(() => {
					this.frameHeight = getApp().globalData.windowWidth;
					this.frameWidth = getApp().globalData.windowHeight;
				});
				// #endif
			} else if (action == 'PORTRAIT') {
				// #ifdef APP-PLUS
				plus.screen.lockOrientation('portrait-primary');
				this.$nextTick(() => {
					this.frameHeight = getApp().globalData.windowHeight;
					this.frameWidth = getApp().globalData.windowWidth;
				});

				// #endif
			}
		},
		back() {
			// 如果是H5,并且路由只有一级，为了避免返回不了首页
			// #ifdef H5
			const currentPages = getCurrentPages();
			if (currentPages.length === 1) {
				uni.reLaunch({
					url: '/pages/home/index'
				});
			} else {
				uni.navigateBack();
			}
			// #endif
			// #ifdef APP-PLUS
			uni.navigateBack();
			// #endif
		}
	}
};
</script>

<style lang="scss"></style>
