<template>
	<view class="container container15293">
		<view class="flex flex-wrap diygw-col-24 flex-direction-column flex6-clz">
			<!-- <view class="flex diygw-col-24 justify-around flex-nowrap white flex2-clz" @tap="navigateTo"
				data-type="page" data-url="/pages/order/index">

			</view> -->
		  <image 
		    src="/static/guangfu1.png" 
		    style="width: 100%; height: auto;  margin-bottom: 5px;" 
		    mode="widthFix">
		  </image>
<view style="display: flex; align-items: center; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin: 15px 0;">
  <image 
    :src="'http://118.31.245.112:8800'+userInfo.profile.avatar" 
    style="width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 2px solid #e0e0e0; margin-right: 20px;" 
    mode="widthFix">
  </image>
  <view style="display: flex; flex-direction: column;">
    <view style="font-size: 20px; font-weight: 600; color: #333;">{{ this.userInfo.profile.nickName }}</view>
    <view style="margin-top: 8px; font-size: 15px; color: #555;">性别：{{ this.gender[this.userInfo.profile.gender] }}</view>
    <view style="margin-top: 4px; font-size: 15px; color: #555;">邮箱：{{ this.userInfo.profile.email }}</view>
    <view style="margin-top: 4px; font-size: 15px; color: #555;">电话：{{ this.userInfo.profile.phone }}</view>
    <view style="margin-top: 4px; font-size: 15px; color: #555;">地址：{{ this.userInfo.profile.address }}</view>
  </view>
</view>


		</view>
		<view class="flex diygw-col-24">
			<button @tap="navigateTo" data-type="page" data-url="/pages/human/roster"
				class="diygw-btn blue radius-xs flex-sub margin-xs button-button-clz">修改信息</button>
		</view>
		<view class="flex diygw-col-24">
			<button @tap="navigateTo" data-type="clearUserInfoFunction"
				class="diygw-btn red radius-xs flex-sub margin-xs button-button-clz">退出登录</button>
		</view>
		<view class="flex diygw-col-24">
			<button @tap="navigateTo" data-type="page" data-url="/pages/index"
				class="diygw-btn green radius-xs diygw-shadow flex-sub margin-lg button1-button-clz">返回首页</button>
		</view>
		<view v-if='showDetail'  style=" z-index: 1000000">
			<view class="diygw-dialog diygw-dialog-return basis-lg">
				<view class="justify-end diygw-bar">
					<view class="content"> 修改信息 </view>
					<view class="action" data-type="closemodal" data-id="detail" @tap="navigateTo">
						<i class="diy-icon-close"></i>
					</view>
				</view>
				<view>
					<view style="padding: 20rpx;">
						<uni-forms :modelValue="userInfo">
							<uni-forms-item label="姓名" name="name">
								<uni-easyinput type="text" v-model="userInfo.profile.username" />
							</uni-forms-item>
							<uni-forms-item name="phone" label="联系方式">
								<uni-easyinput type="text" v-model="userInfo.profile.phone" />
							</uni-forms-item>
							<uni-forms-item name="email" label="邮箱">
								<uni-easyinput type="text" v-model="userInfo.profile.email" />
							</uni-forms-item>
							<uni-forms-item name="gender" label="权限">
								<uni-easyinput type="text" v-model="userInfo.roles[0].name" />
							</uni-forms-item>
							<!-- 				<uni-forms-item name="gender" label="性别">
								<uni-easyinput type="text" v-model="gender[selectedItem.gender]"
									:disabled='this.inputDisabled[this.currentModal]' />
							</uni-forms-item> -->
						</uni-forms>
					</view>
				</view>

				<view class="flex justify-end">

					<button data-type="closemodal" @tap="navigateTo" data-id="detail"
						class="diygw-btn red flex1 margin-xs">保存</button>
					<button data-type="closemodal" @tap="navigateTo" data-id="detail"
						class="diygw-btn red flex1 margin-xs">关闭</button>
				</view>
			</view>
		</view>
		<view class="clearfix"></view>
	</view>
</template>

<script>
	import {
		getUserInfo
	} from '../api/user';
	export default {
		data() {
			return {
				gender: {
					1: '男',
					0: '女'
				},
				detail: '',
				//用户全局信息
				userInfo: {
					id: 1,

					username: '',
					password:'',
					enable: true,
					profile: {
						id: null,

						gender: 1,
						avatar: '',
							address: '',
						email: '',
						userId: null,
						nickName: '',
						phone: null
					},
					roles: [{
							id: null,

							code: '',
							name: '',
							enable: true,
							permissions: null
						},

					],

				},
				showDetail:false,
				//页面传参
				globalOption: {},
				//自定义全局变量
				globalData: {
					isb: 0
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
		methods: {
			openDetail() {
				console.log('this.userInfo', this.userInfo)
				this.showDetail=true
			},
			async init() {
				let data = {}
				await getUserInfo().then(res => {
					data = res.data
					this.userInfo = data.data
				})
				if (data.code == 10002) {
					this.showToast('权限过期，请重新登录！')
					this.navigateTo({
						type: 'page',
						url: 'index'
					});
					return
				}
				
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
				let clear = await uni.clearStorage();
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

	.container15293 {}
</style>