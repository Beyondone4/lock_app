const url_all = {
	'DEV': `/api`, // 开发
	'APP': `http://182.92.76.31:8800`
}



 
export const request = (options = {}) => {
	return new Promise((resolve, rejects) => {
		handleRequest(options, resolve, rejects)
	})
}
 
// 发起请求
function handleRequest(options, resolve, reject) {
	const token = uni.getStorageSync('token')
	const model= uni.getStorageSync('runModel')
	let BASEURL=model=='PC'?url_all['DEV']:url_all['APP']
	uni.showLoading({
		title: "加载中"
	});
	if (!token&&!whiteList(options)) {
		console.log("没有登录")
		// 执行没有登录的逻辑
		uni.reLaunch({
			url:'/pages/login'
		})
		uni.hideLoading()
		return;
	}
	if(whiteList(options)){
		uni.request({
			url: BASEURL + options.url,
			   headers: { 
			      'Content-Type': 'application/json'
			   },
			method: options.method,
			data: options.params,
			success: (response) => {
				return resolve(response)
			},
			fail: (err) => {
				return reject(err);
			},
			complete() {
				uni.hideLoading();
			}
		})
		return
	}
	uni.request({
		url: BASEURL +  options.url,
		method: options.method,
		header: {
			Authorization:'Bearer '+ token
		},
		data: options.params,
		success: (response) => {
			if(response.statusCode==401){
				uni.showToast({
				  icon: 'error',
				  position: 'top',
				  title: '出错了，请尝试重新登录！'
				});
				return 
			}
			return resolve(response)
		},
		fail: (err) => {
			console.log('error', err)
			return reject(err);
		},
		complete() {
			uni.hideLoading();
		}
	})
}
 
// token 白名单
function whiteList(config) {
	let list = [
		(config.url == '/auth/captcha' && config.method == 'GET'),
		(config.url == '/auth/login' && config.method == 'POST'),
	]
	let bol = false
	for (const item of list) {
		if (item) {
			bol = true
		}
	}
	return bol
}
 