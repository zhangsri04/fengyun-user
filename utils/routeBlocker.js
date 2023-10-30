/*
 * @author: Jay
 * @description: 路由拦截器
 * @createTime: 2021-12-15 5:34:41 ?F10: PM?
 */
// xuex 数据
import store from '@/store/index.js'
//全局js
import operate from '@/common/operate.js'
export default function openPage(args) {
	// console.log('路由参数', args);
	if (!['navigateTo', 'switchTab', 'reLaunch', 'redirectTo'].includes(args.type)) {
		console.log("type必须是以下的值[navigateTo,switchTab,reLaunch,redirectTo]");
		return;
	}

	//路由参数
	let url = args.url, //页面路径
		type = args.type, // 跳转方式
		ifLogin = args.login || false; // 是否需要判断登录

	//是否需要判断登录
	if (ifLogin) {
		// console.log(store.state.hasLodin, '登入状态')
		//根据vuex 判断是否登录
		if (!store.state.hasLodin) {
			operate.toast({
				title: '请先登录'
			})
			setTimeout(() => {
				//登录页面
				url = '/pages/login/login'
				// type = 'redirectTo'
				//执行跳转
				startRoute(type, url)
			}, 500)
			return;
		}
	}
	//执行跳转
	startRoute(type, url)
}

//开始跳转
function startRoute(type, url) {
	return new Promise((resolve, reject) => {
		uni[type]({
			url: url,
			success(res) {},
			fail(err) {}
		})
	})
}

/*
1.在main.js中引入
	import route from 'utils/routeBlocker.js'
	Vue.prototype.$route = route

2.使用方法
	this.$route({
		url: "/pages/css/css", //路径
		type: "navigateTo", //跳转方式
		ifLogin: true,	 //是否需要登录
	})
*/