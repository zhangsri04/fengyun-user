import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const files = require.context("./modules", false, /\.js$/);
let modules = {
	state: {},
	mutations: {},
	actions: {}
};
// plus.android.importClass('android.telephony.TelephonyManager')

// let context = plus.android.importClass('android.content.Context');

// let TelephonyManager = plus.android.runtimeMainActivity().getSystemService(context.TELEPHONY_SERVICE);

// let OperatorName = TelephonyManager.getSimOperatorName();
// let phoneNumber = TelephonyManager.getLine1Number();
// console.log("运行商名称: ", OperatorName);
// console.log("手机号: ", phoneNumber);


files.keys().forEach((key) => {
	Object.assign(modules.state, files(key)["state"]);
	Object.assign(modules.mutations, files(key)["mutations"]);
	Object.assign(modules.actions, files(key)["actions"]);
});
const store = new Vuex.Store(modules);
export default store;