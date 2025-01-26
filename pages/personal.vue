<template>
	<view class="container container15293">
		<view class="flex flex-wrap diygw-col-24 flex-direction-column flex6-clz">
			<view class="flex diygw-col-24 justify-around flex-nowrap white flex2-clz" @tap="navigateTo" data-type="page" data-url="/pages/null">
				<view class="flex flex-wrap diygw-col-6 flex-direction-column items-center flex1-clz" @tap="navigateTo" data-type="page" data-url="/pages/null">
					<view class="diygw-col-0 diygw-text-lg text-blue"> 0 </view>
					<view class="diygw-col-0 text-grey"> 待审批 </view>
				</view>
				<view class="flex flex-wrap diygw-col-6 flex-direction-column items-center flex4-clz">
					<view class="diygw-col-0 diygw-text-lg text-blue"> 0 </view>
					<view class="diygw-col-0 text-grey"> 待审核 </view>
				</view>
				<view class="flex flex-wrap diygw-col-6 flex-direction-column items-center flex4-clz">
					<view class="diygw-col-0 diygw-text-lg text-blue"> 0 </view>
					<view class="diygw-col-0 text-grey"> 待操作 </view>
				</view>
				

			</view>
			<view class="flex flex-wrap diygw-col-24 items-center flex8-clz" >
				<image :src="this.userInfo.profile.avatar" class="image-size diygw-image diygw-col-0 image-clz" mode="widthFix"></image>
				<view class="flex flex-wrap diygw-col-0 flex-direction-column items-start flex9-clz">
					<view class="diygw-col-0 text1-clz">
						{{ this.userInfo.profile.nickName }}
					</view>
					<view class="flex flex-wrap diygw-col-0 items-center flex10-clz">
						<!-- <view v-for="item in this.userInfo.roles" class="diygw-col-0"> {{item.name}} </view> -->
					</view>
					<view class="flex flex-wrap diygw-col-0 items-center flex11-clz">
						<view class="diygw-col-0"> 性别：{{ this.gender[this.userInfo.profile.gender] }} </view>
					</view>
					<view class="flex flex-wrap diygw-col-0 items-center flex11-clz">
						<view class="diygw-col-0"> 邮箱：{{ this.userInfo.profile.email }} </view>
					</view>
					<view class="flex flex-wrap diygw-col-0 items-center flex11-clz">
						<view class="diygw-col-0"> 电话：{{ this.userInfo.profile.phone }} </view>
					</view>
					<view class="flex flex-wrap diygw-col-0 items-center flex11-clz">
						<view class="diygw-col-0"> 地址：{{ this.userInfo.profile.address }} </view>
					</view>
			
				</view>

			</view>

		</view>
		<view class="flex diygw-col-24">
			<button @tap="navigateTo" data-type="clearUserInfoFunction" class="diygw-btn red radius-xs flex-sub margin-xs button-button-clz">修改信息</button>
		</view>
		<view class="flex diygw-col-24">
			<button @tap="navigateTo" data-type="clearUserInfoFunction" class="diygw-btn red radius-xs flex-sub margin-xs button-button-clz">退出登录</button>
		</view>
		<view class="flex diygw-col-24">
			<button @tap="navigateTo" data-type="page" data-url="/pages/index" class="diygw-btn green radius-xs diygw-shadow flex-sub margin-lg button1-button-clz">返回首页</button>
		</view>
		<view class="clearfix"></view>
	</view>
</template>

<script>
	import { getUserInfo } from '../api/user';
	export default {
		data() {
			return {
				gender:{
					1:'男',
					0:'女'
				},
				//用户全局信息
				userInfo: {},
				//页面传参
				globalOption: {},
				//自定义全局变量
				globalData: { isb: 0 }
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
		methods: {
			async init() {
			let data={}
			await  getUserInfo().then(res=>{
				data=res.data
			})
			if(data.code==10002){
				this.showToast('权限过期，请重新登录！')
				this.navigateTo({
				  type: 'page',
				  url: 'index'
				});
				return 
			}
			this.userInfo=data.data
			console.log(this.userInfo)
			},
			// 获取用户信息（新） 自定义方法
			async getUserInfoFunction(param) {
				let thiz = this;
				let userinfo = this.$session.getUser();
				if (!this.$session.getUser()) {
					//比如未登录，转身到其他页面等
					this.showToast('请先登录');

					this.navigateTo({
						type: 'page',
						url: 'login'
					});
					return;
				} else {
					this.userInfo = userinfo;
					if (userinfo.role == 2) {
						this.globalData.isb = 1;
					} else {
						this.globalData.isb = 0;
					}
				}
			},

			// 清除用户登录信息（新） 自定义方法
			async clearUserInfoFunction(param) {
				let thiz = this;
				let clear = await  uni.clearStorage();
				console.log(clear);

				if (!uni.getStorageSync('token')) {
					//比如未登录，转身到其他页面等
					this.showToast('退出成功');
uni.reLaunch({
    url: '/pages/login'
})
					return;
				} 
			}
		}
	};
</script>

<style lang="scss" scoped>
	.flex6-clz {
		margin-left: 0px;
		z-index: 100;
		background-repeat: no-repeat;
		background-size: contain;
		width: 100% !important;
		margin-top: 0px;
		background-image: url(https://YourWebsite.cn/static/OA.png);
		margin-bottom: 30px;
		margin-right: 0px;
	}
	.flex2-clz {
		padding-top: 20px;
		border-bottom-left-radius: 10px;
		z-index: 100;
		padding-left: 10px;
		padding-bottom: 20px;
		border-top-right-radius: 10px;
		margin-right: 10px;
		background-color: rgba(217, 217, 217, 0.13);
		margin-left: 10px;
		box-shadow: 0px 2px 4px 3px rgba(181, 207, 255, 0.5);
		overflow: hidden;
		width: calc(100% - 10px - 10px) !important;
		border-top-left-radius: 10px;
		margin-top: 120px;
		border-bottom-right-radius: 10px;
		margin-bottom: 10px;
		padding-right: 10px;
	}
	.flex1-clz {
		z-index: 100;
		border-right: 1px solid #eee;
	}
	.flex4-clz {
		z-index: 100;
		border-right: 1px solid #eee;
	}
	.flex3-clz {
		z-index: 100;
		border-right: 1px solid #eee;
	}
	.flex-clz {
		z-index: 100;
		border-right: 1px solid #eee;
	}
	.flex8-clz {
		margin-left: 10px;
		width: calc(100% - 10px - 10px) !important;
		margin-top: 10px;
		margin-bottom: 0px;
		margin-right: 10px;
	}
	.image-clz {
		margin-left: 5px;
		border: 1px solid rgba(240, 240, 240, 0.17);
		border-bottom-left-radius: 30px;
		box-shadow: 0px 1px 3px rgba(242, 242, 242, 0.49);
		overflow: hidden;
		border-top-left-radius: 30px;
		margin-top: 0px;
		border-top-right-radius: 30px;
		border-bottom-right-radius: 30px;
		margin-bottom: 0px;
		margin-right: 5px;
	}
	.image-size {
		height: 50px !important;
		width: 50px !important;
	}
	.flex9-clz {
		flex: 1;
	}
	.text1-clz {
		margin-left: 0px;
		font-weight: bold;
		font-size: 16px !important;
		margin-top: 0px;
		margin-bottom: 5px;
		text-align: center;
		margin-right: 0px;
	}
	.flex10-clz {
		background-color: #dbe4e9;
		padding-top: 0px;
		border-bottom-left-radius: 20px;
		overflow: hidden;
		padding-left: 0px;
		padding-bottom: 0px;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		border-bottom-right-radius: 20px;
		padding-right: 3px;
	}
	.flex11-clz {
		background-color: #dbe4e9;
		padding-top: 0px;
		border-bottom-left-radius: 20px;
		overflow: hidden;
		padding-left: 0px;
		padding-bottom: 0px;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		border-bottom-right-radius: 20px;
		padding-right: 3px;
	}
	.icon-clz {
		color: #979797;
	}
	.icon {
		font-size: 17px;
	}
	.flex7-clz {
		border-bottom-left-radius: 10px;
		z-index: 100;
		border-top-right-radius: 10px;
		margin-right: 10px;
		background-color: rgba(217, 217, 217, 0.13);
		margin-left: 10px;
		box-shadow: 0px 2px 4px 3px rgba(181, 207, 255, 0.5);
		overflow: hidden;
		width: calc(100% - 10px - 10px) !important;
		border-top-left-radius: 10px;
		margin-top: 10px;
		border-bottom-right-radius: 10px;
		margin-bottom: 10px;
	}
	.grid3-item-clz {
		margin: 0px;
		padding: 10px;
	}
	.grid3-icon-clz {
		font-size: calc(30px - 4px) !important;

		width: 30px;
		height: 30px;
	}
	.flex5-clz {
		margin-left: 15px;
		border-bottom-left-radius: 10px;
		box-shadow: 0px 1px 3px 2px rgba(149, 149, 149, 0.26);
		z-index: 1000;
		overflow: hidden;
		width: calc(100% - 15px - 15px) !important;
		border-top-left-radius: 10px;
		margin-top: 8px;
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
		margin-bottom: 8px;
		margin-right: 15px;
	}
	.grid4-item-clz {
		margin: 0px;
		padding: 10px;
	}
	.grid4-icon-clz {
		font-size: calc(40px - 4px) !important;

		width: 40px;
		height: 40px;
	}
	.button-button-clz {
		margin: 3px !important;
	}
	.button1-button-clz {
		margin: 3px !important;
	}
	.container15293 {
		padding-left: 0px;
		padding-right: 0px;

		background-position: top center;
		background-size: contain;
		background-repeat: no-repeat;
	}
	.container15293 {
	}
</style>
