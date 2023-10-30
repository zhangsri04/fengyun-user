export default {
	/**
	 * 根据开奖号码获取指定规则的开奖结果
	 * @param numbers
	 * @returns {{龙虎: *[], 冠亚和单双: (string), 冠亚和数字: *, 冠亚和大小: (string)}|string}
	 */
	getPK10Result: function(numbers) {
		if (numbers.length !== 10) {
			return '-1';
		}

		// 冠亚和 数字 大小 单双
		const guanYaHe = numbers[0] + numbers[1];
		const guanYaHeSize = guanYaHe > 11 ? '大' : '小';
		const guanYaHeOddEven = guanYaHe % 2 === 0 ? '双' : '单';

		// 1-5 龙虎
		const longHuResult = [];
		for (let i = 0; i < 5; i++) {
			longHuResult.push(numbers[i] > numbers[9 - i] ? '龙' : '虎');
		}

		return {
			guanYaHe: guanYaHe,
			guanYaHeSize: guanYaHeSize,
			guanYaHeOddEven: guanYaHeOddEven,
			longHuResult: longHuResult
		};
	},
	/**
	 * 根据最近 10 期的游戏开奖获取长龙的统计
	 * @param data
	 * @returns {*[]|string}
	 */
	countLongDragon: function(data) {
		if (data.length < 1) {
			return "请至少输入1组号码";
		}

		const betPositions = [
			// 冠亚和 大小
			{
				positionName: '冠亚和大小',
				getIndex: (nums) => nums[0] + nums[1],
				isLong: (result) => result > 11,
			},
			// 冠亚和 单双
			{
				positionName: '冠亚和单双',
				getIndex: (nums) => nums[0] + nums[1],
				isLong: (result) => result % 2 === 1,
			},
			...Array.from({
				length: 10
			}, (_, i) => [
				// 第 i 名 大小
				{
					positionName: `第${i + 1}名大小`,
					getIndex: (nums) => nums[i],
					isLong: (result) => result > 5,
				},
				// 第 i 名 单双
				{
					positionName: `第${i + 1}名单双`,
					getIndex: (nums) => nums[i],
					isLong: (result) => result % 2 === 1,
				},
			]).flat(),
		];

		const longDragonStats = [];

		betPositions.forEach(({
			positionName,
			getIndex,
			isLong
		}) => {
			let prevResult = isLong(getIndex(data[0])) ? '龙' : '虎';
			let count = 1;

			for (let i = 1; i < data.length; i++) {
				const currentResult = isLong(getIndex(data[i])) ? '龙' : '虎';

				if (currentResult === prevResult) {
					count++;
				} else {
					if (count >= 3) {
						longDragonStats.push({
							position: positionName,
							result: prevResult,
							continuous: count,
						});
						break;
					}
					count = 1;
					prevResult = currentResult;
				}
			}
		});

		return longDragonStats;
	},
	/**
	 * 根据上一次的开奖结果预测下期的开奖
	 * @param nums
	 * @returns {{号码: unknown[], 大小: string, 单双: string, 名次: *}[]|string}
	 */
	randomPrediction: function(nums) {
		if (nums.length !== 10) {
			return "请输入一组10位数";
		}

		// 生成5个不重复的1-10之间的随机数
		const random5Digits = () => {
			const arr = Array.from({
				length: 10
			}, (_, i) => i + 1);
			const shuffledArr = arr.sort(() => Math.random() - 0.5);
			return shuffledArr.slice(0, 5);
		};

		// 随机预测大小
		const randomSize = () => (Math.random() > 0.5 ? "大" : "小");

		// 随机预测单双
		const randomOddEven = () => (Math.random() > 0.5 ? "单" : "双");

		const positions = ['冠军', '亚军', '第三名', '第四名', '第五名', '第六名', '第七名', '第八名', '第九名', '第十名'];

		const prediction = positions.map(position => ({
			ranking: position,
			code: random5Digits(),
			size: randomSize(),
			pair: randomOddEven()
		}));

		return prediction;
	},
	generateBettingTextArray: function(resultData) {
		return resultData.map(item => {
			const newItem = {
				...item
			};
			newItem.betList = item.betList.map(bet => {
				const newBet = {
					...bet
				};
				let betting_Text = '';

				const formattedAmount = bet.amount.toFixed(1);

				if (bet.isSum === 1) {
					const typeTextMap = {
						101: bet.number,
						1: '大',
						2: '小',
						3: '单',
						4: '双'
					};
					betting_Text = `冠亚和【${typeTextMap[bet.type]}】${formattedAmount}`;
				} else {
					const seatText = bet.seat === 1 ? '冠军' : bet.seat === 2 ? '亚军' :
					`第${bet.seat}名`;
					if (bet.type === 101) {
						betting_Text = `${seatText}【${bet.number}】${formattedAmount}`;
					} else {
						const typeTextMap = {
							1: '大',
							2: '小',
							3: '单',
							4: '双',
							5: '龙',
							6: '虎'
						};
						betting_Text = `${seatText}【${typeTextMap[bet.type]}】${formattedAmount}`;
					}
				}

				newBet.betting_Text = betting_Text;
				return newBet;
			});
			return newItem;
		});
	}
}