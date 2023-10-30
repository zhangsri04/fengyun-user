export const state = {
	//是否登录
	hasLodin: false,
	//用户数据
	userInfo: {},
};

export const mutations = {
	//储存用户信息
	setUserInfo(state, data) {
		if (data) {
			state.hasLodin = true;
			state.userInfo = Object.assign({}, state.userInfo, data);
			uni.setStorageSync('userInfo', state.userInfo);
		}
	},
	// 退出APP
	emptyUserInfo(state) {
		state.hasLodin = false;
		state.userInfo = {};
		uni.removeStorageSync("userInfo");
		uni.removeStorageSync("rsaKey");
		uni.reLaunch({
			url: '/pages/login/login'
		});
	},
};
export const actions = {

};