<template>
	<view class="container container15293">
		<view class="flex flex-wrap diygw-col-24 flex-direction-column justify-center items-center flex-clz">
			<image src="/static/tx-nxs4.png" class="diygw-image diygw-col-0 image-clz" style="height: 80px !important; width: 80px" mode="widthFix"></image>
		</view>
		<u-form :model="form" :rules="formRules" :errorType="['message', 'toast']" ref="formRef" class="flex diygw-form diygw-col-24">
			<u-form-item class="diygw-col-24 username-clz radius" labelPosition="top" prop="username">
				<u-input :focus="formData.usernameFocus" class="" placeholder="用户名" v-model="form.username" type="text"></u-input>
			</u-form-item>
			<u-form-item class="diygw-col-24 password-clz radius" labelPosition="top" prop="password">
				<u-input :focus="formData.passwordFocus" class="" placeholder="密码" v-model="form.password" type="password" :password-icon="true"></u-input>
			</u-form-item>
			<view>
				<u-form-item class="diygw-col-24 password-clz radius" labelPosition="top" prop="captcha">
					<u-input  class="" placeholder="验证码" v-model="form.captcha" type="text" ></u-input>
					<u-image @tap="init" :src="captchaUrl" width="60px" height="30px"></u-image>
				</u-form-item>
			</view>
	<view style="display: flex; justify-content: flex-end; padding-right: 20rpx;">
	  <u-form-item >
	    <checkbox-group>
	      <label>
	        <checkbox value="cb"  :checked="islong" />
	        七天免登录
	      </label>
	    </checkbox-group>
	  </u-form-item>
	</view>
			<view class="flex diygw-col-24 flex-direction-column justify-center button-clz radius">
				<button @tap="navigateTo" data-type="loginBnApi" class="diygw-btn black radius button-button-clz">登录</button>
			</view>
		</u-form>

		<view class="clearfix"></view>
	</view>
</template>

<script>
import { log } from 'util';
import { login,getUserInfo  } from '../api/user.js';
	export default {
		data() {
		
			return {
				islong:false,
				captchaUrl:'',
				//用户全局信息
				userInfo: {},
				//页面传参
				globalOption: {},
				//自定义全局变量
				globalData: {},
				loginBn: {
				},
				formRules: {
					username: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '账户不能为空'
						}
					]
				},
				form: {
					username: '',
					password: '',
					captcha: ''
				},
				formData: {
					usernameFocus: false,
					passwordFocus: false
				}
			};
		},
		onShow() {
			this.setCurrentPage(this);
		},
		onLoad(option) {
			this.setCurrentPage(this);
			if (option) {
				this.setData({
					globalOption: this.getOption(option)
				});
			}

			this.init();
		},
		onReady() {
			this.$refs.formRef?.setRules(this.formRules);
		},
		methods: {
			async init() {
				uni.getSystemInfo({
				  success: function (res) {
				        	uni.setStorageSync('runModel',res.model)
				  }
				});
			if(uni.getStorageSync('runModel')=='PC'){
				this.captchaUrl=`/api/auth/captcha?${Date.now()}`
			}else{
				
				this.captchaUrl=`http://182.92.76.31:8800/auth/captcha?${Date.now()}`
			}
			},
			// 登陆 API请求方法
		async loginBnApi(param) {
		  try {
		  
		    param = param || {};
		   
		    let http_data = {
		      username: this.form.username,
		      password: this.form.password,
			  captcha: this.form.captcha
			
		    };
			
			await login(http_data).then(res=>{
				this.loginBn=res.data
			})
			
		    if (this.loginBn.code == 0) {
		 
		      this.$session.setUser(this.loginBn.data);
		      // 开始跳转
			  uni.setStorageSync('token',this.loginBn.data['accessToken'])
			  await getUserInfo().then(res=>uni.setStorageSync('user',res.data.data))
		
			 // 开始跳转
uni.reLaunch({
    url: '/pages/index'
})
		    } else {
		     await this.init()
			 this.form.captcha=''
		      await this.showModal(this.loginBn.message);
		    }
		  } catch (e) {
	
		  }
		},


			// 用户登陆成功转向 自定义方法
			// async loginFunction(param) {
			// 	let thiz = this;
			
			// 	if (param.code === 200) {
					
			// 		this.$session.setUser(param.data);
			// 		this.navigateTo.setUser({
			// 			type: 'page',
			// 			url: 'index'
			// 		});
			// 	} else {
			// 		let flag = await this.showModal('登录失败,请核对账号密码是否有误?');
			// 	}
			// },
			// async submitForm(e) {
			// 	let valid = await this.$refs.formRef.validate();
			// 	if (valid) {
			// 		//保存数据
			// 		let param = this.form;
			// 		let url = '';
			// 		if (!url) {
			// 			this.showToast('请先配置表单提交地址', 'none');
			// 			return false;
			// 		}

			// 		let res = await this.$http.post(url, param, {}, 'json');

			// 		if (res.code == 200) {
			// 			this.showToast(res.msg, 'success');
			// 		} else {
			// 			this.showModal(res.msg, '提示', false);
			// 		}
			// 	} else {
					
			// 	}
			// }
		}
	};
</script>

<style lang="scss" scoped>
	.flex-clz {
		z-index: 100;
		height: 180px;
	}
	.image-clz {
		border-bottom-left-radius: 50%;
		box-shadow: 0px 0px 30px rgba(31, 31, 31, 0.16);
		overflow: hidden;
		border-top-left-radius: 50%;
		border-top-right-radius: 50%;
		border-bottom-right-radius: 50%;
	}
	.username-clz {
		margin-left: 20px;
		box-shadow: 0px 0px 30px rgba(31, 31, 31, 0.16);
		overflow: hidden;
		width: calc(100% - 20px - 20px) !important;
		font-size: 16px !important;
		margin-top: 10px;
		margin-bottom: 10px;
		margin-right: 20px;
	}
	.password-clz {
		margin-left: 20px;
		box-shadow: 0px 0px 30px rgba(31, 31, 31, 0.16);
		overflow: hidden;
		width: calc(100% - 20px - 20px) !important;
		font-size: 16px !important;
		margin-top: 20px;
		margin-bottom: 10px;
		margin-right: 20px;
	}
	.button-clz {
		margin-left: 20px;
		box-shadow: 0px 0px 30px rgba(31, 31, 31, 0.16);
		overflow: hidden;
		width: calc(100% - 20px - 20px) !important;
		font-size: 16px !important;
		margin-top: 20px;
		margin-bottom: 10px;
		margin-right: 20px;
	}
	.button-button-clz {
		font-size: 17px !important;
		margin: 0px !important;
		padding: 24px !important;
	}
	.flex1-clz {
		margin-left: 5px;
		z-index: 100;
		color: rgba(0, 0, 0, 0.71);
		width: calc(100% - 5px - 5px) !important;
		margin-top: 15px;
		margin-bottom: 5px;
		margin-right: 5px;
	}
	.text3-clz {
		margin-left: 5px;
		margin-top: 0px;
		margin-bottom: 0px;
		margin-right: 5px;
	}
	.container15293 {
		padding-left: 0px;
		padding-right: 0px;

		font-size: 12px;
	}
	.container15293 {
	}
</style>
