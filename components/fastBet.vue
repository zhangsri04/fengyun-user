<template>
	<view class="wrap">
		<view class="productNav" :style="{ height: keyboard ? 'calc(100% - 470px)' : 'calc(100% - 270px)' }">
			<view class="left">
				<view v-for="(item, index) in typeArr" :key="index" :class="posi == index ? 'selected' : 'normal'"
					@tap="switchNav(index)">{{ item.name }}</view>
			</view>
			<!-- <view class="right" v-if="posi === 0"> -->
			<scroll-view class="right" v-if="posi === 0" :scroll-y="true" enable-flex="true" @touchmove.stop>
				<view class="fast">
					<view class="box">
						<view v-for="(item, index) in rankingArr" class="fast-item" @tap="selectItme('1', item.code)"
							:class="[item.select ? 'select-color' : '']">
							{{ item.name }}
						</view>
						<view style="width: 47%;"></view>
					</view>
					<view class="box">
						<view class="" v-for="(item, index) in codeArr" @tap="selectItme('2', item.code)"
							:class="[item.select ? 'select-color' : '', 'fast-items']">
							<view :class="'nub nub-bcg' + item.code">{{ item.code }}</view>
							<view style="font-size: 36rpx;">9.8</view>
						</view>
						<view v-for="(item, index) in pairArr.slice(0, 4)" @tap="pairClick(index)" :key="index"
							:class="[item.select ? 'select-color' : '', 'fast-items']">
							<view class="pair">{{ item.name }}</view>
							<view style="font-size: 36rpx;">9.8</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<scroll-view class="right" v-if="posi === 1" :scroll-y="true" enable-flex="true"
				:scroll-into-view="scrollTop" @touchmove.stop>
				<view class="fast" style="padding: 0;" v-for="(item, index) in rankingArr" :id="'id' + item.code">
					<view class="line" @tap="expansionRanking(item.code)">
						<view>{{ item.name }}</view>
						<image src="~@/static/images/exp.png"></image>
					</view>
					<view class="box" v-if="item.expansion">
						<view v-for="val in item.codeArr" @tap="selectItme('2', val.code, item.code)"
							:class="[val.select ? 'select-color' : '', 'fast-items']">
							<view :class="'nub nub-bcg' + val.code">{{ val.code }}</view>
							<view style="font-size: 36rpx;">1.96</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<scroll-view class="right" v-if="posi === 2" :scroll-y="true" enable-flex="true"
				:scroll-into-view="scrollTop" @touchmove.stop>
				<view class="fast" style="padding: 0;">
					<view class="line">
						<view>冠军和</view>
						<image src="~@/static/images/exp.png"></image>
					</view>
					<view class="box">
						<view v-for="(item, index) in coronaeArr" @tap="coronaeClick(index)" :key="index"
							:class="[item.select ? 'select-color' : '', 'fast-items']">
							<view>{{ item.name }}</view>
							<view v-if="index == 0 && index == 3">2</view>
							<view v-if="index == 0 && index == 3">1.7</view>
						</view>
					</view>
					<view class="fast" style="padding: 0;" v-for="item in rankingArr" :id="'id' + item.code">
						<view class="line" @tap="expansionRanking(item.code)">
							<view>{{ item.name }}</view>
							<image src="~@/static/images/exp.png"></image>
						</view>
						<view class="box" v-if="item.expansion">
							<view v-for="(val, index) in item.pairArr" @tap="selectItme('2', index, item.code)"
								:key="index" :class="[val.select ? 'select-color' : '', 'fast-items']">
								<view class="pair">{{ val.name }}</view>
								<view style="font-size: 36rpx;">1.96</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<scroll-view class="right" v-if="posi === 3" :scroll-y="true" enable-flex="true" @touchmove.stop>
				<view class="fast" style="padding: 0;" v-for="(item, index) in guanyahe">
					<view class="hint">
						{{ item.name }}
						<text style="color: #ea4025;margin-left: 15rpx;" v-if="index == 0">4 0</text>
						<text style="color: #ea4025;margin-left: 15rpx;" v-if="index == 1">2 0</text>
						<text style="color: #ea4025;margin-left: 15rpx;" v-if="index == 2">1 2</text>
						<text style="color: #ea4025;margin-left: 15rpx;" v-if="index == 3">1 0</text>
						<text style="color: #ea4025;margin-left: 15rpx;" v-if="index == 4">8</text>
					</view>
					<view class="box" style="justify-content: start;">
						<view :class="[val.select ? 'select-color' : '', 'fast-item']" style="margin:0 10rpx;"
							v-for="val in item.number" @tap="guanyaheClick(index, val.code)">
							{{ val.code }}
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="submit-b">
			<view class="amount">
				<view class="amount-item" @tap="amountChange('5')">5</view>
				<view class="amount-item" @tap="amountChange('10')">10</view>
				<view class="amount-item" @tap="amountChange('50')">50</view>
				<view class="amount-item" @tap="amountChange('100')">100</view>
				<view class="amount-item" @tap="amountChange('500')">500</view>
			</view>
			<view class="amount" style="justify-content: start;">
				<view style="margin-right: 50rpx;">下注总额: {{ totalAmount }}</view>
				<view>共 {{ betTotal }} 注单</view>
			</view>
			<view class="amount" style="padding: 15rpx 10rpx;border: none;">
				<!-- <input class="ipt" placeholder="请输入下注金额!" :value="NUM" @tap="showKeyboard" /> -->
				<view class="ipt" @tap="showKeyboard">
					{{ amount || isCursor ? amount : '请输入下注金额!' }}
					<view v-if="isCursor" class="cursor-blink"></view>
				</view>
				<view>
					<view class="btn" @tap="allBet()">下注</view>
					<view class="btn" @tap="resetData()" style="background-color: #f11f5a;margin-left: 30rpx;">重置</view>
				</view>
			</view>
			<view class="keyboard-wrapper">
				<view class="keyboard" v-if="keyboard">
					<view class="num">
						<table>
							<tr>
								<td @tap="change(1)" :class="[active === 1 ? 'active' : '']" @touchstart="msDown(1)"
									@touchend="msUp(1)">1</td>
								<td @tap="change(2)" :class="[active === 2 ? 'active' : '']" @touchstart="msDown(2)"
									@touchend="msUp(2)">2</td>
								<td @tap="change(3)" :class="[active === 3 ? 'active' : '']" @touchstart="msDown(3)"
									@touchend="msUp(3)">3</td>
								<td :class="[active === 'del' ? 'active' : '']" @touchstart="msDown('del')"
									@touchend="msUp('del')" rowspan="2" class="del" @tap="del">×</td>
							</tr>
							<tr>
								<td @tap="change(4)" :class="[active === 4 ? 'active' : '']" @touchstart="msDown(4)"
									@touchend="msUp(4)">4</td>
								<td @tap="change(5)" :class="[active === 5 ? 'active' : '']" @touchstart="msDown(5)"
									@touchend="msUp(5)">5</td>
								<td @tap="change(6)" :class="[active === 6 ? 'active' : '']" @touchstart="msDown(6)"
									@touchend="msUp(6)">6</td>
							</tr>
							<tr>
								<td @tap="change(7)" :class="[active === 7 ? 'active' : '']" @touchstart="msDown(7)"
									@touchend="msUp(7)">7</td>
								<td @tap="change(8)" :class="[active === 8 ? 'active' : '']" @touchstart="msDown(8)"
									@touchend="msUp(8)">8</td>
								<td @tap="change(9)" :class="[active === 9 ? 'active' : '']" @touchstart="msDown(9)"
									@touchend="msUp(9)">9</td>
								<td :class="['comfirm', active === 'cfg' ? 'active-c' : '']" @touchstart="msDown('cfg')"
									@touchend="msUp('cfg')" rowspan="2" class="comfirm" @tap="allBet">
									确定
								</td>
							</tr>
							<tr style="border: none;">
								<td colspan="3" @tap="change(0)" :class="[active === 0 ? 'active' : '']"
									@touchstart="msDown(0)" @touchend="msUp(0)">0</td>
								<!-- 							<td colspan="1" @tap="change('.')" :class="[active === '.' ? 'active' : '']"
									@touchstart="msDown('.')" @touchend="msUp('.')">
									.
								</td> -->
							</tr>
						</table>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'fastBet',
		data() {
			return {
				posi: 0,
				pairs: ['大', '小', '单', '双', '龙', '虎'],
				keyboard: false,
				flag: true,
				active: '',
				amount: '',
				result: [],
				isCursor: false, //是否显示光标
				typeArr: [{
						name: '快捷'
					},
					{
						name: '1-10名'
					},
					{
						name: '两面'
					},
					{
						name: '冠亚和'
					}
				],
				rankingArr: [], //选中排名
				codeArr: [], //选中号码
				pairArr: [],
				coronaeArr: [],
				guanyahe: [],
				betTotal: 0, //下单总数
				totalAmount: 0,
				scrollTop: ''
			};
		},
		created() {
			this.initData();
		},

		methods: {
			getBetNumber() {
				const posi = this.posi;

				let king = [];
				let code = [];
				let coronae = [];
				let pairArr = [];
				if (posi === 1 || posi === 2) {
					this.rankingArr.forEach(item => {
						if (item.select) king.push(item.code);
						item.codeArr.forEach(val => {
							if (val.select) code.push(val.code);
						});
						item.pairArr.forEach(pair => {
							if (pair.select) pairArr.push(pair.name);
						});
					});

					this.coronaeArr.forEach((item, index) => {
						if (item.select) coronae.push(item.name);
					});
				} else {
					this.rankingArr.forEach(item => {
						if (item.select) king.push(item.code);
					});
					this.codeArr.forEach(item => {
						if (item.select) code.push(item.code);
					});
					this.pairArr.forEach((item, index) => {
						if (item.select) pairArr.push(item.name);
					});
				}

				//this.betTotal = king.length + code.length + coronae.length + pairArr.length; //所选排名 + 所选号码 + 大小 +冠亚和两面
				this.betTotal = king.length * code.length + coronae.length + pairArr.length;
				this.totalAmount = this.betTotal * this.amount;

				const kingStr = king.join('') ? king.join('') + '/' : '';
				const codeStr = code.join('') ? code.join('') + '/' : '';
				const coronaeStr = coronae.join('') ? coronae.join('') : '';
				const pairStr = pairArr.join('') ? pairArr.join('') : '';
				let command = '';

				if (coronae.length > 0) {
					//冠亚和两面玩法
					command = coronaeStr + this.totalAmount;
				} else {
					if (posi === 2) {
						//面玩法
						const kingStr = king.join('') ? king.join('') : '';
						command = kingStr + pairStr + code.join('') + this.totalAmount;
					} else {
						//排名/号码  数字玩法
						command = kingStr + pairStr + codeStr + this.totalAmount;
					}
				}
				return command;
			},

			getGuanyahe() {
				let arr = this.guanyahe;

				let code = [];
				arr.forEach(item => {
					item.number.forEach(val => {
						if (val.select) code.push(val.code);
					});
				});

				this.betTotal = code.length; //所选号码
				this.totalAmount = code.length * this.amount;

				const codeStr = code.join('');

				return '冠亚和/' + codeStr + '/' + this.totalAmount;
				// return '冠亚和' + codeStr + +this.totalAmount;
			},

			//下注
			allBet() {
				let command = '';
				if (this.posi != 3) {
					command = this.getBetNumber();
				} else {
					command = this.getGuanyahe();
				}

				this.$emit('sendInstruction', command);
				this.resetData()
			},

			//重置
			resetData() {
				this.betTotal = 0;
				this.totalAmount = 0;
				this.amount = 0;
				this.result = []
				this.initData();
			},

			//初始化数据
			initData() {
				//生成号码
				let arr1 = [];
				let arr2 = [];
				let arr3 = [];
				let arr4 = [];
				let ranName = ['冠军', '亚军', '第三名', '第四名', '第五名', '第六名', '第七名', '第八名', '第九名', '第十名'];
				let pairName = ['大', '小', '单', '双', '龙', '虎'];
				let coronaeNName = ['冠亚大', '冠亚小', '冠亚单', '冠亚双'];

				let guanyahe = [{
						name: '赔率:',
						odds: '2.0',
						number: [{
								code: 3,
								select: false
							},
							{
								code: 4,
								select: false
							},
							{
								code: 18,
								select: false
							},
							{
								code: 19,
								select: false
							}
						]
					},
					{
						name: '赔率:',
						odds: '2.0',
						number: [{
								code: 5,
								select: false
							},
							{
								code: 6,
								select: false
							},
							{
								code: 16,
								select: false
							},
							{
								code: 17,
								select: false
							}
						]
					},
					{
						name: '赔率:',
						odds: '2.0',
						number: [{
								code: 7,
								select: false
							},
							{
								code: 8,
								select: false
							},
							{
								code: 14,
								select: false
							},
							{
								code: 15,
								select: false
							}
						]
					},
					{
						name: '赔率:',
						odds: '2.0',
						number: [{
								code: 9,
								select: false
							},
							{
								code: 10,
								select: false
							},
							{
								code: 12,
								select: false
							},
							{
								code: 13,
								select: false
							}
						]
					},
					{
						name: '赔率:',
						odds: '2.0',
						number: [{
							code: 11,
							select: false
						}]
					}
				];

				for (let i = 0; i < 6; i++) {
					arr3.push({
						name: pairName[i],
						select: false
					});
				}

				for (let i = 0; i < 4; i++) {
					arr4.push({
						name: coronaeNName[i],
						select: false
					});
				}

				for (let i = 0; i < 10; i++) {
					arr2.push({
						code: i + 1,
						select: false
					});

					arr1.push({
						name: ranName[i],
						code: i + 1,
						select: false,
						expansion: i === 0 ? true : false,
						codeArr: arr2,
						pairArr: arr3
					});
				}

				this.amount = '';
				this.betTotal = 0;
				this.totalAmount = 0;
				this.rankingArr = arr1;
				this.codeArr = arr2;
				this.pairArr = arr3;
				this.coronaeArr = arr4;
				this.guanyahe = guanyahe;
			},

			// 选中
			selectItme(type, value, code) {
				//type 1 排名  2号码
				//value  当前选中号码
				//code  冠亚排名

				let arr1 = this.rankingArr;
				let arr2 = this.codeArr;
				let arr3 = this.pairClick;

				if (this.posi === 0) {
					//快捷面板 判断
					if (type === '1') {
						this.rankingArr = arr1.map(item => {
							return {
								...item,
								select: value === item.code ? !item.select : item.select,
								expansion: value === item.code ? !item.select : item.select
							};
						});
					} else {
						this.codeArr = arr2.map(item => {
							return {
								...item,
								select: value === item.code ? !item.select : item.select
							};
						});
					}
				} else if (this.posi === 1) {
					// 1-10玩法排名判断
					this.rankingArr = arr1.map(item => {
						let codeArr = item.codeArr.map(val => {
							return {
								...val,
								select: item.code == code && value === val.code ? !val.select : val.select
							};
						});

						return {
							...item,
							select: item.expansion ? true : false,
							codeArr: codeArr
						};
					});
				} else if (this.posi === 2) {
					// 两面判断
					this.rankingArr = arr1.map(item => {
						let pairArr = item.pairArr.map((val, index) => {
							return {
								...val,
								select: item.code == code && value === index ? !val.select : val.select
							};
						});

						return {
							...item,
							select: item.expansion ? true : false,
							pairArr: pairArr
						};
					});
				}

				this.getBetNumber();
			},

			//暂开排名
			expansionRanking(val) {
				let arr = this.rankingArr;
				this.rankingArr = arr.map(item => {
					return {
						...item,
						expansion: val === item.code ? !item.expansion : item.expansion
					};
				});

				this.$nextTick(function() {
					this.scrollTop = val === 10 ? 'id' + val : 'id';
				});
			},

			pairClick(idx) {
				let arr = this.pairArr;
				this.pairArr = arr.map((item, index) => {
					return {
						...item,
						select: idx === index ? !item.select : item.select
					};
				});
			},

			coronaeClick(idx) {
				let arr = this.coronaeArr;
				this.coronaeArr = arr.map((item, index) => {
					return {
						...item,
						select: idx === index ? !item.select : item.select
					};
				});

				this.getBetNumber();
			},

			guanyaheClick(index, code) {
				let arr = this.guanyahe;
				arr[index].number = arr[index].number.map((item, index) => {
					return {
						...item,
						select: code === item.code ? !item.select : item.select
					};
				});

				this.guanyahe = arr;

				this.getGuanyahe();
			},

			//显示数字键盘
			showKeyboard() {
				this.isCursor = !this.isCursor;
				this.keyboard = !this.keyboard;
			},

			//侧边栏切换
			switchNav: function(index) {
				if (this.posi != index) {
					this.posi = index;
					this.scrollTop = '';
					//重新初始化数据
					this.initData();
				}
			},

			//键盘操作
			msDown(v) {
				this.active = v;
			},

			msUp(v) {
				this.active = '';
			},

			change(val, $event) {
				this.result.push(val);
				this.amount = this.result.join('');
				if (this.posi != 3) {
					this.getBetNumber();
				} else {
					this.getGuanyahe();
				}
			},

			amountChange(val, $event) {
				this.result = val.split('');
				this.amount = this.result.join('');
				if (this.posi != 3) {
					this.getBetNumber();
				} else {
					this.getGuanyahe();
				}
			},

			del() {
				this.result.pop();
				this.amount = this.result.join('');
				this.$emit('del', this.amount);

				if (this.posi != 3) {
					this.getBetNumber();
				} else {
					this.getGuanyahe();
				}
			}
		}
	};
</script>

<style>
	.wrap {
		width: 100%;
		position: relative;
		height: calc(100% - 44px);
		height: calc(100% - 44px - constant(safe-area-inset-top));
		height: calc(100% - 44px - env(safe-area-inset-top));
	}

	.wrap .productNav {
		display: flex;
		flex-direction: row;
		font-family: 'Microsoft YaHei';
	}

	.wrap .productNav .left {
		width: 25%;
		font-size: 30rpx;
		background-color: #f4f4f4;
	}

	.wrap .productNav .left view {
		text-align: center;
		height: 90rpx;
		line-height: 90rpx;
	}

	.wrap .productNav .left .selected {
		background-color: #6d91ad;
		font-weight: bold;
		color: #fff;
	}

	.wrap .productNav .left .normal {
		background-color: #f4f4f4;
		border-bottom: 1px solid #f2f2f2;
	}

	.wrap .productNav .right {
		width: 75%;
		height: 100%;
		margin: 0;
		position: fiexd;
		z-index: 10;
	}

	.wrap .productNav .right .select-color {
		color: #fff !important;
		background-color: #6d91ad !important;
	}

	.wrap .fast {
		width: 100%;
		padding: 15rpx;
		box-sizing: border-box;
	}

	.wrap .fast .box {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.wrap .fast .box .fast-item {
		width: 120rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		background-color: #e6e6e6;
		margin-bottom: 15rpx;
		border-radius: 10rpx;
	}

	.wrap .fast .box .fast-items {
		width: 250rpx;
		line-height: 60rpx;
		text-align: center;
		background-color: #e6e6e6;
		color: #808080;
		margin-bottom: 15rpx;
		border-radius: 10rpx;
		display: flex;
		justify-content: start;
		align-items: center;
		padding: 5rpx 15rpx;
		box-sizing: border-box;
		margin-top: 15rpx;
	}

	.wrap .fast .box .fast-items .pair {
		width: 50rpx;
		height: 50rpx;
		line-height: 50rpx;
		font-size: 38rpx;
		margin-right: 30rpx;
		border-radius: 5rpx;
	}

	.wrap .fast .box .fast-items .nub {
		width: 50rpx;
		height: 50rpx;
		line-height: 50rpx;
		font-size: 38rpx;
		color: #fff;
		margin-right: 30rpx;
		border-radius: 5rpx;
	}

	.nub-bcg1 {
		background-color: #fdf652;
	}

	.nub-bcg2 {
		background-color: #3e8bf7;
	}

	.nub-bcg3 {
		background-color: #4b4b4b;
	}

	.nub-bcg4 {
		background-color: #ee7e31;
	}

	.nub-bcg5 {
		background-color: #9efafd;
	}

	.nub-bcg6 {
		background-color: #4e35f5;
	}

	.nub-bcg7 {
		background-color: #e4e4e4;
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

	.wrap .fast .line {
		width: 100%;
		height: 72rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #f5f5f5;
		margin-bottom: 30rpx;
	}

	.wrap .fast .hint {
		width: 100%;
		height: 72rpx;
		line-height: 72rpx;
		font-size: 28rpx;
		font-weight: 500;
		text-align: left;
		background-color: #f5f5f5;
		margin-bottom: 30rpx;
		border-bottom: 1rpx solid #dcdcdc;
		padding-left: 15rpx;
	}

	.wrap .fast .line>image {
		width: 32rpx;
		height: 32rpx;
		margin-left: 30rpx;
	}

	.submit-b {
		width: 100%;
		position: fixed;
		bottom: 0;
		background-color: #f5f5f5;
		padding-bottom: 30rpx;
	}

	.submit-b .amount {
		width: 100%;
		display: flex;
		justify-content: space-between;
		border-bottom: 1rpx solid #dcdcdc;
		padding: 10rpx;
		box-sizing: border-box;
		color: #808080;
	}

	.submit-b .amount .amount-item {
		width: 130rpx;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		color: #fff;
		background-color: #85b3d8;
		margin-bottom: 15rpx;
		border-radius: 10rpx;
	}

	.submit-b .amount .ipt {
		width: 370rpx;
		height: 60rpx;
		line-height: 60rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #dcdcdc;
		border-radius: 10rpx;
	}

	.submit-b .amount .btn {
		display: inline-block;
		width: 140rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		color: #fff;
		background-color: #85b3d8;
		border-radius: 10rpx;
	}

	.keyboard-wrapper {
		user-select: none;
	}

	.keyboard-wrapper input {
		width: 100%;
		height: 50px;
		font-size: 25px;
	}

	.keyboard-wrapper .keyboard {
		width: 100%;
	}

	.keyboard-wrapper .keyboard .num table {
		width: 100%;
		border: 1px solid #ccc;
		border-collapse: collapse;
		background: #fff;
	}

	.keyboard-wrapper .keyboard .num table td {
		height: 50px;
		vertical-align: middle;
		color: #333;
		font-size: 20px;
		border: 1px solid #ccc;
		text-align: center;
	}

	.keyboard-wrapper .keyboard .num table td.active {
		background: #ccc;
	}

	.keyboard-wrapper .keyboard .num table .del {
		background: #eee;
	}

	.keyboard-wrapper .keyboard .num table .comfirm {
		font-size: 16px;
		width: 80px;
		background: #118eeb;
		color: #fff;
	}

	.keyboard-wrapper .keyboard .num table td.active-c {
		background: #107cca;
	}

	.cursor-blink {
		display: inline-block;
		width: 1px;
		height: 60%;
		animation: blink 1s infinite steps(1, start);
		margin: 0 10rpx;
		position: relative;
		top: 10rpx;
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