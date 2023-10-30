import JSEncrypt from '@/utils/jsencrypt.js'
import md5 from '@/utils/md5.min.js'
import CryptoJS from 'crypto-js'
import jsrsasign from 'jsrsasign';

export default {

	//rsa加密
	rsaEncrypt: function(data) {
		const PUBLIC_KEY =
			'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA3LBI5g2ucig7HJ30nKydUYaiEn5K3jfba4kiCDRYMBEfXeAuL1blgWzpDuW0IGDnP6YyViNVNsJif9/WahfyPJyZbN4SSSW9UzhZTKGOZA9+P4nRcVFMEl57hKgytYVfGGhnCTDOQBlrX/HNyGR4ku9TWvvb+YjT522diOTeoOz0XflIpMU+7vMQRJ5r5RCmMAOXnLkA9km8LakzU15uLN9XbK7sTIRMb/U0tYGg1cQXhmj1Zp4hOU7pcCWGVP3TnimMpbkUVX2sEPfQSBURLQIVWe0v9dhWCbrHkS2esTIDI/LCBtxrAq8j7cMH/b0lUSmKXYMW/wdUE/Ydid81z+vEiV76PZgZFIfnnHL80MW0g4XLznBP9m5ptKoWRCO3Pjo2xi5eG+3CcSLLBj+Qzi6FYDQBS6J+O5TJewsAt3jnvIDgouAdWnOAagLTSxMyP/Jcse1pmkHUCL22YGfL+7ttSYgwhHdclnPjMCuqbPj47hOyv0jfF/oGwAI5C4NAM76q7wRPJtRzIcK19ug2j7fvFb0UgC+MhHQyo4PNS3GnAIXV/p4iDRU9HxAW00n8KxSoiiAFp3KVWJi2jnS+oXPSeffSWRq43jOp+lAn33V9vJpJD1ZVbWn4h64Hfpp5YF+GTiR5zYroenYXEIFukGrIoiMZ6BqMHfhwWJw5mhkCAwEAAQ=='

		// 公钥,，复制前面生成的公钥
		// 使用公钥加密
		const encrypt = new JSEncrypt()
		encrypt.setPublicKey(PUBLIC_KEY)
		let result = encrypt.encrypt(data.toString())
		return result
	},

	//rsa解密
	rsaDecrypt: function(data) {
		//私钥，复制对应的私钥用于解密
		var privateId = uni.getStorageSync('rsaKey').privateKey;
		let privateKey = privateId.replace(/\n/g, '');

		//使用私钥解密
		const decrypt = new JSEncrypt()
		decrypt.setPrivateKey(privateKey)
		let result = decrypt.decrypt(data)
		return result
	},


	//aes加密
	aesEncrypt: function(data) {
		const keyWord = 'ocW7YHRgS992zTwJeyQfthxn1SmrCliu'
		const key = CryptoJS.enc.Utf8.parse(keyWord)
		const iv = CryptoJS.enc.Utf8.parse("RandomInitVector");
		// 加密
		var encrypted = CryptoJS.AES.encrypt(data, key, {
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		})
		return encrypted.toString()
	},

	//aes解密
	aesDecrypt: function(data, iv) {
		const keyWord = 'ocW7YHRgS992zTwJeyQfthxn1SmrCliu'
		const key = CryptoJS.enc.Utf8.parse(keyWord)
		const ivKey = CryptoJS.enc.Utf8.parse(iv);
		var decryptd = CryptoJS.AES.decrypt(data, key, {
			iv: ivKey,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		})

		return decryptd.toString(CryptoJS.enc.Utf8)

	},



	//私钥签名
	doSign: function(str) {
		// 将要签名的字符串进行md5加密（这里根据业务需求来，不是必需的
		const newData = md5(str);
		var privateId = uni.getStorageSync('rsaKey').privateKey;
		let privateKey = privateId.replace(/\n/g, '');
		// console.log(privateKey)
		// 方式1: 先建立 key 对象, 构建 signature 实例, 传入 key 初始化 -> 签名
		const privateKeyStr =
			`-----BEGIN RSA PRIVATE KEY-----${privateKey}-----END RSA PRIVATE KEY-----`
		const key = jsrsasign.KEYUTIL.getKey(privateKeyStr);
		// 创建 Signature 对象，设置签名编码算法
		const signature = new jsrsasign.KJUR.crypto.Signature({
			alg: 'SHA256withRSA'
		});
		// 传入key实例, 初始化signature实例
		signature.init(key);
		// 传入待加密字符串
		signature.updateString(newData);
		// 签名, 得到16进制字符结果
		let a = signature.sign();
		let sign = jsrsasign.hextob64(a);
		return sign;
	},

	verifySign: function(signData, data) {
		// console.log(signData)
		// console.log(data)
		const dataMd5 = md5(data);
		const PUBLIC_KEY =
			'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA3LBI5g2ucig7HJ30nKydUYaiEn5K3jfba4kiCDRYMBEfXeAuL1blgWzpDuW0IGDnP6YyViNVNsJif9/WahfyPJyZbN4SSSW9UzhZTKGOZA9+P4nRcVFMEl57hKgytYVfGGhnCTDOQBlrX/HNyGR4ku9TWvvb+YjT522diOTeoOz0XflIpMU+7vMQRJ5r5RCmMAOXnLkA9km8LakzU15uLN9XbK7sTIRMb/U0tYGg1cQXhmj1Zp4hOU7pcCWGVP3TnimMpbkUVX2sEPfQSBURLQIVWe0v9dhWCbrHkS2esTIDI/LCBtxrAq8j7cMH/b0lUSmKXYMW/wdUE/Ydid81z+vEiV76PZgZFIfnnHL80MW0g4XLznBP9m5ptKoWRCO3Pjo2xi5eG+3CcSLLBj+Qzi6FYDQBS6J+O5TJewsAt3jnvIDgouAdWnOAagLTSxMyP/Jcse1pmkHUCL22YGfL+7ttSYgwhHdclnPjMCuqbPj47hOyv0jfF/oGwAI5C4NAM76q7wRPJtRzIcK19ug2j7fvFb0UgC+MhHQyo4PNS3GnAIXV/p4iDRU9HxAW00n8KxSoiiAFp3KVWJi2jnS+oXPSeffSWRq43jOp+lAn33V9vJpJD1ZVbWn4h64Hfpp5YF+GTiR5zYroenYXEIFukGrIoiMZ6BqMHfhwWJw5mhkCAwEAAQ=='

		const publicKey =
			`-----BEGIN RSA PRIVATE KEY-----\n${PUBLIC_KEY}\n-----END RSA PRIVATE KEY-----`


		var verify = new JSEncrypt();
		verify.setPublicKey(publicKey);
		var verified = verify.verify(dataMd5, signData, CryptoJS.SHA256);

		// console.log('验签结果:' + verified)
		return verify;
	},

	//生成密钥对
	createKeyPair: function() {
		var rsa = uni.getStorageSync('rsaKey');
		//未登入生成密钥对
		if (!rsa) {
			// 生成秘钥对
			var encrypt = new JSEncrypt({
				default_key_size: 2048
			});
			var privateKey = encrypt.getPrivateKey();
			var publicKey = encrypt.getPublicKey();

			//储存rsaKey
			let rsaKey = {
				privateKey: privateKey,
				publicKey: publicKey,
			}
			uni.setStorageSync('rsaKey', rsaKey);
		}
	}
}