<template>
	<view class="container container15293">
		<u-form :model="profile" :rules="formRules" :errorType="['message', 'toast']" ref="formRef" class="flex diygw-form diygw-col-24">

			
			<u-form-item class="diygw-col-24" :required="true" label="昵称" prop="name">
				<u-input :focus="formData.nameFocus" class="" placeholder="请输入提示信息" v-model="profile.nickName" type="text"></u-input>
			</u-form-item>
	<!-- 		<u-form-item :required="true"  class="diygw-col-24" label="密码" prop="idWorker">
				<u-input  @click="formData.showIdWorker = true" class="" placeholder="*********" v-model="form.idWorkerLabel" type="text"></u-input>
			</u-form-item> -->
		<!-- 	<u-form-item class="diygw-col-24" label="性别" :required="true" prop="checkinTime">
				<u-input @click="formData.showCheckinTime = true" class="" placeholder="请选择" v-model="form.checkinTime" type="select"></u-input>
			</u-form-item> -->
			<!-- <u-select mode="single-column" valueName="id" labelName="name" :list="educationData.rows" :defaultValue="[form.idEduIndex]" v-model="formData.showIdEdu" @confirm="changeFormIdEdu"></u-select>
	 -->
			<u-form-item class="diygw-col-24" :required="true" label="手机" prop="phone">
				<u-input :focus="formData.phoneFocus" class="" placeholder="请输入手机号" v-model="profile.phone" type="number"></u-input>
			</u-form-item>
			<u-form-item  class="diygw-col-24" label="邮箱" prop="email">
				<u-input @click="formData.showIdEdu = true" class="" placeholder="请输入" v-model="profile.email" type="text"></u-input>
			</u-form-item>
			<u-form-item  class="diygw-col-24" label="地址" prop="address">
				<u-input @click="formData.showIdEdu = true" class="" placeholder="请输入地址" v-model="profile.address" type="text"></u-input>
			</u-form-item>
			






			<view class="flex diygw-col-24 button-clz">
				<button @click="submitForm" class="diygw-btn cyan radius-xs flex-sub margin-xs button-button-clz"><text class="button-icon diy-icon-upblock"></text> 提交信息修改</button>
			</view>
<!-- 			<view class="flex diygw-col-24 chongzhi-clz">
				<button form-type="reset" class="diygw-btn red radius-xs flex-sub margin-xs chongzhi-button-clz"><text class="button-icon diy-icon-refresh"></text> 表单重置（用于重新输入所有内容）</button>
			</view> -->
		</u-form>
		<view class="clearfix"></view>
	</view>
</template>

<script>
	import {updateProfile,getUserInfo} from '../../api/user.js'
	export default {
		data() {
			return {
				//用户全局信息
				userInfo: {},
				profile:{},
				//页面传参
				globalOption: {},
				//自定义全局变量
				globalData: {},
				projectData: {
					rows: [
						{
							id: 0,
							sort: 0,
							title: '',
							describe: '',
							startTime: null,
							endTime: null,
							createTime: '',
							updateTime: '',
							deleteTime: null
						}
					],
					total: 0,
					code: 0,
					msg: ''
				},
				workerData: {
					rows: [
						{
							id: 0,
							name: '',
							sort: 0,
							createTime: null,
							updateTime: null,
							deleteTime: null
						}
					],
					total: 0,
					code: 0,
					msg: ''
				},
				educationData: {
					rows: [
						{
							id: 0,
							name: '',
							sort: 0,
							createTime: null,
							updateTime: null,
							deleteTime: null
						}
					],
					total: 0,
					code: 0,
					msg: ''
				},
				formRules: {
		
					name: [
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请输入姓名'
						}
					],
	
					cardNum: [
						{
							trigger: ['change', 'blur'],
							message: '请输入18位的有效身份证',
							pattern: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
						},
						{
							trigger: ['change', 'blur'],
							required: true,
							message: '请填写身份证号'
						}
					],
			
					phone: [
						{
							type: 'number',
							trigger: ['change', 'blur'],
							required: true,
							message: '手机号不能为空'
						},
						{
							trigger: ['change', 'blur'],
							message: '请输入11位的手机号码',
							pattern: /^1[3-9]\d{9}$/
						}
					],
					
			
				},
				form: {
				phone:'',
				email:'',
				nickName:'',
				address:''
				},
				formData: {
					showIdProject: false,
					nameFocus: false,
					showIdWorker: false,
					cardNumFocus: false,
					cardImgListDatas: [],
					cardImgDatas: [],
					cardImgbListDatas: [],
					cardImgbDatas: [],
					showCheckinTime: false,
					phoneFocus: false,
					showIdEdu: false,
					eduImgListDatas: [],
					eduImgDatas: [],
					certificatesImgListDatas: [],
					certificatesImgDatas: [],
					bankNumFocus: false,
					bankImgListDatas: [],
					bankImgDatas: [],
					bankAddressFocus: false,
					bustPhotosListDatas: [],
					bustPhotosDatas: [],
					illnessDatas: [
						{ value: '0', label: '无基础病', checked: false },
						{ value: '1', label: '有基础病', checked: false }
					],
					rzsmFocus: false
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
				
			this.userInfo	=await uni.getStorageSync('user')
	
			this.profile=this.userInfo.profile
			this.form
			console.log('this.profile',this.profile)
			
			console.log('user',uni.getStorageSync('user').profile)
				await this.projectDataApi();
				await this.workerDataApi();
				await this.educationDataApi();
			},
		async submitForm(){
			console.log(this.profile)
	
		    let sf={
				address:this.profile.address,
				phone:this.profile.phone,
				email:this.profile.email,
				nickName:this.profile.nickName,
				gender:this.profile.gender,
				id:this.profile.id
			}
			updateProfile(sf,this.profile.id).then(res=>{
				console.log(res)
				if(res.data.code===0){
					uni.showToast({
						title: '修改成功',
						icon: 'none',
						duration: 6000,
					})
					
					this.refreshUserInfo()
					this.$forceUpdate();
					     setTimeout(() => {
					        // 如果需要刷新页面，可以在返回前重新加载页面数据或直接调用页面刷新方法
					        uni.navigateBack({
					          delta: 1
					        })
					      }, 600)
				}
				else{
					uni.showToast({
						title: '修改失败',
						icon: 'none',
						duration: 1000,
					})
				}
			}
			)
		
			
			// updateProfile()
			
		},
async  refreshUserInfo() {
    await getUserInfo().then(res=>{
	  console.log('newuser',res)
	   uni.setStorageSync('user',res.data.data)
  })
  this.userInfo=uni.getStorageSync('user')
  this.profile=this.userInfo.profile
},
	
		}
	};
</script>

<style lang="scss" scoped>
	.flex2-clz {
		padding-top: 10px;
		padding-left: 10px;
		padding-bottom: 10px;
		padding-right: 10px;
	}
	.formcardImgimage {
		width: 160px;
		height: 120px;
	}
	.text5-clz {
		font-weight: bold;
	}
	.formcardImgbimage {
		width: 160px;
		height: 120px;
	}
	.text6-clz {
		font-weight: bold;
	}
	.text8-clz {
		color: #f80404;
		font-size: 15px !important;
		text-align: center;
	}
	.flex1-clz {
		margin-left: 10px;
		width: calc(100% - 10px - 10px) !important;
		margin-top: 5px;
		margin-bottom: 5px;
		margin-right: 10px;
	}
	.flex4-clz {
		padding-top: 10px;
		border-bottom-left-radius: 6px;
		padding-left: 10px;
		padding-bottom: 10px;
		border-top-right-radius: 6px;
		margin-right: 10px;
		margin-left: 10px;
		box-shadow: 0px 1px 4px 2px rgba(31, 31, 31, 0.14);
		overflow: hidden;
		width: calc(100% - 10px - 10px) !important;
		border-top-left-radius: 6px;
		margin-top: 10px;
		border-bottom-right-radius: 6px;
		margin-bottom: 10px;
		padding-right: 10px;
	}
	.text1-clz {
		padding-top: 5px;
		padding-left: 0px;
		padding-bottom: 5px;
		border-bottom: 1px solid #eee;
		padding-right: 0px;
	}
	.text3-clz {
		padding-top: 5px;
		padding-left: 0px;
		padding-bottom: 5px;
		padding-right: 0px;
	}
	.text7-clz {
		background-color: #f0faf8;
		padding-top: 5px;
		border-bottom-left-radius: 6px;
		overflow: hidden;
		color: #26b3a0;
		padding-left: 5px;
		padding-bottom: 5px;
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
		border-bottom-right-radius: 6px;
		padding-right: 5px;
	}
	.illness-clz {
		margin-left: 5px;
		width: calc(87.5% - 5px - 5px) !important;
		margin-top: 10px;
		margin-bottom: 5px;
		margin-right: 5px;
	}
	.flex-clz {
		padding-top: 10px;
		border-bottom-left-radius: 6px;
		padding-left: 10px;
		padding-bottom: 10px;
		border-top-right-radius: 6px;
		margin-right: 10px;
		margin-left: 10px;
		box-shadow: 0px 1px 4px 2px rgba(31, 31, 31, 0.14);
		overflow: hidden;
		width: calc(100% - 10px - 10px) !important;
		border-top-left-radius: 6px;
		margin-top: 10px;
		border-bottom-right-radius: 6px;
		margin-bottom: 10px;
		padding-right: 10px;
	}
	.text-clz {
		padding-top: 5px;
		padding-left: 0px;
		padding-bottom: 5px;
		border-bottom: 1px solid #eee;
		padding-right: 0px;
	}
	.text2-clz {
		padding-top: 5px;
		padding-left: 0px;
		padding-bottom: 5px;
		padding-right: 0px;
	}
	.text4-clz {
		background-color: #f0faf8;
		padding-top: 5px;
		border-bottom-left-radius: 6px;
		overflow: hidden;
		color: #26b3a0;
		padding-left: 5px;
		padding-bottom: 5px;
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
		border-bottom-right-radius: 6px;
		padding-right: 5px;
	}
	.button-clz {
		margin-left: 5px;
		width: calc(100% - 5px - 5px) !important;
		margin-top: 20px;
		margin-bottom: 30px;
		margin-right: 5px;
	}
	.button-button-clz {
		margin: 3px !important;
	}
	.chongzhi-clz {
		margin-left: 5px;
		width: calc(100% - 5px - 5px) !important;
		margin-top: 5px;
		margin-bottom: 30px;
		margin-right: 5px;
	}
	.chongzhi-button-clz {
		margin: 3px !important;
	}
	.container15293 {
		padding-left: 0px;
		padding-right: 0px;
	}
	.container15293 {
	}
</style>
