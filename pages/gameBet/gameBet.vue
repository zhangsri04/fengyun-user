<template>
	<!--  @tap.stop="hideAllOpt"  -->
	<view class="content">
		<view class="navBarBox">
			<!-- 状态栏占位 -->
			<view class="statusBar" :style="{ paddingTop: statusBarHeight + 'px' }"></view>
			<!-- 真正的导航栏内容 -->
			<view class="navBar">
				<view style="display: flex;align-items: center;" @tap="returnPage">
					<image class="fanhui" src="~@/static/images/fanhui.png" mode="scaleToFill"></image>
					<text>{{ gameInfo.label }}</text>
				</view>
				<view class="flow-info">
					<view style="display: flex;justify-content: space-between;">
						<text>积分: {{ info.money }}</text>
						<text>输赢: {{ info.winMoney }}</text>
					</view>
					<view style="display: flex;justify-content: space-between;">
						<text>回水: {{ info.rebate }}</text>
						<text>流水: {{ info.betMoney }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="wrap">
			<view class="code-info">
				<view class="info-t">
					<view class="l">
						<view style="color: #808080;width: 90upx;">{{ gameInfo.newCode }}</view>
						<view class="time" v-if="gameInfo.status == 3" style="color: #ee8735;font-weight: 500;">正在开奖
						</view>
						<view class="time" v-if="gameInfo.status == 4" style="color: #ee8735;font-weight: 500;">未开始
						</view>
						<view class="time" v-else-if="gameInfo.status == 2" style="color: #bd5655;">封盘中</view>
						<uni-countdown v-else-if="gameInfo.status == 1" :show-day="false" :show-hour="false"
							:font-size="20" style="margin-left: 15upx;" :hour="gameInfo.gameTime.hour"
							:minute="gameInfo.gameTime.minute" :second="gameInfo.gameTime.second"
							:color="gameInfo.color" background-color="#edeff2" />
					</view>
					<view class="opt">
						<image @tap="isVideo = !isVideo" src="~@/static/images/tv.png" mode=""></image>
						<view @tap="clickShowNote">注单</view>
						<view @tap="clickShowDragon">长龙</view>
						<view v-if="enableForecasts" @tap="clickShowForecast">预测</view>
					</view>
				</view>
				<view class="info-b" @tap="clickShowPeriod">
					<view style="color: #808080;width: 90upx;">{{ gameInfo.numbro }}</view>
					<view class="number" style="justify-content: space-between;">
						<view v-for="item in gameInfo.codeArr" class="nub" :class="'nub-bcg' + item">{{ item }}</view>
					</view>
					<view class="note">
						<view style="color: #808080;font-size: 26upx;">冠亚和</view>
						<view v-if="gameInfo.prizeResult">
							{{ gameInfo.prizeResult.guanYaHe }}
							<text :class="[gameInfo.prizeResult.guanYaHeSize == '小' ? 'double-bc1' : 'double-bc2']"
								style="margin: 0 5upx;">
								{{ gameInfo.prizeResult.guanYaHeSize }}
							</text>
							<text
								:class="[gameInfo.prizeResult.guanYaHeOddEven == '单' ? 'double-bc1' : 'double-bc2']">{{ gameInfo.prizeResult.guanYaHeOddEven }}</text>
						</view>
					</view>
					<image src="~@/static/images/show.png" mode=""></image>
				</view>
			</view>
			<view class="details" v-if="showPeriod">
				<view class="line-item">
					<view>期号</view>
					<view style="width: 50%;display: flex;justify-content: space-around;">
						<text>一</text>
						<text>二</text>
						<text>三</text>
						<text>四</text>
						<text>五</text>
						<text>六</text>
						<text>七</text>
						<text>八</text>
						<text>九</text>
						<text>十</text>
					</view>
					<view>冠亚和</view>
					<view>1-5龙虎</view>
				</view>

				<!-- 历史开奖结果 -->
				<scroll-view style="height: 400upx;" :scroll-y="true" enable-flex="true" @scrolltolower="scorllClick"
					@touchmove.stop>
					<view v-for="item in prizeList" class="line-item" v-if="item.prizeResult !== '-1'">
						<view style="color: #808080;margin-left: 15upx;">{{ item.code }}</view>
						<view class="number" style="width: 52%;margin-left: 15upx;">
							<view v-for="val in item.codeArr" class="nub" :class="'nub-bcg' + val">{{ val }}</view>
						</view>
						<view v-if="item.prizeResult" style="width: 12%;text-align: right;">
							{{ item.prizeResult.guanYaHe }}
							<text :class="[item.prizeResult.guanYaHeSize == '小' ? 'double-bc1' : 'double-bc2']"
								style="margin: 0 5upx;">{{ item.prizeResult.guanYaHeSize }}</text>
							<text
								:class="[item.prizeResult.guanYaHeOddEven == '单' ? 'double-bc1' : 'double-bc2']">{{ item.prizeResult.guanYaHeOddEven }}</text>
						</view>
						<view style="width: 17%;display: flex;justify-content: start;">
							<text
								:class="[item.prizeResult.longHuResult[0] == '虎' ? 'double-bc1' : 'double-bc2']">{{ item.prizeResult.longHuResult[0] }}</text>
							<text
								:class="[item.prizeResult.longHuResult[1] == '虎' ? 'double-bc1' : 'double-bc2']">{{ item.prizeResult.longHuResult[1] }}</text>
							<text
								:class="[item.prizeResult.longHuResult[2] == '虎' ? 'double-bc1' : 'double-bc2']">{{ item.prizeResult.longHuResult[2] }}</text>
							<text
								:class="[item.prizeResult.longHuResult[3] == '虎' ? 'double-bc1' : 'double-bc2']">{{ item.prizeResult.longHuResult[3] }}</text>
							<text
								:class="[item.prizeResult.longHuResult[4] == '虎' ? 'double-bc1' : 'double-bc2']">{{ item.prizeResult.longHuResult[4] }}</text>
						</view>
					</view>
					<view class="line-item">数据加载中...</view>
				</scroll-view>
			</view>

			<!-- 开奖视频 -->
			<view class="" style="position: absolute;top: 10%;left: 0;z-index: 1000;">
				<lotteryVideo v-if="isVideo"></lotteryVideo>
			</view>

			<!-- 下注记录 -->
			<!-- <view v-if="showNote" class="details"> -->
			<scroll-view v-if="showNote" class="details" style="height: 400upx;" :scroll-y="true" enable-flex="true"
				@touchmove.stop>
				<view class="" v-for="(item, index) in betList" :key="index">
					<view class="line-period" @tap="expansionBet(index)">
						<view style="display: flex;justify-content: space-between;width: 490upx;">
							<view style="font-size: 32upx;color: #000;">第{{ item.gameNumber }}期</view>
							<view>注单总数: {{ item.count }}注</view>
						</view>
						<view class="number">
							<view v-for="number in item.codeArr" class="nub" :class="'nub-bcg' + number">{{ number }}
							</view>
						</view>
						<view style="position: absolute;right: 0;top: 15upx;text-align: right;">
							<view v-if="item.status === 1" style="color: #6ac0f2;">未结算</view>
							<view v-if="item.status === 2"
								:style="{ color: item.profitTotal > 0 ? '#6ac0f2' : '#ea4025' }">{{ item.profitTotal }}
							</view>
							<view v-if="item.status === 2" style="margin-top: 10upx;">收益</view>
						</view>
					</view>
					<view v-if="item.collect" style="background-color: #f5f5f5;">
						<view class="line-bet" v-for="val in item.betList">
							<view style="text-align: left;width: 45%;">{{ val.betting_Text }}</view>
							<view style="width: 35%;">{{ val.createdAt }}</view>
							<view v-if="val.status === 1">未结算</view>
							<view v-else
								:style="[{ color: val.profit > 0 ? '#6ac0f2' : '#ea4025' }, { 'text-align': 'right' }, { width: '15%' }]">
								{{ val.profit }}
							</view>
						</view>
					</view>
				</view>

				<view class="line-item">数据全部加载完成</view>
			</scroll-view>

			<!-- 长龙 -->
			<scroll-view v-if="showDragon" class="details" style="height: 400upx;" :scroll-y="true" enable-flex="true"
				@touchmove.stop>
				<view class="line-item" style="line-height: 90upx;">
					<view>序号</view>
					<view>位置</view>
					<view>结果</view>
					<view>连期</view>
				</view>
				<view v-for="(item, index) in longArr" class="line-item" style="text-align: center;">
					<view style="width: 30%;">{{ index + 1 }}</view>
					<view style="width: 30%;">{{ item.place }}</view>
					<view style="width: 30%;">{{ item.result }}</view>
					<view style="width: 30%;">{{ item.consecutive }}</view>
				</view>
				<view class="line-item">数据全部加载完成</view>
			</scroll-view>

			<view v-if="showForecast" class="details">
				<table>
					<tr style="line-height: 70upx;">
						<td width="70">名次</td>
						<td colspan="4">本群预测</td>
					</tr>
				</table>

				<!-- 预测 -->
				<scroll-view class="details" style="height: 400upx;" :scroll-y="true" enable-flex="true"
					@touchmove.stop>
					<table>
						<tr v-for="item in forecastArr">
							<td width="70">{{ item.ranking }}</td>
							<td width="100">{{ item.code }}</td>
							<td>
								<view class="item">{{ item.size }}</view>
							</td>
							<td>
								<view class="item" style="background: linear-gradient(#4973f7, #213df5);">
									{{ item.pair }}
								</view>
							</td>
						</tr>
					</table>

					<view class="line-item">数据全部加载完成</view>
				</scroll-view>
			</view>

			<!-- 切换游戏 -->
			<view v-if="!isFast" class="sidebar">
				<image @tap.stop="switchGame" style="height: 70upx;margin-bottom: 30upx;"
					src="~@/static/images/SwitchTable1.png"></image>
				<image @tap.stop="lotteryResult" src="~@/static/images/SwitchTable2.png"></image>
				<image @tap.stop="customerService" src="~@/static/images/SwitchTable3.png"></image>
				<image v-if="enableKeyboard" @tap.stop="startFastBet" src="~@/static/images/SwitchTable4.png"></image>
			</view>
			<view v-if="sidebar" class="sidebar-box" @tap.stop="hideAllOpt">
				<view class="sidebar-list">
					<view class="switch">
						<image src="~@/static/images/switch.png"></image>
						切换游戏
					</view>
					<view class="sidebar-item" v-for="(item, index) in gameList" @tap="startGameBet(item)">
						<image src="~@/static/images/game1.png"></image>
						<view class="">
							<view style="font-size: 32upx;">{{ item.label }}</view>
							<view style="color: #808080;font-size: 24upx;">第{{ item.number }}期</view>
						</view>
						<view class="" style="text-align: center;height: 70upx;">
							<view>距离封盘</view>
							<view class="time" v-if="item.status == 3" style="color: #ee8735;font-weight: 500;">正在开奖
							</view>
							<view class="time" v-if="item.status == 4" style="color: #ee8735;font-weight: 500;">未开始
							</view>
							<view class="time" v-else-if="item.status == 2" style="color: #bd5655;">封盘中</view>
							<uni-countdown style="width: 120upx;" v-else-if="item.status == 1" :show-day="false"
								:font-size="14" :hour="item.gameTime.hour" :minute="item.gameTime.minute"
								:second="item.gameTime.second" />
						</view>
					</view>
				</view>
			</view>

			<fastBet v-on:sendInstruction="fastBetChange" v-if="isFast"></fastBet>
			<view v-else style="height: 100%;">
				<!-- 房间消息 -->
				<scroll-view class="chat"
					:style="{ height: keyboard || operation ? 'calc(100% - 430px)' : 'calc(100% - 150px)' }"
					scroll-y="true" scroll-with-animation="true" :scroll-into-view="scrollToView" @touchmove.stop>
					<!-- :style="{ height: keyboard || operation ? 'calc(100vh - 430px)' : 'calc(100vh - 185px)' }" -->
					<view class="chat-main">
						<!-- <view :class="[msgList.length - 1 === index ? 'last-chat-item' : '', 'chat-ls']" v-for="(item, index) in msgList" :key="index" :id="'msg' + index"> -->
						<view class="chat-ls" v-for="(item, index) in msgList" :key="index" :id="'msg' + index">
							<!-- <view class="chat-time"></view> -->
							<view v-if="item.userVo.userId != useId" class="msg-m msg-left">
								<image class="user-img" :src="item.userVo.avatar"></image>
								<view class="message-l" v-if="item.content">
									<!-- <rich-text :nodes="content"></rich-text> -->
									<rich-text class="msg-text" :nodes="item.content"></rich-text>
								</view>
								<!-- 图像 -->
								<view v-if="item.imgUrl" class="message" @tap="previewImg(item.imgUrl)">
									<!-- 图像 -->
									<image :src="item.imgUrl" style="margin-left: 15rpx;" class="msg-img"
										mode="widthFix" />
								</view>
							</view>
							<view v-else class="msg-m msg-right">
								<image class="user-img" :src="item.userVo.avatar"></image>
								<view class="message-r"><rich-text class="msg-text" :nodes="item.content"></rich-text>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="submit">
					<view class="submit-chat">
						<view class="bt-img" @tap="showKeyboard">
							<image src="~@/static/images/show-key.png"></image>
						</view>
						<!-- <input class="chat-send btn" :value="msg" @focus="stopdefault" @tap="stopdefault" @input="stopdefault"></input> -->
						<view class="chat-send" @tap="showKeyboard">
							{{ command }}
							<view class="cursor-blink"></view>
							<!-- <view v-if="isCursor" class="cursor-blink"></view> -->
						</view>
						<view v-if="command != ''" class="bt-img" @tap="socketSend">
							<image src="~@/static/images/send.png"></image>
						</view>
						<view v-else class="bt-img" @tap="showMenuOperation">
							<image src="~@/static/images/add.png"></image>
						</view>
					</view>
					<view v-if="keyboard">
						<view class="opt">
							<view @tap="change('上分')">上分</view>
							<view @tap="change('取消')">取消</view>
							<view @tap="change('梭哈')">梭哈</view>
							<view @tap="change('重复')">重复</view>
							<view @tap="change('下分')">下分</view>
						</view>
						<view class="keyboard-wrapper">
							<view class="keyboard" v-if="show">
								<view class="line-key">
									<view class="key" @tap="change('大')" :class="[active === 'max' ? 'active' : '']"
										@touchstart="msDown('max')" @touchend="msUp('max')">大</view>
									<view class="key" @tap="change(1)" :class="[active === 1 ? 'active' : '']"
										@touchstart="msDown(1)" @touchend="msUp(1)">1</view>
									<view class="key" @tap="change(2)" :class="[active === 2 ? 'active' : '']"
										@touchstart="msDown(2)" @touchend="msUp(1)">2</view>
									<view class="key" @tap="change(3)" :class="[active === 3 ? 'active' : '']"
										@touchstart="msDown(3)" @touchend="msUp(1)">3</view>
									<view class="key" @tap="del('')" :class="[active === 'del' ? 'active' : '']"
										@longpress="longpress" @touchstart="msDown('del')" @touchend="msUpDel('del')">
										×
									</view>
								</view>
								<view class="line-key">
									<view class="key" @tap="change('小')" :class="[active === 'min' ? 'active' : '']"
										@touchstart="msDown('min')" @touchend="msUp('min')">小</view>
									<view class="key" @tap="change(4)" :class="[active === 4 ? 'active' : '']"
										@touchstart="msDown(4)" @touchend="msUp(4)">4</view>
									<view class="key" @tap="change(5)" :class="[active === 5 ? 'active' : '']"
										@touchstart="msDown(5)" @touchend="msUp(5)">5</view>
									<view class="key" @tap="change(6)" :class="[active === 6 ? 'active' : '']"
										@touchstart="msDown(6)" @touchend="msUp(6)">6</view>
									<view class="key" style="background-color: #f15641;color: #fff;" @tap="change('龙')"
										:class="[active === 'dragon' ? 'active' : '']" @touchstart="msDown('dragon')"
										@touchend="msUp('dragon')">
										龙
									</view>
								</view>
								<view class="line-key">
									<view class="key" @tap="change('单')" :class="[active === 'single' ? 'active' : '']"
										@touchstart="msDown('single')" @touchend="msUp('single')">
										单
									</view>
									<view class="key" @tap="change(7)" :class="[active === 7 ? 'active' : '']"
										@touchstart="msDown(7)" @touchend="msUp(7)">7</view>
									<view class="key" @tap="change(8)" :class="[active === 8 ? 'active' : '']"
										@touchstart="msDown(8)" @touchend="msUp(8)">8</view>
									<view class="key" @tap="change(9)" :class="[active === 9 ? 'active' : '']"
										@touchstart="msDown(9)" @touchend="msUp(9)">9</view>
									<view class="key" style="background-color: #3090f7;color: #fff;" @tap="change('虎')"
										:class="[active === 'tiger' ? 'active' : '']" @touchstart="msDown('tiger')"
										@touchend="msUp('tiger')">
										虎
									</view>
								</view>
								<view class="line-key">
									<view class="key" @tap="change('双')" :class="[active === 'double' ? 'active' : '']"
										@touchstart="msDown('double')" @touchend="msUp('double')">
										双
									</view>
									<view class="key" @tap="change(' ')" :class="[active === 'empty' ? 'active' : '']"
										@touchstart="msDown('empty')" @touchend="msUp('empty')">
										空格
									</view>
									<view class="key" @tap="change(0)" :class="[active === 0 ? 'active' : '']"
										@touchstart="msDown(0)" @touchend="msUp(0)">0</view>
									<view class="key" @tap="change('/')" :class="[active === '/' ? 'active' : '']"
										@touchstart="msDown('/')" @touchend="msUp('/')">/</view>
									<view class="key" style="background-color: #44a040;color: #fff;"
										@tap="change('冠亚和')" :class="[active === '10' ? 'active' : '']"
										@touchstart="msDown('10')" @touchend="msUp('10')">
										冠亚和
									</view>
								</view>
							</view>
						</view>
					</view>
					<view v-if="operation" class="menu-box">
						<view class="menu" @tap="applyRecord">
							<image src="~@/static/images/ico-0.png" mode=""></image>
							<view>申请记录</view>
						</view>
						<view class="menu" @tap="gameRecord">
							<image src="~@/static/images/ico-1.png" mode=""></image>
							<view>游戏记录</view>
						</view>
						<view class="menu" @tap="welfareList">
							<image src="~@/static/images/ico-2.png" mode=""></image>
							<view>福利报表</view>
						</view>
						<view class="menu" @tap="integralList">
							<image src="~@/static/images/ico-3.png" mode=""></image>
							<view>积分账变</view>
						</view>
						<view class="menu" @tap="autoBackwater">
							<image src="~@/static/images/ico-4.png" mode=""></image>
							<view>自助回水</view>
						</view>
						<view class="menu" @tap="contestList">
							<image src="~@/static/images/ico-5.png" mode=""></image>
							<view>竞猜报表</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="tui-actionsheet-class tui-actionsheet" :class="[backwater ? 'tui-actionsheet-show' : '']">
			<view class="tui-tips">自助回水</view>
			<view class="tui-item">
				<view>回水积分</view>
				<view style="color: #6ac0f2;">{{ rebate.money }}</view>
			</view>
			<view class="tui-item">
				<view>可返回</view>
				<view style="color: #6ac0f2;">{{ rebate.rebate }}</view>
			</view>
			<view class="tui-tips" style="margin-bottom: 12rpx" @tap="backwater = false">取消回水</view>
			<view class="tui-actionsheet-btn" hover-class="tui-actionsheet-hover" :hover-stay-time="150"
				@tap="userRebate">确定</view>
		</view>
		<view class="tui-actionsheet-mask" :class="[backwater ? 'tui-mask-show' : '']" @tap="backwater = false"></view>
	</view>
</template>

<script>
	import moment from '../../utils/moment.min.js';
	import {
		WebSocket
	} from '../../sockjs/websocket-uni.js';
	import {
		Stomp
	} from '../../sockjs/stomp.js';
	import fastBet from '@/components/fastBet.vue';
	import lotteryVideo from '@/components/lotteryVideo.vue';
	import actionSheet from '@/components/action-sheet.vue';
	import lotteryCall from '../../common/lotteryCall.js';
	import changlong from '../../common/changlong.js';
	import yuce from '../../common/yuce.js';
	var socketTask = null;
	var initTiem = null;
	var hold = null;
	var timerIds = new Map();
	var gameTimer = new Map();

	//音频播放
	const innerAudioContext = uni.createInnerAudioContext();

	export default {
		components: {
			fastBet,
			lotteryVideo,
			actionSheet
		},
		data() {
			return {
				content: '<p>32564767期已开奖</p><p>中奖名单如下:</p><p>===========</p><p>[经典六边形]积分:2189.23</p><p>第六名[8/776.1]</p><p>第七名[5/485.1]</p><p>[节节高升]积分:406.53冠军[6/48.5]</p><p>[我是水码王]积分:1403.32第四名[9/873.1]</p>',
				pageNo: 0, //页
				pageSize: 10, //条
				gameId: '',
				globalId: '',
				roomId: '',
				useId: '',
				info: '', //统计详情
				isFast: false, //是否显示快捷下注
				showNote: false,
				showPeriod: false,
				showDragon: false,
				showForecast: false,
				isVideo: false,
				sidebar: false,
				keyboard: false,
				isCursor: false, //是否显示光标
				operation: false, //是否显示更多操作
				statusBarHeight: 100, // 状态栏高度
				navBarHeight: 82 + 11, // 导航栏高度
				friendName: 'xpq',
				imgMsg: [],
				scrollToView: '',
				oldTime: new Date(),
				inputh: '60',
				ismore: false,
				voicebg: false,
				pageY: 0,
				command: '', //指令文本消息
				timer: '', //计时器
				vlength: 0,
				show: true,
				active: null,
				result: [],
				gameInfo: {}, //当前游戏详情
				gameList: [], //游戏list
				prizeList: [], //开奖结果list
				betList: [], //下注list
				longArr: [], //长龙list
				forecastArr: [], //预测
				msgList: [], //消息list
				tiemArr: [], //游戏开奖倒计时
				Lastcommand: '', //上一次指令消息
				backwater: false, //是否显示回水
				rebate: '', //回水金额
				enableForecasts: true, //是否显示预测
				enableKeyboard: true //是否显示网投键盘
			};
		},
		created() {
			//获取手机状态栏高度
			this.statusBarHeight = uni.getSystemInfoSync()['statusBarHeight'];
			if (typeof window === 'object') {
				window.WebSocket = uni.webSocketBackup;
			}
			//获取游戏
			this.getGameList();

			//建立sock连接
			this.socketOpen();
		},

		onLoad(options) {
			//读取缓存游戏数据
			let game = uni.getStorageSync('gameInfo');
			let room = uni.getStorageSync('roomInfo');

			this.gameInfo = game;
			this.globalId = game.globalId;
			this.gameId = game.gameId;
			this.roomId = room.roomId;
			this.enableKeyboard = room.enableKeyboard === 1 ? true : false; //是否显示网投键盘
			this.enableForecasts = room.enableForecasts === 1 ? true : false; //是否显示预测
			this.useId = uni.getStorageSync('userInfo').id;

			//获取房间历史消息
			this.getRoomMessage();

			//获取统计
			this.getStatistics();

			//获取开奖结果
			this.getPrizeList();
		},

		onShow() {},

		onHide() {},

		//页面卸载
		onUnload() {
			timerIds.forEach(function(value, key) {
				for (let i = 1; i <= value; i++) {
					clearTimeout(i);
				}
			});

			this.sockDisconnect();
		},

		methods: {
			// 进行图片的预览
			previewImg(imgUrl) {
				// 预览图片
				uni.previewImage({
					current: 0,
					urls: [imgUrl],
					longPressActions: {
						itemList: [],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},

			fastBetChange(data) {
				//更新数据
				// this.command = data;

				this.socketSend(data);
				console.log('快捷下注指令:', data);
			},

			scorllClick() {
				//每次触底增加页数
				this.pageNo += 1;
				this.getPrizeList();
			},

			//获取房间历史消息
			getRoomMessage() {
				const that = this;
				this.$api.getRoomMessage(that.globalId).then(res => {
					const {
						code,
						data,
						message
					} = res;
					if (code === 10200) {
						that.msgList = data;
						that.goBottom();
					} else {
						this.$operate.toast({
							title: message
						});
					}
				});
			},

			//统计数据数据
			getStatistics() {
				const that = this;
				this.$api.getStatistics(that.roomId, that.globalId).then(res => {
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

			//获取用户回水金额
			getRebateMoney() {
				const that = this;
				this.$api
					.getRebateMoney({
						globalId: that.globalId
					})
					.then(res => {
						const {
							code,
							data,
							message
						} = res;
						if (code === 10200) {
							this.rebate = data;
						} else {
							this.$operate.toast({
								title: message
							});
						}
					});
			},

			userRebate() {
				const that = this;
				this.$api
					.userRebate({
						globalId: that.globalId
					})
					.then(res => {
						const {
							code,
							data,
							message
						} = res;
						if (code === 10200) {
							this.backwater = false;

							this.getStatistics();

							this.$operate.toast({
								title: '回水成功'
							});
						} else {
							this.$operate.toast({
								title: message
							});
						}
					});
			},

			//获取开奖结果
			getPrizeList() {
				const that = this;
				const {
					globalId,
					pageNo,
					pageSize
				} = this;
				this.$api
					.getPrizeList({
						globalId,
						pageNo,
						pageSize: pageSize + 40
					})
					.then(res => {
						const {
							code,
							data,
							message
						} = res;
						if (code === 10200) {
							let longArr = [];
							let forecastArr = [];
							let list = data.map((item, index) => {
								let codeArr = item.result ? item.result.split(',') : [];
								//预测
								// forecastArr = index === 1 ? lotteryCall.randomPrediction(codeArr) : forecastArr;

								//长龙
								if (item.result) longArr.push(codeArr.join(','));
								if (item.result && forecastArr.length < 10) forecastArr.push(codeArr.join(
									','));

								codeArr.forEach((item, i) => {
									codeArr[i] = Number(item);
								});
								// console.log(lotteryCall.getPK10Result(codeArr));
								return {
									...item,
									codeArr: codeArr,
									code: item.number ? String(item.number).substr(-5) : '',
									prizeResult: lotteryCall.getPK10Result(codeArr)
								};
							});

							this.longArr = changlong.calculateLongDragonStatistics(longArr);
							this.forecastArr = yuce.randomPredictions(forecastArr);
							this.prizeList = this.prizeList.concat(list);
						} else {
							this.$operate.toast({
								title: message
							});
						}
					});
			},

			//获取下注列表
			getBetList() {
				const that = this;
				const {
					globalId,
					pageNo,
					pageSize,
					roomId
				} = this;
				this.$api
					.getBetList({
						globalId
					})
					.then(res => {
						const {
							code,
							data,
							message
						} = res;
						if (code === 10200) {
							let list = data.map((item, index) => {
								let codeArr = item.gameResult ? item.gameResult.split(',') : [];
								codeArr.forEach((item, i) => {
									codeArr[i] = Number(item);
								});
								let obj = {
									...item,
									codeArr,
									profitTotal: this.accSub(item.winCount, item.betTotal),
									collect: false
								};

								obj.betList = obj.betList.map((val, index) => {
									let betting_Text = '';

									const formattedAmount = val.amount.toFixed(1);

									if (val.isSum === 1) {
										const typeTextMap = {
											101: val.number,
											1: '大',
											2: '小',
											3: '单',
											4: '双'
										};
										betting_Text =
											`冠亚和【${typeTextMap[val.type]}】${formattedAmount}`;
									} else {
										const seatText = val.seat === 1 ? '冠军' : val.seat === 2 ?
											'亚军' : `第${val.seat}名`;
										if (val.type === 101) {
											betting_Text =
												`${seatText}【${val.number}】${formattedAmount}`;
										} else {
											const typeTextMap = {
												1: '大',
												2: '小',
												3: '单',
												4: '双',
												5: '龙',
												6: '虎'
											};
											betting_Text =
												`${seatText}【${typeTextMap[val.type]}】${formattedAmount}`;
										}
									}

									return {
										...val,
										profit: this.accSub(val.winAmount, val.amount),
										betting_Text,
										betList: list,
										createdAt: moment(val.createdAt).format(
											'MM-DD HH:mm:ss')
									};
								});

								return obj;
							});
							this.betList = list;
						} else {
							this.$operate.toast({
								title: message
							});
						}
					});
			},

			//获取游戏列表
			getGameList() {
				const that = this;
				let gameInfo = this.gameInfo;

				this.$api.getGameList().then(res => {
					const {
						code,
						data,
						message
					} = res;
					if (code === 10200) {
						let arr = [];
						let flag = false;
						let gameArr = this.gameList;

						let list = data.map((item, index) => {
							//判断是否需要更新数据
							if (gameArr.length > 0) {
								if (item.number != gameArr[index].number) {
									flag = true;
								} else {
									flag = false;
								}
							} else {
								flag = true;
							}

							let codeArr = item.code ? item.code.split(',') : [];
							codeArr.forEach((item, i) => {
								codeArr[i] = Number(item);
							});

							let gameEndTime = item.end;
							let hour = parseInt((gameEndTime / 60 / 60) % 24);
							let minute = parseInt((gameEndTime / 60) % 60);
							let second = parseInt(gameEndTime % 60);

							item.gameTime = {
								hour,
								minute,
								second
							};

							item.color = '#808080';
							//当前游戏索引判断
							let obj = {};
							if (item.globalId === gameInfo.globalId) {
								let obj = item;
								obj.idx = index;
								obj.codeArr = codeArr;
								obj.numbro = item.number ? String(item.number).substr(-5) : '';
								obj.newCode = item.currentNumber ? String(item.currentNumber).substr(-5) :
									'';
								obj.prizeResult = lotteryCall.getPK10Result(codeArr);

								this.gameInfo = obj;
							}

							return {
								...item,
								codeArr: codeArr
							};
						});

						this.gameList = list;
					} else {
						this.$operate.toast({
							title: message
						});
					}
				});
			},
			//开启游戏倒计时
			updatetTime(item) {
				const that = this;
				let gameInfo = that.gameInfo;
				const cutoffTime = (item.closeDuration + item.settleDuration) * 1000;
				const startTime = item.settleDuration * 1000;
				let time = gameTimer.has(item.globalId) ? gameTimer.get(item.globalId) : cutoffTime; //开奖时间  + 封盘时间

				const now = new Date();
				const timeDifference = new Date(item.closeTime).getTime() - now.getTime() - cutoffTime;

				if (timerIds.has(item.globalId)) {
					for (let i = 1; i <= timerIds.get(item.globalId); i++) {
						clearTimeout(i);
					}
					// clearTimeout(timerIds.get(item.globalId));
					timerIds.delete(item.globalId);
				}

				if (timeDifference < 0) {
					// console.log(item.label + '---------', time);
					if (time <= 0) {
						let gameTime = '1';
						// console.log(item.label + '------游戏结束' + time);
						// const timerId = setTimeout(async () => {
						// 	if (item.gameTime != '1') {
						// 		that.gameList = that.gameList.map((game, index) => {
						// 			return {
						// 				...game,
						// 				gameTime: game.globalId == item.globalId ? gameTime : game.gameTime
						// 			};
						// 		});
						// 	}

						// 	// //当前游戏,定时器时间
						// 	if (that.gameInfo.gameTime != '1' && item.globalId === that.gameInfo.globalId) {
						// 		that.gameInfo.gameTime = gameTime;
						// 	}

						// 	timerIds.set(item.globalId, timerId);
						// 	gameTimer.set(item.globalId, time);
						// 	that.getGameList();
						// }, 1000);
					} else {
						let gameTime = '';
						if (time <= cutoffTime && time > startTime) {
							// console.log(item.label + '------封盘中');
							gameTime = '2';
						}
						if (time <= startTime && time > 0) {
							// console.log(item.label + '------开奖中');
							gameTime = '1';
						}

						this.gameList = this.gameList.map((game, index) => {
							return {
								...game,
								gameTime: game.globalId == item.globalId ? gameTime : game.gameTime
							};
						});

						//当前游戏,定时器时间
						if (item.globalId === this.gameInfo.globalId) {
							this.gameInfo = {
								...gameInfo,
								gameTime: gameTime
							};
						}

						const timerId = setTimeout(() => {
							if (time > 0) time -= 1000;

							// console.log(timerIds.get(item.globalId));
							timerIds.set(item.globalId, timerId);
							gameTimer.set(item.globalId, time);

							that.updatetTime(item);
						}, 1000);
					}
				} else {
					let min = Math.floor(timeDifference / 60000);
					let sec = Math.floor((timeDifference % 60000) / 1000);
					let minutes = min < 10 ? '0' + min : min;
					let seconds = sec < 10 ? '0' + sec : sec;

					const gameTime = `${minutes}:${seconds}`;
					const gameTimes = `${minutes}${seconds}`;
					this.gameList = this.gameList.map((game, index) => {
						return {
							...game,
							gameTime: game.globalId == item.globalId ? gameTime : game.gameTime
						};
					});

					//当前游戏,定时器时间
					if (item.globalId === this.gameInfo.globalId) {
						this.gameInfo = {
							...gameInfo,
							gameTime: gameTimes
						};
					}

					const timerId = setTimeout(() => {
						that.updatetTime(item);
					}, 1000);

					timerIds.set(item.globalId, timerId);
					gameTimer.set(item.globalId, cutoffTime);
				}
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
			},

			calculation(item) {
				let timestamp = item.endTime;
				let forbidTime = item.forbidTime; //封盘时间
				let settleTime = item.settleTime; //开奖时间

				let nowTime = new Date();
				let endTime = new Date(timestamp);
				let t = endTime.getTime() - nowTime.getTime();
				if (t > 0) {
					let day = Math.floor(t / 86400000);
					let hour = Math.floor((t / 3600000) % 24);
					let min = Math.floor((t / 60000) % 60);
					let sec = Math.floor((t / 1000) % 60);

					if (hour <= 0 && min <= 0) {
						if (sec <= settleTime && sec >= 0) {
							return '1';
						} else if (sec <= forbidTime && forbidTime && sec > 0) {
							return '2';
						}
					}

					hour = hour < 10 ? '0' + hour : hour;
					min = min < 10 ? '0' + min : min;
					sec = sec < 10 ? '0' + sec : sec;
					let format = '';
					if (day > 0) {
						format = day + hour + min + sec;
					}
					if (day <= 0 && hour > 0) {
						format = hour + ':' + min + ':' + sec;
					}
					if (day <= 0 && hour <= 0) {
						format = min + ':' + sec;
					}

					return format;
				} else {
					clearInterval(initTiem);
					this.getGameList();
					return '1';
				}
			},

			//连接socket
			socketOpen() {
				let that = this;
				const {
					roomId,
					useId
				} = this;
				const globalId = this.gameInfo.globalId;
				let wsUri = 'ws://106.55.199.100:8000/user-api/ws-app';
				let token = uni.getStorageSync('userInfo').token || '';

				console.log('URL=' + wsUri);

				let headers = {
					token: token,
					userId: useId
				};
				socketTask = Stomp.client(wsUri);
				socketTask.connect(
					headers,
					function(frame) {
						console.log('连接成功');
						socketTask.subscribe('/topic/' + roomId + '/' + globalId, function(response) {
							let gameData = JSON.parse(response.body);
							let list = that.msgList;
							list.push(gameData);
							that.msgList = list;

							that.goBottom();

							//游戏开奖
							if (gameData.typeId === 8) {
								that.pageNo = 0;
								that.prizeList = [];
								that.getPrizeList();
							}
							// console.log('监听房间返回数据', gameData);
						});

						socketTask.subscribe('/private/' + useId, function(response) {
							let resData = JSON.parse(response.body);
							console.log('监听用户返回数据', resData);
							if (resData.code == 10200) {
								//获取统计
								that.getStatistics();
								that.$operate.toast({
									title: resData.message
								});
							} else if (resData.code == 10201) {
								that.getStatistics();

								that.$operate.toast({
									title: resData.message
								});
							} else if (resData.code == 10700) {
								that.getStatistics();

								that.$operate.toast({
									title: resData.message
								});
							} else {
								that.$operate.toast({
									title: resData.message
								});
							}
						});

						socketTask.subscribe('/game', function(response) {
							let resData = JSON.parse(response.body);
							let gameEndTime = resData.end;
							// console.log('监听游戏返回数据' + resData.globalId, resData);
							that.gameList = that.gameList.map((item, index) => {
								let game = item;
								let hour = parseInt((gameEndTime / 60 / 60) % 24);
								let minute = parseInt((gameEndTime / 60) % 60);
								let second = parseInt(gameEndTime % 60);

								if (game.globalId == resData.globalId) {
									game.status = resData.status;
									game.number = resData.currentNumber;
									let codeArr = resData.lastCode ? resData.lastCode.split(',') : [];
									codeArr.forEach((item, index) => {
										codeArr[index] = Number(item);
									});

									game.gameTime = {
										hour,
										minute,
										second
									};
									// console.log(item.label, gameEndTime);
									if (gameEndTime <= 10) {
										game.color = '#c00';
									} else {
										game.color = '#808080';
									}

									let obj = {};
									if (item.globalId === globalId) {
										let obj = item;
										obj.idx = index;
										obj.color = '#808080';
										obj.status = resData.status;
										obj.codeArr = codeArr.length > 0 ? codeArr : obj.codeArr;
										obj.numbro = resData.lastNumber ? String(resData.lastNumber)
											.substr(-5) : obj.numbro;
										obj.newCode = resData.currentNumber ? String(resData
											.currentNumber).substr(-5) : obj.newCode;
										obj.gameTime = {
											hour,
											minute,
											second
										};

										that.gameInfo = obj;
									}
								}
								return {
									...game
								};
							});
						});
					}
				);
			},

			//断开sock连接
			sockDisconnect() {
				socketTask.disconnect(function() {
					console.log('断开连接');
				});
			},

			// 发送消息
			socketSend(fastIns) {
				//fastIns 接收快捷指令文本
				const {
					gameId,
					command,
					roomId,
					gameInfo,
					isFast
				} = this;

				let commandText = isFast ? fastIns : this.validateAndFormatText(command);
				// let commandText = this.validateAndFormatText(command);
				console.log('下注指令:', commandText);

				if (commandText === '禁止聊天') {
					this.$operate.toast({
						title: '禁止聊天'
					});
					return;
				}
				var json = {
					gameId: gameInfo.gameId,
					globalId: gameInfo.globalId,
					roomId: roomId,
					content: isFast ? fastIns : commandText
				};
				this.Lastcommand = command;
				this.command = '';
				this.result = [];
				socketTask.send('/app/chat/message', {}, JSON.stringify(json), function(response) {
					let resData = JSON.parse(response.body);
					console.log('发送数据', resData);
					that.$operate.toast({
						title: resData.message
					});
				});
			},

			validateAndFormatTexts(input) {
				const numberRegex = /^(\d+\/\d+\/(?:梭哈|\d+))$/;
				const dragonTigerRegex = /^((?:\d{1})?[龙虎](?:梭哈|\d+))$/;
				const bigSmallSingleDoubleRegex = /^((?:\d{1})?[大小单双](?:梭哈|\d+))$/;
				const champSumNumberRegex = /^((?:冠亚和|和)(?:3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19)(?:\/梭哈|\/\d+))$/;
				const champSumBigSmallSingleDoubleRegex = /^((?:冠亚和|和)[大小单双](?:梭哈|\d+))$/;
				const upDownPointsRegex = /^((?:上分|下分)(?:\d+))$/;

				if (numberRegex.test(input)) {
					return input;
				} else if (dragonTigerRegex.test(input)) {
					const [_, rank, type, amount] = input.match(/^(\d?)((?:龙|虎))((?:梭哈|\d+))$/);
					if (rank === '') {
						return `1/${type}/${amount}`;
					} else if (parseInt(rank) >= 1 && parseInt(rank) <= 5) {
						return `${rank}/${type}/${amount}`;
					}
				} else if (bigSmallSingleDoubleRegex.test(input)) {
					const [_, rank, type, amount] = input.match(/^(\d?)((?:大|小|单|双))((?:梭哈|\d+))$/);
					if (rank === '') {
						return `1/${type}/${amount}`;
					} else {
						return `${rank}/${type}/${amount}`;
					}
				} else if (champSumNumberRegex.test(input)) {
					const [_, type, number, amount] = input.match(/^(?:(冠亚和|和))(\d+)((?:\/梭哈|\/\d+))$/);
					return `冠亚和/${number}${amount}`;
				} else if (champSumBigSmallSingleDoubleRegex.test(input)) {
					const [_, type, condition, amount] = input.match(/^(?:(冠亚和|和))([大小单双])((?:梭哈|\d+))$/);
					return `冠亚和/${condition}/${amount}`;
				} else if (upDownPointsRegex.test(input)) {
					const [_, type, amount] = input.match(/^(?:(上分|下分))(\d+)$/);
					return `${type}/${amount}`;
				}

				return '禁止聊天';
			},

			validateAndFormatText(input) {
				const numberRegex = /^(\d+\/\d+\/(?:梭哈|\d+))$/;
				const dragonTigerRegex = /^((?:\d{1})?[龙虎](?:梭哈|\d+))$/;
				const bigSmallSingleDoubleRegex = /^((?:\d{1})?[大小单双](?:梭哈|\d+))$/;
				const champSumNumberRegex = /^((?:冠亚和|和)(?:3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19)(?:\/梭哈|\/\d+))$/;
				const champSumNumberWithSplitRegex = /^((?:冠亚和|和)(\d+)(?:\/梭哈|\/\d+))$/;
				const champSumBigSmallSingleDoubleRegex = /^((?:冠亚和|和)[大小单双](?:梭哈|\d+))$/;
				const upDownPointsRegex = /^((?:上分|下分)(?:\d+))$/;
				const cancelPointsRegex = /^((?:取消))$/;
				if (numberRegex.test(input)) {
					return input;
				} else if (dragonTigerRegex.test(input)) {
					const [_, rank, type, amount] = input.match(/^(\d?)((?:龙|虎))((?:梭哈|\d+))$/);
					if (rank === '') {
						return `1/${type}/${amount}`;
					} else if (parseInt(rank) >= 1 && parseInt(rank) <= 5) {
						return `${rank}/${type}/${amount}`;
					}
				} else if (bigSmallSingleDoubleRegex.test(input)) {
					const [_, rank, type, amount] = input.match(/^(\d?)((?:大|小|单|双))((?:梭哈|\d+))$/);
					if (rank === '') {
						return `1/${type}/${amount}`;
					} else {
						return `${rank}/${type}/${amount}`;
					}
				} else if (champSumNumberRegex.test(input)) {
					const [_, type, number, amount] = input.match(/^(?:(冠亚和|和))(\d+)((?:\/梭哈|\/\d+))$/);
					return `冠亚和/${number}${amount}`;
				} else if (champSumBigSmallSingleDoubleRegex.test(input)) {
					const [_, type, condition, amount] = input.match(/^(?:(冠亚和|和))([大小单双])((?:梭哈|\d+))$/);
					return `冠亚和/${condition}/${amount}`;
				} else if (upDownPointsRegex.test(input)) {
					const [_, type, amount] = input.match(/^(?:(上分|下分))(\d+)$/);
					return `${type}/${amount}`;
				} else if (cancelPointsRegex.test(input)) {
					const [_, type, amount] = input.match(/^(?:(取消))$/);
					return `${type}`;
				} else if (champSumNumberWithSplitRegex.test(input)) {
					const [_, type, numberStr, amount] = input.match(/^(?:(冠亚和|和))(\d+)((?:\/梭哈|\/\d+))$/);
					const splitResult = this.canBeSplit(numberStr);
					if (splitResult) {
						return `冠亚和/${splitResult}${amount}`;
					}
				}

				return '禁止聊天';
			},

			canBeSplit(input, index = 0, splitNumbers = []) {
				const numbers = [11, 3, 4, 18, 19, 5, 6, 16, 17, 7, 8, 14, 15, 9, 10, 12, 13];
				if (index === input.length) {
					return splitNumbers.join(',');
				}

				let currentNumber = 0;
				for (let i = index; i < input.length; i++) {
					currentNumber = currentNumber * 10 + parseInt(input[i]);

					if (numbers.includes(currentNumber)) {
						splitNumbers.push(currentNumber);
						const result = this.canBeSplit(input, i + 1, splitNumbers);
						if (result) {
							return result;
						}
						splitNumbers.pop();
					}
				}

				return false;
			},

			//切换游戏
			startGameBet(item) {
				//缓存游戏数据
				uni.setStorageSync('gameInfo', item);

				this.$routr({
					url: '/pages/gameBet/gameBet',
					type: 'redirectTo',
					login: false
				});
			},

			//用户操作隐藏
			hideAllOpt() {
				this.sidebar = false;
			},

			//切换游戏
			switchGame() {
				this.sidebar = true;
				this.keyboard = false;

				this.getGameList();
			},

			//结果查询
			lotteryResult() {
				window.open('http://www.186kai.com/');
			},

			//在线客服
			customerService() {
				this.$routr({
					url: '/pages/customerService/customerService',
					type: 'navigateTo',
					login: false
				});
			},

			//直接下注
			startFastBet() {
				this.isFast = true;
				// this.$routr({
				// 	url: '/pages/fastBet/fastBet',
				// 	type: 'navigateTo',
				// 	login: false
				// });
			},

			// 是否显示注单
			clickShowNote() {
				this.showNote = !this.showNote;
				this.showDragon = false;
				this.showForecast = false;
				this.showPeriod = false;
				this.betList = [];

				//获取下注记录
				if (this.showNote) return this.getBetList();
			},

			//展开注单记录
			expansionBet(idx) {
				let arr = this.betList;
				this.betList = arr.map((val, index) => {
					return {
						...val,
						collect: idx === index ? !val.collect : false
					};
				});
			},

			//是否显示长龙
			clickShowDragon() {
				this.showNote = false;
				this.showDragon = !this.showDragon;
				this.showForecast = false;
				this.showPeriod = false;
			},

			// 是否显示预测
			clickShowForecast() {
				this.showNote = false;
				this.showDragon = false;
				this.showForecast = !this.showForecast;
				this.showPeriod = false;
			},

			clickShowPeriod() {
				this.showNote = false;
				this.showDragon = false;
				this.showForecast = false;
				this.showPeriod = !this.showPeriod;

				if (this.showPeriod) return this.getPrizeList();
			},

			returnPage() {
				//快捷指令面板判断
				if (this.isFast) {
					this.isFast = false;
				} else {
					// let canNavBack = getCurrentPages();
					// if (canNavBack && canNavBack.length > 1) {
					// 	uni.navigateBack();
					// } else {
					// 	history.back();
					// }
					this.$routr({
						url: '/pages/index/index',
						type: 'redirectTo',
						login: false
					});
				}
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

			//自助回水
			autoBackwater() {
				this.backwater = true;

				//获取回水
				this.getRebateMoney();
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
			},

			//键盘相关操作
			msDown(v) {
				this.active = v;
			},

			msUp(v) {
				this.active = '';
			},

			stopInput() {
				return false;
			},

			change(val, $event) {
				let arr = this.result;
				if (val === '重复') {
					this.command = this.Lastcommand;

					return;
				}
				arr.push(val);
				this.result = arr;
				this.command = arr.join('');
			},

			del() {
				this.result.pop();
				this.command = this.result.join('');
				this.$emit('del', this.command);
			},

			longpress() {
				const that = this;
				clearInterval(hold);
				hold = setInterval(() => {
					that.result.pop();
					that.result = [];
					that.command = '';
					// that.command = this.result.join('');
					that.$emit('del', this.command);
				}, 800);
			},

			msUpDel() {
				this.active = '';
				clearInterval(hold);
			},
			//显示隐藏键盘
			showKeyboard() {
				this.keyboard = !this.keyboard;
				this.operation = false;
				this.isCursor = !this.isCursor;

				this.goBottom();
			},

			//显示更多操作
			showMenuOperation() {
				this.keyboard = false;
				this.isCursor = false;
				this.operation = !this.operation;
			},

			//获取高度方法
			getElementHeight() {
				const query = uni.createSelectorQuery().in(this);
				query
					.select('.submit')
					.boundingClientRect(data => {
						this.$emit('heights', data.height);
					})
					.exec();
			},

			// 输入框聚焦
			focus() {
				//关闭其他项
				this.isemoji = false;
				this.ismore = false;
				setTimeout(() => {
					this.getElementHeight();
				}, 10);
			},

			//屏蔽键盘
			stopdefault() {
				uni.hideKeyboard(); //屏蔽默认键盘弹出；
			},

			//输入框高度
			heights(e) {
				console.log('高度:', e);
				this.inputh = e;
				this.goBottom();
			},

			// 滚动到底部
			goBottom() {
				this.scrollToView = '';
				this.$nextTick(function() {
					this.scrollToView = 'msg' + (this.msgList.length - 1);
				});
			}
		}
	};
</script>

<style lang="scss">
	// page {
	// 	height: calc(100% - 44px);
	// 	height: calc(100% - 44px - constant(safe-area-inset-top));
	// 	height: calc(100% - 44px - env(safe-area-inset-top));
	// }
	.content {
		width: 100%;
		height: 100%;
		height: calc(100% - 44px);
		height: calc(100% - 44px - constant(safe-area-inset-top));
		height: calc(100% - 44px - env(safe-area-inset-top));
		position: fixed;
		top: 0;
	}

	.navBarBox .statusBar {
		background-color: #5285a6;
	}

	.navBarBox .navBar {
		height: 100upx;
		padding: 3upx 30upx;
		padding-bottom: 8upx;
		display: flex;
		flex-direction: row;
		color: #fff;
		justify-content: space-between;
		align-items: center;
		background-color: #5285a6;
	}

	.navBarBox .navBar .fanhui {
		width: 30upx;
		height: 30upx;
		margin-right: 10upx;
	}

	.navBarBox .navBar .flow-info {
		width: 65%;
		height: 100%;
		display: flex;
		flex-flow: column;
		font-size: 28upx;
		position: relative;
		top: 15upx;
	}

	.navBarBox .navBar .flow-info text {
		display: inline-block;
		width: 50%;
		text-align: left;
	}

	.wrap {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.wrap .code-info {
		width: 100%;
		background-color: #fff;
		padding: 15upx;
		box-sizing: border-box;
		z-index: 1;
		position: relative;
	}

	.wrap .code-info .info-t {
		width: 100%;
		height: 72upx;
		line-height: 72upx;
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid #edeff2;
	}

	.wrap .code-info .info-t .l {
		display: flex;
		justify-content: start;
		align-items: center;
	}

	.wrap .code-info .info-t .time {
		width: 170upx;
		line-height: 70upx;
		display: flex;
		justify-content: start;
		align-items: center;
		margin-left: 30upx;
	}

	.wrap .code-info .info-t .time>view {
		width: 35upx;
		height: 45upx;
		text-align: center;
		line-height: 45upx;
		font-size: 32upx;
		color: #808080;
		background-color: #edeff2;
		box-sizing: border-box;
		border-radius: 10upx;
		margin-right: 5upx;
	}

	.wrap .code-info .opt {
		width: 400upx;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.wrap .code-info .opt>image {
		width: 50upx;
		height: 50upx;
	}

	.wrap .code-info .opt>view {
		width: 90upx;
		height: 50upx;
		line-height: 50upx;
		text-align: center;
		color: #fff;
		border-radius: 10upx;
		background-color: #85b3d8;
	}

	.wrap .code-info .info-b {
		width: 100%;
		height: 72upx;
		line-height: 72upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.wrap .code-info .info-b>image {
		width: 32upx;
		height: 32upx;
	}

	.wrap .number {
		width: 62%;
		display: flex;
		// justify-content: space-between;
	}

	.wrap .number>view {
		display: inline-block;
		width: 40upx;
		height: 40upx;
		line-height: 40upx;
		text-align: center;
		color: #f7f7f7;
		text-shadow: 1upx 1upx 1upx #000;
		border-radius: 3upx;
	}

	.wrap .code-info .info-b .note {
		width: 120upx;
		height: 60upx;
		line-height: 36upx;
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: center;
	}

	.wrap .game-list .item .item-b .number>view {
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
		background-color: #fff90a;
	}

	.nub-bcg2 {
		background-color: #118af5;
	}

	.nub-bcg3 {
		background-color: #4b4b4b;
	}

	.nub-bcg4 {
		background-color: #ff9006;
	}

	.nub-bcg5 {
		background-color: #81fefe;
	}

	.nub-bcg6 {
		background-color: #5001fe;
	}

	.nub-bcg7 {
		background-color: #e3e3e3;
	}

	.nub-bcg8 {
		background-color: #fc0203;
	}

	.nub-bcg9 {
		background-color: #760001;
	}

	.nub-bcg10 {
		background-color: #23c303;
	}

	.double-bc1 {
		color: #5b7ff3;
	}

	.double-bc2 {
		color: #ea4025;
	}

	.wrap .details {
		width: 100%;
		background-color: #fff;
		border-top: 1upx solid #dcdcdc;
		position: absolute;
		z-index: 100;
	}

	.wrap .line-item {
		line-height: 56upx;
		display: flex;
		justify-content: space-around;
		color: #808080;
		font-size: 26upx;
		align-items: center;
		border-top: 1upx solid #dcdcdc;
	}

	/* 注单列表 */
	.wrap .line-period {
		width: 90%;
		// height: 100upx;
		// display: flex;
		// justify-content: space-between;
		color: #808080;
		font-size: 26upx;
		align-items: center;
		margin: 0 auto;
		position: relative;
		padding: 15upx 0;
		box-sizing: border-box;
	}

	.wrap .line-bet {
		width: 90%;
		display: flex;
		justify-content: space-between;
		line-height: 75upx;
		color: #808080;
		font-size: 26upx;
		align-items: center;
		border-top: 1upx solid #dcdcdc;
		margin: 0 auto;
	}

	.wrap .line-bet>view {
		text-align: left;
	}

	.wrap .details table {
		width: 100%;
		border-collapse: collapse;
		background: #fff;
		color: #808080;
		font-size: 26upx;
	}

	.wrap .details table tr {
		border-bottom: 1px solid #ccc;
	}

	.wrap .details table td {
		height: 60upx;
		vertical-align: middle;
		border-right: 1px solid #ccc;
		text-align: center;
	}

	.wrap .details table td>.item {
		width: 40upx;
		height: 45upx;
		line-height: 45upx;
		background: linear-gradient(#ee5b51, #741106);
		color: #fff;
		margin: 0 auto;
		border-radius: 10upx;
	}

	.wrap .sidebar {
		width: 88upx;
		position: absolute;
		top: 15%;
		right: 0;
		z-index: 10;
	}

	.wrap .sidebar>image {
		display: block;
		width: 88upx;
		height: 88upx;
		margin-bottom: 15upx;
	}

	.wrap .sidebar-box {
		width: 100%;
		height: 100vh;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 100;
	}

	.wrap .sidebar-list {
		width: 60%;
		height: 75vh;
		background-color: #fff;
		position: absolute;
		top: 12%;
		right: 0;
		border-radius: 20upx 0 0 20upx;
	}

	.wrap .sidebar-list .switch {
		width: 100%;
		height: 80upx;
		line-height: 80upx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #75c2f6;
		font-size: 32upx;
		border-bottom: 1upx solid #ccc;
	}

	.wrap .sidebar-list .switch>image {
		width: 60upx;
		height: 60upx;
		margin-right: 15upx;
	}

	.wrap .sidebar-list .sidebar-item {
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 30upx 15upx;
		text-align: left;
		font-size: 26upx;
		border-bottom: 1upx solid #ccc;
	}

	.sidebar-item>image {
		width: 80upx;
		height: 70upx;
	}

	.wrap .chat {
		height: 100%;
		// position: relative;
		// padding-bottom: env(safe-area-inset-bottom);
		// padding-bottom: constant(safe-area-inset-bottom);
		// padding-bottom: env(safe-area-inset-bottom);
		position: fiexd;
		z-index: 10;
	}

	.wrap .chat .chat-main {
		// height: 100%;
		// box-sizing: border-box;
		// padding-left: 32upx;
		// padding-right: 32upx;
		// padding-bottom: 120upx;
		// display: flex;
		// z-index: 100;
		// flex-direction: column;
		padding-left: 32rpx;
		padding-right: 32rpx;
		padding-top: 20rpx;
		padding-bottom: 120rpx; //获取动态高度
		display: flex;
		flex-direction: column;
	}

	.chat-main .last-chat-item {
		padding-bottom: 60upx;
	}

	.wrap .chat .chat-ls .chat-time {
		font-size: 24upx;
		color: rgba(39, 40, 50, 0.3);
		line-height: 34upx;
		padding: 10upx 0upx;
		text-align: center;
	}

	.wrap .chat .chat-ls .msg-m {
		display: flex;
		padding: 20upx 0;
	}

	.wrap .chat .chat-ls .msg-m .user-img {
		flex: none;
		width: 80upx;
		height: 80upx;
		border-radius: 20upx;
	}

	.wrap .chat .chat-ls .msg-m .msg-text {
		font-size: 32upx;
		color: #272832;
		// line-height: 44upx;
		padding: 15upx 0;
		display: inline-block;
	}

	.wrap .chat .chat-ls .msg-m .msg-img {
		max-width: 400upx;
		border-radius: 20upx;
	}

	.wrap .chat .chat-ls .msg-m .msg-map {
		background: #fff;
		width: 464upx;
		height: 284upx;
		overflow: hidden;
	}

	.wrap .chat .chat-ls .msg-m .msg-map .map-name {
		font-size: 32upx;
		color: #272832;
		line-height: 44upx;
		padding: 18upx 24upx 0 24upx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	.wrap .chat .chat-ls .msg-left {
		flex-direction: row;
	}

	.wrap .chat .chat-ls .msg-left .message-l {
		flex: none;
		max-width: 480upx;
		margin-left: 16upx;
		background-color: #fff;
		padding: 10upx 15upx;
		border-radius: 0upx 20upx 20upx 20upx;
	}

	.wrap .chat .chat-ls .msg-left .msg-text {}

	.wrap .chat .chat-ls .msg-left .ms-img {
		margin-left: 16upx;
	}

	.wrap .chat .chat-ls .msg-right {
		flex-direction: row-reverse;
	}

	.wrap .chat .chat-ls .msg-right .message-r {
		flex: none;
		max-width: 480upx;
		margin-right: 16upx;
		background-color: #fff;
		padding: 10upx 15upx;
		border-radius: 20upx 0upx 20upx 20upx;
	}

	.wrap .chat .chat-ls .msg-right .msg-text {
		margin-right: 16upx;
		// background-color: #a2e575;
		border-radius: 20upx 0upx 20upx 20upx;
	}

	.wrap .chat .chat-ls .msg-right .ms-img {
		margin-right: 16upx;
	}

	.wrap .chat .chat-ls .msg-right .msh-map {
		margin-left: 16upx;
		border-radius: 20upx 0upx 20upx 20upx;
	}

	.wrap .chat .chat-ls .msg-right .voice {
		text-align: left;
	}

	.wrap .chat .chat-ls .msg-right .voice-img {
		float: right;
		padding: 4upx;
		width: 28upx;
		height: 36upx;
	}

	.wrap .submit {
		background: #fff;
		border-top: 1px solid rgba(39, 40, 50, 0.1);
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: 100;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.wrap .submit .displaynone {
		display: none;
	}

	.wrap .submit .submit-chat {
		width: 100%;
		display: flex;
		align-items: flex-end;
		box-sizing: border-box;
		padding: 14upx 14upx;
	}

	.wrap .submit .submit-chat .bt-img>image {
		width: 52upx;
		height: 52upx;
		margin: 5upx 10upx;
		flex: auto;
		vertical-align: middle;
	}

	.wrap .submit .submit-chat .chat-send {
		width: 620upx;
		min-height: 60upx;
		font-size: 32upx;
		line-height: 60upx;
		border: 1upx solid #dcdcdc;
		background-color: #f4f4f4;
		padding: 0 15rpx;
		box-sizing: border-box;
		word-wrap: break-word;
		overflow: hidden;
	}

	.wrap .submit .opt {
		width: 80%;
		display: flex;
		justify-content: space-between;
		margin: 15upx auto;
		color: #808080;
		font-size: 32upx;
	}

	.wrap .submit .menu-box {
		display: flex;
		justify-content: start;
		flex-wrap: wrap;
		align-items: center;
		width: 100%;
		height: 500upx;
		background-color: #f5f5f5;
		margin: 0;
		padding: 15upx 30upx;
	}

	.menu-box .menu {
		width: 25%;
		text-align: center;
	}

	.wrap .submit .menu-box .menu>image {
		width: 120upx;
		height: 120upx;
	}

	//jianpan
	.wrap .submit .keyboard-wrapper {
		width: 100%;
		background-color: #dcdcdc;
		z-index: 100;
		padding: 10upx;
		// position: absolute;
		// bottom: 0;
	}

	.wrap .submit .keyboard-wrapper .keyboard .line-key {
		height: 100%;
		display: flex;
		justify-content: space-between;
		margin-bottom: 10upx;
	}

	.wrap .submit .keyboard-wrapper .keyboard .line-key .key {
		width: 135upx;
		height: 95upx;
		line-height: 95upx;
		border-radius: 10upx;
		font-size: 42upx;
		vertical-align: middle;
		color: #808080;
		background-color: #fff;
		text-align: center;
		cursor: pointer;
	}

	.wrap .submit .keyboard-wrapper .keyboard .line-key .active {
		background: #ccc !important;
	}

	.cursor-blink {
		display: inline-block;
		width: 1px;
		height: 38upx;
		animation: blink 1s infinite steps(1, start);
		margin: 0 10rpx;
		position: relative;
		top: 8upx;
	}

	@keyframes blink {

		0%,
		100% {
			background-color: #000;
			color: #aaa;
		}

		50% {
			background-color: #f4f4f4;
			/* not #aaa because it's seem there is Google Chrome bug */
			color: #000;
		}
	}
</style>
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