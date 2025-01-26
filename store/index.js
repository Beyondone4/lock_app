// 页面路径：store/index.js 
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);//vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
	state:{//存放状态
		"username":"foo",
		"age":18,
		"currentDevice":{},
	},
	mutations: {
			update(state,payload) {
				// 变更状态
				state.currentDevice=payload
			}
		},
	actions:{
			updateLock (context,payload) {
			    context.commit('update',payload)
			}
		}
})
export default store
