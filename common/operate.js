/* 
 用来放置一些全局方法的
在main 中全局调用
	import operate from "common/operate.js" 
	Vue.prototype.$operate = operate
*/
//语言包
// import messages from '@/locale/index.js'
var key = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default {
	//接口
	api: function() {
		// #ifdef H5
		if (process.env.NODE_ENV === 'development') { //开发环境
			return 'http://106.55.199.100'
		} else { // 生产环境
			return 'http://106.55.199.100'
		}
		// #endif
		// #ifdef APP-PLUS
		return "http://106.55.199.100"
		// #endif
	},

	//接口
	urlPrefix: function() {
		// #ifdef H5
		if (process.env.NODE_ENV === 'development') { //开发环境
			return 'ws://106.55.199.100:8000'
		} else { // 生产环境
			return 'ws://106.55.199.100:8000'
		}
		// #endif
		// #ifdef APP-PLUS
		return "ws://106.55.199.100:8000"
		// #endif
	},

	//吐司
	toast: function(options) {
		let {
			title,
			duration,
			icon,
			mask
		} = options;
		uni.showToast({
			title: title,
			duration: 1000,
			icon: icon || "none",
			mask: mask || false
		});
	},

	// 模拟对话框
	showModal: function(matter) {
		return new Promise((resolve, reject) => {
			uni.showModal({
				title: matter.title || '',
				content: matter.content || '',
				// 是否显示取消按钮，默认为 true
				showCancel: matter.showCancel || true,
				// 取消按钮的文字，默认为"取消"
				cancelText: matter.cancelText || "取消",
				// 取消按钮的文字颜色，默认为"#000000"
				cancelColor: matter.cancelColor || "#000000",
				// 确定按钮的文字，默认为"确定"
				confirmText: matter.confirmText || "确定",
				/*
				确定按钮的文字颜色，H5平台默认为"#007aff"，
					微信小程序平台默认为"#576B95"，
					百度小程序平台默认为 "#3c76ff"
				*/
				// confirmColor: matter.confirmColor || '#576B95',
				success: (res) => {
					if (res.confirm) {
						resolve(res)
						// console.log('用户点击确定');
					} else if (res.cancel) {
						// console.log('用户点击取消');
					}
				},
				// fail: (err) => {reject(err)}
			})
		})
	},
	// 字符串加密
	toCode(str) { //加密字符串
		//定义密钥，36个字母和数字
		var len = key.length; //获取密钥的长度
		var a = key.split(""); //把密钥字符串转换为字符数组
		var s = "",
			b, b1, b2, b3; //定义临时变量
		for (var i = 0; i < str.length; i++) { //遍历字符串
			b = str.charCodeAt(i); //逐个提取每个字符，并获取Unicode编码值
			b1 = b % len; //求Unicode编码值得余数
			b = (b - b1) / len; //求最大倍数
			b2 = b % len; //求最大倍数的于是
			b = (b - b2) / len; //求最大倍数
			b3 = b % len; //求最大倍数的余数
			s += a[b3] + a[b2] + a[b1]; //根据余数值映射到密钥中对应下标位置的字符
		}
		return s; //返回这些映射的字符
	},
	// 字符串解密
	fromCode(str) {
		//定义密钥，36个字母和数字
		var len = key.length; //获取密钥的长度
		var b, b1, b2, b3, d = 0,
			s; //定义临时变量
		s = new Array(Math.floor(str.length / 3)); //计算加密字符串包含的字符数，并定义数组
		b = s.length; //获取数组的长度
		for (var i = 0; i < b; i++) { //以数组的长度循环次数，遍历加密字符串
			b1 = key.indexOf(str.charAt(d)); //截取周期内第一个字符串，计算在密钥中的下标值
			d++;
			b2 = key.indexOf(str.charAt(d)); //截取周期内第二个字符串，计算在密钥中的下标值
			d++;
			b3 = key.indexOf(str.charAt(d)); //截取周期内第三个字符串，计算在密钥中的下标值
			d++;
			s[i] = b1 * len * len + b2 * len + b3 //利用下标值，反推被加密字符的Unicode编码值
		}
		b = eval("String.fromCharCode(" + s.join(',') + ")"); // 用fromCharCode()算出字符串
		return b; //返回被解密的字符串
	}
}