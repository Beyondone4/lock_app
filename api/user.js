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
// 用户登录
export const login =  (params={}) => {
  return 	request({
  			method: 'POST',
  	        url: '/auth/login',
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
export const addLock = (params={}) => {
 return 	request({
 			method: 'POST',
 	        url: '/lock',
 	        params: params
 })
}
export const updateStation = (params={},id) => {
 return 	request({
 			method: 'PATCH',
 	        url: '/station/?id='+id,
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
