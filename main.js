import Vue from 'vue'
import App from './App'
import api from '@/common/api.js'
Vue.config.productionTip = false
Vue.prototype.$api = api


import operate from "common/operate.js" //全局js
Vue.prototype.$operate = operate

//路由封装
import routr from './utils/routeBlocker.js'
Vue.prototype.$routr = routr


//引入store
import store from 'store/index.js'
Vue.prototype.$store = store

//检查是否登入
store.state.hasLodin = uni.getStorageSync('userInfo').token ? true : false

App.mpType = 'app'

const app = new Vue({
	...App,
	store,
	mounted() {
		if (uni.getSystemInfoSync().uniPlatform === 'web') {
			let FastClick = require('fastclick');
			FastClick.attach(document.body);
		}
	}
})
app.$mount()