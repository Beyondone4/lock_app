<template>
	<view class="container container15293">
		<view class="flex flex-wrap diygw-col-24 flex-direction-column justify-center items-center flex-clz">
			<image src="https://mjke.oss-cn-shenzhen.aliyuncs.com/bn/tx-nxs4.png" class="diygw-image diygw-col-0 image-clz" style="height: 80px !important; width: 80px" mode="widthFix"></image>
		</view>
		<u-form :model="form" :rules="formRules" :errorType="['message', 'toast']" ref="formRef" class="flex diygw-form diygw-col-24">
			<u-form-item class="diygw-col-24 usename-clz radius" labelPosition="top" prop="usename">
				<u-input :focus="formData.usenameFocus" class="" placeholder="姓名" v-model="form.usename" type="text"></u-input>
			</u-form-item>
			<u-form-item class="diygw-col-24 phone-clz radius" labelPosition="top" prop="phone">
				<u-input :focus="formData.phoneFocus" class="" placeholder="手机" v-model="form.phone" type="number"></u-input>
			</u-form-item>
			<u-form-item class="diygw-col-24 sfz-clz radius" labelPosition="top" prop="sfz">
				<u-input :focus="formData.sfzFocus" class="" placeholder="身份证" v-model="form.sfz" type="number"></u-input>
			</u-form-item>
			<u-form-item class="diygw-col-24 password-clz radius" labelPosition="top" prop="password">
				<u-input :focus="formData.passwordFocus" class="" placeholder="密码" v-model="form.password" type="password" :password-icon="true"></u-input>
			</u-form-item>
			<u-form-item class="diygw-col-24 input-clz radius" labelPosition="top" prop="input">
				<u-input :focus="formData.inputFocus" class="" placeholder="验证码" v-model="form.input" type="text"></u-input>
				<view @tap="getFormInputCode" class="diygw-tag radius-xs white">
					{{ formData.inputTag }}
				</view>
			</u-form-item>
			<u-verification-code seconds="60" startText="获取验证码" ref="inputCodeRef" @change="changeFormInputCode"></u-verification-code>
			<view class="flex diygw-col-24 flex-direction-column justify-center button-clz radius">
				<button class="diygw-btn black radius button-button-clz">注册</button>
			</view>
		</u-form>
		<u-form-item class="diygw-col-24" labelPosition="top" prop="checkbox">
			<u-checkbox-group class="flex flex-wrap diygw-col-24 justify-center" wrapClass=" justify-center" activeColor="#333333" v-model="checkbox" @change="changeCheckbox">
				<u-checkbox v-model="checkboxitem.checked" v-for="(checkboxitem, checkboxindex) in checkboxDatas" :key="checkboxindex" :name="checkboxitem.value">
					{{ checkboxitem.label }}
				</u-checkbox>
			</u-checkbox-group>
		</u-form-item>
		<view class="clearfix"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//用户全局信息
				userInfo: {},
				//页面传参
				globalOption: {},
				//自定义全局变量
				globalData: {},
				checkboxDatas: [{ value: '1', label: '同意《软件用户协议》', checked: true }],
				checkbox: ['1'],
				formRules: {
					usename: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '账户不能为空'
						}
					],
					phone: [
						{
							type: 'number',

							trigger: ['change', 'blur'],
							required: true,
							message: '账户不能为空'
						}
					],
					sfz: [
						{
							type: 'number',

							trigger: ['change', 'blur'],
							required: true,
							message: '账户不能为空'
						}
					]
				},
				form: {
					usename: '',
					phone: '',
					sfz: '',
					password: '',
					input: ''
				},
				formData: {
					usenameFocus: false,
					phoneFocus: false,
					sfzFocus: false,
					passwordFocus: false,
					inputFocus: false,
					inputTag: '获取验证码',
					inputFlag: false
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
			async init() {},
			async submitForm(e) {
				let valid = await this.$refs.formRef.validate();
				if (valid) {
					//保存数据
					let param = this.form;
					let url = '';
					if (!url) {
						this.showToast('请先配置表单提交地址', 'none');
						return false;
					}

					let res = await this.$http.post(url, param, {}, 'json');

					if (res.code == 200) {
						this.showToast(res.msg, 'success');
					} else {
						this.showModal(res.msg, '提示', false);
					}
				} else {
					console.log('验证失败');
				}
			},
			changeFormInputCode(text) {
				this.formData.inputTag = text;
			},
			getFormInputCode() {
				if (this.$refs.inputCodeRef.canGetCode) {
					this.formData.inputFlag = true;
					if (this.formData.inputFlag) {
						this.$refs.inputCodeRef.start();
						this.navigateTo({
							type: 'tip',
							tip: '验证码已发送'
						});
					}
				} else {
					this.navigateTo({
						type: 'tip',
						tip: '倒计时结束后再发送'
					});
				}
			},
			changeCheckbox(evt) {}
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
	.usename-clz {
		margin-left: 20px;
		box-shadow: 0px 0px 30px rgba(31, 31, 31, 0.16);
		overflow: hidden;
		width: calc(100% - 20px - 20px) !important;
		font-size: 16px !important;
		margin-top: 10px;
		margin-bottom: 10px;
		margin-right: 20px;
	}
	.phone-clz {
		margin-left: 20px;
		box-shadow: 0px 0px 30px rgba(31, 31, 31, 0.16);
		overflow: hidden;
		width: calc(100% - 20px - 20px) !important;
		font-size: 16px !important;
		margin-top: 10px;
		margin-bottom: 10px;
		margin-right: 20px;
	}
	.sfz-clz {
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
	.input-clz {
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
	.container15293 {
		padding-left: 0px;
		padding-right: 0px;

		font-size: 12px;
	}
	.container15293 {
	}
</style>
