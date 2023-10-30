export default {

	/**
	 *  预测
	 * @param data 最近 10 期开奖结果
	 * @returns {*[]}
	 * 例如：
	 * [
	 *   { ranking: '冠军', code: [ 10, 3, 9, 4, 6 ], size: '小', pair: '双' },
	 * ]
	 * ranking: 排名
	 * code: 选号
	 * size: 大小
	 * pair: 单双
	 */

	randomPredictions: function(data) {
		const positions = ['冠军', '亚军', '第三名', '第四名', '第五名', '第六名', '第七名', '第八名', '第九名', '第十名'];

		// 生成5个不重复的1-10之间的随机数
		const random5Digits = (inputArray) => {
			const a = inputArray[0] + inputArray[5];
			if (a > 10) {
				return [inputArray[9], inputArray[4], inputArray[7], inputArray[3], inputArray[2]];
			} else {
				return [inputArray[8], inputArray[5], inputArray[1], inputArray[0], inputArray[6]];
			}
		};

		// 预测大小
		const randomSize = (inputArray) => {
			const a = inputArray[0] + inputArray[5];
			if (a > 10) {
				return "大";
			} else {
				return "小";
			}

		}

		// 预测单双
		const randomOddEven = (inputArray) => {
			const a = inputArray[0] + inputArray[7];
			if (a > 10) {
				return "单";
			} else {
				return "双";
			}

		}
		const predictions = [];
		data.forEach(
			(item, index) => {
				const currentRound = item.split(',').map(Number);
				predictions.push({
					ranking: positions[index],
					code: random5Digits(currentRound),
					size: randomSize(currentRound),
					pair: randomOddEven(currentRound)
				})
			}
		)
		return predictions;
	}
}