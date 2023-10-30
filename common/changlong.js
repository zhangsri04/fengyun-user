export default {
	/**
	 *  PK10 长龙统计
	 * @param data Array 最近 50 期的开奖数据
	 * @returns 长龙统计结果 Array
	 * 例如：
	 * [
	 *   { place: '第5名', result: '单', consecutive: 14 },
	 * ]
	 * 表示第5名的单出现了14期的连续开奖
	 * place: 名次
	 * result: 开奖结果
	 * consecutive: 连续开出的期数
	 */

	// 辅助函数：获取特定位置的开奖号码
	getPositionResult: function(data, position) {
		return data.map(round => parseInt(round.split(',')[position - 1]));
	},

	// 辅助函数：获取特定位置的大小和单双结果
	getSizeAndOddEvenResults: function(data, position) {
		const result = this.getPositionResult(data, position);
		const sizeResult = result.map(num => (num <= 5 ? '小' : '大'));
		const oddEvenResult = result.map(num => (num % 2 === 0 ? '双' : '单'));
		return {
			sizeResult,
			oddEvenResult
		};
	},

	// 辅助函数，龙虎统计
	getDragonTigerConsecutiveCount: function(data) {
		// 龙虎第一名统计结果
		let firstPositionCount = [];
		// 龙虎第二名统计结果
		let secondPositionCount = [];
		// 龙虎第三名统计结果
		let thirdPositionCount = [];
		// 龙虎第四名统计结果
		let fourthPositionCount = [];
		// 龙虎第五名统计结果
		let fifthPositionCount = [];

		let positionCount = {};

		const dragonTigerConsecutiveCount = [];
		data.forEach((round, index) => {
			for (let position = 1; position <= 5; position++) {
				let count = 1;
				// 当前数字和相对位置数字
				const currentNumber = parseInt(round.split(',')[position - 1]);
				const oppositeNumber = parseInt(round.split(',')[10 - position]);

				const result = currentNumber > oppositeNumber ? '龙' : '虎';
				let results = {
					position,
					result,
					consecutive: count
				}
				if (position === 1) {
					firstPositionCount.push(results);
				}
				if (position === 2) {
					secondPositionCount.push(results);
				}
				if (position === 3) {
					thirdPositionCount.push(results);
				}
				if (position === 4) {
					fourthPositionCount.push(results);
				}
				if (position === 5) {
					fifthPositionCount.push(results);
				}
				count++;
			}
		})
		dragonTigerConsecutiveCount.push(this.getDragonTigerResults(firstPositionCount));
		dragonTigerConsecutiveCount.push(this.getDragonTigerResults(secondPositionCount));
		dragonTigerConsecutiveCount.push(this.getDragonTigerResults(thirdPositionCount));
		dragonTigerConsecutiveCount.push(this.getDragonTigerResults(fourthPositionCount));
		dragonTigerConsecutiveCount.push(this.getDragonTigerResults(fifthPositionCount));
		return this.removeEmptyArray(dragonTigerConsecutiveCount);
	},

	// 辅助函数：龙虎统计连期统计
	getDragonTigerResults: function(data) {
		const consecutiveCount = []; // 用于存储连续出现次数的数组
		let count = 1; // 连续次数的计数器，初始值为1
		let prevResult = data[0].result; // 上一个结果的初始值为第一个结果
		let prevResult2 = data[1].result;
		let prevResult3 = data[2].result;

		// 如果前三名相同 则记录到结果数组中
		if (prevResult === prevResult2 && prevResult === prevResult3) {
			for (let i = 1; i < data.length; i++) {
				// 检查当前结果与上一个结果是否相同
				if (data[i].result === prevResult) {
					count++; // 连续次数加1
				} else {
					// 如果连续次数大于等于3，则记录到结果数组中
					if (count >= 3) {
						consecutiveCount.push({
							position: data[i - 1].position, // 记录结果的位置（取前一个位置）
							result: prevResult, // 记录结果的值（取上一个结果）
							consecutive: count, // 记录连续出现的次数
						});
					}
					count = 1; // 重置连续次数计数器
					prevResult = data[i].result; // 更新上一个结果为当前结果
					// 终止循环
					break;
				}
			}

			// 检查最后一组结果是否连续出现
			if (count >= 3) {
				consecutiveCount.push({
					position: data[data.length - 2].position, // 取倒数第二个位置
					result: prevResult, // 取最后一个结果
					consecutive: count, // 记录连续出现的次数
				});
			}

		}
		return consecutiveCount; // 返回连续出现次数的数组
	},

	// 工具函数：去除数组里面的空数组
	removeEmptyArray: function(arr) {
		return arr.filter(item => item.length > 0);
	},


	// 辅助函数：获取冠亚和结果
	getSumResults: function(data) {
		const sumResults = [];

		for (let roundIndex = 0; roundIndex < data.length; roundIndex++) {
			const currentRound = data[roundIndex].split(',');
			const sum = parseInt(currentRound[0]) + parseInt(currentRound[1]);
			sumResults.push(sum);
		}

		return sumResults;
	},

	// 辅助函数：获取冠亚和大小结果
	getSumSizeResults: function(data) {
		const sumResults = this.getSumResults(data);
		return sumResults.map(sum => (sum <= 11 ? '小' : '大'));
	},

	// 辅助函数：获取冠亚和单双结果
	getSumOddEvenResults: function(data) {
		const sumResults = this.getSumResults(data);
		return sumResults.map(sum => (sum % 2 === 0 ? '双' : '单'));
	},


	// 辅助函数：计算特定结果的连期数
	getConsecutiveCount: function(results) {
		const consecutiveCount = [];
		let count = 1;

		for (let i = 1; i < results.length; i++) {
			if (results[i] === results[i - 1]) {
				count++;
			} else {
				if (count >= 3) {
					consecutiveCount.push(count);
				}
				count = 1;
				break;
			}
		}

		if (count >= 3) {
			consecutiveCount.push(count);
		}
		return consecutiveCount;
	},

	// 主函数：统计 PK10 的开奖长龙
	calculateLongDragonStatistics: function(data) {
		const statistics = [];

		// 获取每个位置的大小和单双结果
		for (let position = 1; position <= 10; position++) {
			const key = `第${position}名`;
			const {
				sizeResult,
				oddEvenResult
			} = this.getSizeAndOddEvenResults(data, position);

			// 计算大小和单双结果的连期数
			const sizeConsecutiveCount = this.getConsecutiveCount(sizeResult);
			const oddEvenConsecutiveCount = this.getConsecutiveCount(oddEvenResult);

			// 将大小和单双结果的统计加入主统计数组
			sizeConsecutiveCount.forEach(consecutive => {
				statistics.push({
					place: key,
					result: `${sizeResult[0]}`,
					consecutive,
				});
			});

			oddEvenConsecutiveCount.forEach(consecutive => {
				statistics.push({
					place: key,
					result: `${oddEvenResult[0]}`,
					consecutive,
				});
			});
		}

		// 计算龙虎结果的连期数
		// 获取1-5位的龙虎结果的连期统计
		const dragonTigerConsecutiveCount = this.getDragonTigerConsecutiveCount(data);

		// 将龙虎结果的统计加入主统计数组
		dragonTigerConsecutiveCount.forEach(consecutive => {
			statistics.push({
				place: `第${consecutive[0].position}名`,
				result: consecutive[0].result,
				consecutive: consecutive[0].consecutive,
			});
		})

		// 获取冠亚和结果
		const sumResults = this.getSumResults(data);

		// 计算冠亚和结果的连期数
		const sumConsecutiveCount = this.getConsecutiveCount(sumResults);

		// 将冠亚和结果的统计加入主统计数组
		sumConsecutiveCount.forEach(consecutive => {
			statistics.push({
				place: '冠亚和',
				result: sumResults[0],
				consecutive,
			});
		});

		// 计算冠亚和大小结果的连期数
		const sumSizeConsecutiveCount = this.getConsecutiveCount(this.getSumSizeResults(data));
		// 将冠亚和大小结果的统计加入主统计数组
		sumSizeConsecutiveCount.forEach(consecutive => {
			statistics.push({
				place: '冠亚和',
				result: `${this.getSumSizeResults(data)[0]}`,
				consecutive,
			});
		});


		// 计算冠亚和单双结果的连期数
		const sumOddEvenConsecutiveCount = this.getConsecutiveCount(this.getSumOddEvenResults(data));
		// 将冠亚和单双结果的统计加入主统计数组
		sumOddEvenConsecutiveCount.forEach(consecutive => {
			statistics.push({
				place: '冠亚和',
				result: `${this.getSumOddEvenResults(data)[0]}`,
				consecutive,
			});
		})


		// 根据连期数对统计数组进行降序排序
		statistics.sort((a, b) => b.consecutive - a.consecutive);

		return statistics;
	}

	// 使用提供的数据进行示例
	// var data = [
	// 	'04,09,05,08,01,03,06,02,10,07',
	// 	'09,04,01,06,05,02,03,07,08,10',
	// 	'08,07,02,09,05,04,01,03,06,10',
	// 	'01,04,02,06,07,09,08,10,05,03',
	// 	'04,10,09,08,07,06,02,01,05,03',
	// 	'06,07,02,08,05,03,09,04,01,10',
	// 	'02,06,01,05,09,08,07,10,03,04',
	// 	'07,03,04,10,09,08,05,02,06,01',
	// 	'06,04,01,08,05,07,02,03,10,09',
	// 	'07,05,09,08,01,10,04,02,03,06',
	// 	'08,10,03,07,01,05,06,09,02,04',
	// 	'04,08,06,01,05,02,03,07,10,09',
	// 	'06,05,01,08,03,10,07,09,02,04',
	// 	'03,08,02,04,09,07,05,01,06,10',
	// ];

	// const statistics = calculateLongDragonStatistics(data);
	// console.log(statistics);

}