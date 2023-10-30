<script>
	export default {
		onLaunch: function() {
			//背景音乐播放
			this.bgmMusic = uni.createInnerAudioContext();
			this.bgmMusic.autoplay = false; //自动播放
			this.bgmMusic.loop = true; //循环播放
			this.bgmMusic.src =
				'https://jt-asia11.guojilx.com/jianghu/ganghoodwap/V0.5.3/res/GameSound/bgMusic.mp3'; //背景音乐地址
			this.bgmMusic.volume = 0.3; //音量
		},

		onLoad() {

		},

		onShow: function() {

		},
		onHide: function() {
			// console.log('App Hide');
		}
	};
</script>

<style>
	/*每个页面公共css */
	@import 'static/css/main.css';
	@import 'static/css/icon.css';
	@import 'static/css/custom.css';
</style>