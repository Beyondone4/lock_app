// src/api/user.js
import {request} from './request.js'

export const getCaptcharUrl= (params='')=>{
	return 	request({
				method: 'GET',
		        url: '/auth/captcha',
		        params: params
	})
}
export const refreshToken= (params)=>{
	return 	request({
				method: 'GET',
		        url: '/auth/refresh',
		        params: params
	})
}
export const upload = (filename, file) => {
  return uni.uploadFile({
    url: 'http://182.92.76.31:8800/f/' + filename,  // 上传的 URL
    // file: file,         // 选择的文件路径

	header:{
		Authorization: "Bearer " + uni.getStorageSync('token'),
	},
	name: 'file',           // 上传的字段名
	filePath: file, // 文件资源的路径
    success(res) {
		this.currentImg=res.data.data
      console.log('上传成功:', res);
    },
    fail(err) {
      console.error('上传失败:', err);
    }
  });
};
export const uploadimg = (name, file) => {
  // 创建FormData对象并添加文件
  const formData = new FormData();
  formData.append('file', file); // 'file'是服务器接收文件的字段名，根据需要修改

  return request({
    method: 'POST',
    url: `/f/${name}`,
    data: formData,          // 正确传递FormData
    headers: {
      'Content-Type': 'multipart/form-data' // 通常可省略，浏览器会自动生成带boundary的Content-Type
    }
  });
};

// 用户登录
export const login =  (params={}) => {
  return 	request({
  			method: 'POST',
  	        url: '/auth/login',
  	        params: params,
  })
}
export const updateOrder =  (params={},id) => {
  return 	request({
  			method: 'PATCH',
  	        url: '/order/'+id,
  	        params: params,
  })
}
export const approveOrder =  (params={},id) => {
  return 	request({
  			method: 'PATCH',
  	        url: '/order/approval/'+id,
  	        params: params,
  })
}
export const stepOrder =  (params={},id) => {
  return 	request({
  			method: 'PATCH',
  	        url: '/order/step/'+id,
  	        params: params,
  })
}
export const createOrder =  (params={}) => {
  return 	request({
  			method: 'POST',
  	        url: '/order',
  	        params: params,
  })
}
export const getAllroles = (params={}) => {
 return 	request({
 			method: 'GET',
 	        url: '/role?enable=1',
 	        params: params
 })
}
export const getOrderList = (params={}) => {
 return 	request({
 			method: 'GET',
 	        url: '/order',
 	        params: params
 })
}
// 获取用户信息
export const getUserInfo = (params={}) => {
 return 	request({
 			method: 'GET',
 	        url: '/user/detail',
 	        params: params
 })
}
export const getUserList = (params={}) => {
 return 	request({
 			method: 'GET',
 	        url: '/user',
 	        params: params
 })
}
export const getStationList = (params={}) => {
 return 	request({
 			method: 'GET',
 	        url: '/station',
 	        params: params
 })
}
export const addStation = (params={}) => {
 return 	request({
 			method: 'POST',
 	        url: '/station',
 	        params: params
 })
}
export const addUser = (params={}) => {
 return 	request({
 			method: 'POST',
 	        url: '/user',
 	        params: params
 })
}
export const addLock = (params={}) => {
 return 	request({
 			method: 'POST',
 	        url: '/lock',
 	        params: params
 })
}
export const getImg = (name) => {
 return 	request({
 			method: 'GET',
 	        url: '/uploads/'+name,
 })
}
export const resetPwd = (data,id) => {
 return 	request({
 			method: 'PATCH',
 	        url: '/user/password/reset/'+id,
 	        data: data
 })
}
export const updateLock = (params={},id) => {
 return 	request({
 			method: 'PATCH',
 	        url: '/lock/'+id,
 	        params: params
 })
}
export const updateStation = (params={},id) => {
 return 	request({
 			method: 'PATCH',
 	        url: '/station/'+id,
 	        params: params
 })
}
export const deleteUsers = (params={}) => {
 return 	request({
 			method: 'DELETE',
 	        url: '/users',
 	        params: params
 })
}
export const deleteStations = (params={}) => {
 return 	request({
 			method: 'DELETE',
 	        url: '/stations',
 	        params: params
 })
}
export const deleteOrders = (params={}) => {
 return 	request({
 			method: 'DELETE',
 	        url: '/orders',
 	        params: params
 })
}
export const deleteLocks = (params={}) => {
 return 	request({
 			method: 'DELETE',
 	        url: '/locks',
 	        params: params
 })
}
export const deleteStation = (params={}) => {
 return 	request({
 			method: 'DELETE',
 	        url: '/station/?id='+params,
 	      
 })
}
export const getLockList = (params={}) => {
 return 	request({
 			method: 'GET',
 	        url: '/lock',
 	        params: params
 })
}
export const getLockCmd = (params={}) => {
 return 	request({
 			method: 'POST',
 	        url: '/lock/command',
 	        params: params
 })
}
