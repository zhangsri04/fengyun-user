//请求头 放置地址
import operate from '@/common/operate.js'
import store from '@/store/index.js'
import rsa from './rsaEncryption.js'
let {
	rsaEncrypt,
	rsaDecrypt,
	doSign,
	verifySign,
	aesEncrypt,
	aesDecrypt
} = rsa
/*
	修改请求方式
*/
export default class Request {
	http(param) {
		var url = param.url,
			method = param.method,
			header = {},
			data = JSON.stringify(param.data) || {},
			hideLoading = param.hideLoading || false,
			isKey = param.isKey || false;
		//拼接完整请求地址
		var requestUrl = operate.api() + url;
		// console.log(`接口地址: ${url}\n请求参数:`, data)

		var sign, rsaEncryptDat;
		if ((JSON.stringify(data) == '{}')) {
			sign = doSign('')
		} else {
			sign = doSign(data)
			rsaEncryptDat = rsaEncrypt(data)
		}

		var token = uni.getStorageSync('userInfo').token || ""

		// console.log('加密参数' + rsaEncryptDat)
		// console.log('请求sign签名' + sign)
		//请求方式
		if (!method) {
			method = "GET"
		} else {
			method = method.toUpperCase();
			if (method == "POST" || method == "PUT") {
				header = {
					'content-type': "application/json;charset=UTF-8", // application/x-www-form-urlencoded
					'sign': sign,
					'token': token,
				};
			} else {
				header = {
					'content-type': "application/json",
					'sign': sign,
					'token': token,

				};
			}
		}

		//请求数据
		let reqData = {
			data: rsaEncryptDat
		}

		//判断是否需要传入公钥
		if (isKey) {
			var privateId = uni.getStorageSync('rsaKey').publicKey;
			let publicKey = privateId.replace(/\n/g, '');
			reqData.publicKey = publicKey
		}

		//加载圈
		if (!hideLoading) {
			uni.showLoading({
				title: '加载中...'
			});
		}

		//开始请求
		return new Promise((resolve, reject) => {
			uni.request({
				url: requestUrl,
				data: reqData,
				method: method,
				header: header,
				success: (res) => {
					// console.log('请求结果', res)
					// 判断 请求api 格式是否正确
					if (res.statusCode && res.statusCode != 200) {
						uni.showToast({
							title: "api错误" + res.errMsg,
							icon: 'none'
						});
						return;
					}

					//token失效拦截
					if (res.data.code === 10600 || res.data.code === 10500) {
						console.log('token失效')
						store.state.hasLodin = false
						uni.removeStorageSync('userInfo');
						uni.removeStorageSync("rsaKey");
						uni.reLaunch({
							url: '/pages/login/login'
						});

						setTimeout(() => {
							uni.showToast({
								title: "登入已失效",
								icon: 'none'
							});
						})
						return
					}

					if (res.data.code === 10200) {
						//rsa解密结果返回
						const result = res.data.data
						const random = res.data.random
						const sign = res.data.sign

						const iv = rsaDecrypt(random)
						let decrResul = (JSON.stringify(result) == '{}') ? {} : aesDecrypt(
							result,
							iv)

						//验签
						const signResul = verifySign(sign, decrResul)
						if (!signResul) {
							//验签失败跳登入
							store.state.hasLodin = false
							uni.removeStorageSync('userInfo');
							uni.removeStorageSync("rsaKey");
							uni.reLaunch({
								url: '/pages/login/login'
							});

							setTimeout(() => {
								uni.showToast({
									title: "登入已失效",
									icon: 'none'
								});
							})
							return
						}
						res.data.data = JSON.parse(decrResul)
						// console.log(`接口地址: ${url}\n返回数据:`, JSON.parse(decrResul))
						// 将结果抛出
						resolve(res.data)
					} else {
						resolve(res.data)
					}
				},
				//请求失败
				fail: (e) => {
					uni.showToast({
						title: "" + e.data.msg,
						icon: 'none'
					});
					resolve(e.data);
				},
				complete() {
					// 隐藏加载
					if (!hideLoading) {
						uni.hideLoading();
					}
					return;
				}
			})
		})
	}
}