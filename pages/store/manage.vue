<template>
	<view class="container container15293">
		<view class="flex flex-wrap diygw-col-24 flex-direction-column flex-clz">
			<view class="flex flex-wrap diygw-col-24 flex-direction-column flex1-clz">
				<view class="diygw-title flex diygw-col-24">
					<view class="title font-normal"> <text class="diy-icon-home"></text> 仓库：{{ warehouseInfoData.data.name }} </view>
				</view>
				<view class="diygw-col-24 text-clz diygw-text-lg"> 现有库存 </view>
				<view class="flex flex-wrap diygw-col-24 flex-direction-column flex8-clz">
					<view class="flex flex-wrap diygw-col-24 flex9-clz">
						<view class="diygw-col-0 text1-clz"> 物品 </view>
						<view class="diygw-col-0 text2-clz"> 规格 </view>
						<view class="diygw-col-0 text3-clz"> 数量 </view>
						<view class="diygw-col-0 text4-clz"> 单位 </view>
					</view>
					<view v-for="(item, index) in warehouseInfoData.data.count" :key="index" class="flex flex-wrap diygw-col-24 flex10-clz">
						<view class="diygw-col-0 text12-clz">
							{{ item.title }}
						</view>
						<view class="diygw-col-0 text13-clz">
							{{ item.specs }}
						</view>
						<view class="diygw-col-0 text14-clz">
							{{ item.num }}
						</view>
						<view class="diygw-col-0 text15-clz">
							{{ item.unit }}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="flex flex-wrap diygw-col-24 flex-direction-column flex2-clz">
			<view class="diygw-col-24 text5-clz diygw-text-lg"> 待处理的操作 </view>
			<view class="flex flex-wrap diygw-col-24 flex-direction-column flex3-clz">
				<view class="flex flex-wrap diygw-col-24 flex4-clz">
					<view class="diygw-col-0 text6-clz"> 物品 </view>
					<view class="diygw-col-0 text7-clz"> 使用者 </view>
					<view class="diygw-col-0 text8-clz"> 事务 </view>
					<view class="diygw-col-0 text9-clz"> 操作 </view>
				</view>
				<view v-for="(item, index) in warehouseInfoData.data.pending" :key="index" class="flex flex-wrap diygw-col-24 flex5-clz">
					<view class="diygw-col-0 text10-clz">
						{{ item.storeArticleCn }}
					</view>
					<view class="diygw-col-0 text11-clz">
						{{ item.userCn }}
					</view>
					<view class="diygw-col-0 text16-clz">
						{{ item.flowStatusCn }}
					</view>
					<view class="flex flex-wrap diygw-col-6 flex6-clz">
						<view @tap="navigateTo" data-type="clickAgreeFunction" :data-index="index" class="diygw-col-0 text18-clz"> 同意 </view>
						<view @tap="navigateTo" data-type="clickRefuseFunction" :data-index="index" class="diygw-col-0 text19-clz"> 拒绝 </view>
					</view>
				</view>
			</view>
		</view>
		<view class="diygw-modal basic" :class="agree" style="z-index: 1000000">
			<view class="diygw-dialog diygw-dialog-agree basis-lg">
				<view class="justify-end diygw-bar">
					<view class="content"> 同意入库 </view>
					<view class="action" data-type="closemodal" data-id="agree" @tap="navigateTo">
						<i class="diy-icon-close"></i>
					</view>
				</view>
				<view>
					<view class="flex diygw-dialog-content">
						<view class="diygw-col-24 text17-clz"> 是否同意？ </view>
					</view>
				</view>
				<view class="flex justify-end">
					<button @tap="navigateTo" data-type="clickAgreeDataApi" :data-id="globalData.storeflowid" class="diygw-btn green flex1 margin-xs">确认</button>
					<button data-type="closemodal" @tap="navigateTo" data-id="agree" class="diygw-btn red flex1 margin-xs">取消</button>
				</view>
			</view>
		</view>
		<view class="diygw-modal basic" :class="refuse" style="z-index: 1000000">
			<view class="diygw-dialog diygw-dialog-refuse basis-lg">
				<view class="justify-end diygw-bar">
					<view class="content"> 拒绝入库 </view>
					<view class="action" data-type="closemodal" data-id="refuse" @tap="navigateTo">
						<i class="diy-icon-close"></i>
					</view>
				</view>
				<view>
					<view class="flex diygw-dialog-content">
						<view class="diygw-col-24 text20-clz"> 是否拒绝？ </view>
					</view>
				</view>
				<view class="flex justify-end">
					<button @tap="navigateTo" data-type="clickRefuseDataApi" :data-id="globalData.storeflowid" class="diygw-btn green flex1 margin-xs">确认</button>
					<button data-type="closemodal" @tap="navigateTo" data-id="refuse" class="diygw-btn red flex1 margin-xs">取消</button>
				</view>
			</view>
		</view>
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
				globalData: { iduser: 0, storeflowid: 0 },
				warehouseInfoData: {
					code: 0,
					msg: '',
					data: {
						name: '',
						data: [
							{
								id: 0,
								num: 0,
								examine: '',
								img: null,
								remarks: '',
								title: '',
								specs: '',
								unit: '',
								remarksBack: null,
								createTime: '',
								deleteTime: null,
								projectCn: '',
								flowStatusCn: '',
								storeArticleCn: '',
								userCn: '',
								storeCn: '',
								examineCn: ''
							}
						],
						count: [
							{
								num: 0,
								specs: '',
								title: '',
								unit: ''
							}
						],
						pending: [
							{
								id: 0,
								num: 0,
								examine: '',
								img: null,
								remarks: '',
								title: '',
								specs: '',
								unit: '',
								remarksBack: null,
								createTime: '',
								deleteTime: null,
								projectCn: '',
								flowStatusCn: '',
								storeArticleCn: '',
								userCn: '',
								storeCn: '',
								examineCn: ''
							}
						]
					}
				},
				clickAgreeData: {
					code: 500,
					msg: '入库失败'
				},
				clickRefuseData: {
					code: 500,
					msg: '操作失败'
				},
				agree: '',
				refuse: ''
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
				await this.getUserInfoFunction();
			},
			// 获取我管理的仓库信息 API请求方法
			async warehouseInfoDataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = 'bn/api.storeFlow/warehouseInfo';
				let http_data = {
					iduser: param.iduser || this.globalData.iduser
				};
				let http_header = {};

				let warehouseInfoData = await this.$http.post(http_url, http_data, http_header, 'json');

				this.warehouseInfoData = warehouseInfoData;
			},
			// 同意入库 API请求方法
			async clickAgreeDataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = 'bn/api.storeFlow/licenseInto';
				let http_data = {
					id: param.id || this.globalData.storeflowid
				};
				let http_header = {};

				let clickAgreeData = await this.$http.post(http_url, http_data, http_header, 'json');

				this.clickAgreeData = clickAgreeData;
				this.navigateTo({
					type: 'closemodal',
					id: 'agree'
				});

				if (this.clickAgreeData.code == 200) {
					this.navigateTo({
						type: 'tip',
						tip: '操作成功！'
					});
					await this.warehouseInfoDataApi({});
				} else {
					this.navigateTo({
						type: 'tip',
						tip: '操作失败，请联系管理员！'
					});
				}
			},
			// 拒绝入库 API请求方法
			async clickRefuseDataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = 'bn/api.storeFlow/refuseInto';
				let http_data = {
					id: param.id || this.globalData.storeflowid
				};
				let http_header = {};

				let clickRefuseData = await this.$http.post(http_url, http_data, http_header, 'json');

				this.clickRefuseData = clickRefuseData;
				this.navigateTo({
					type: 'closemodal',
					id: 'refuse'
				});

				if (this.clickRefuseData.code == 200) {
					this.navigateTo({
						type: 'tip',
						tip: '操作成功！'
					});
					await this.warehouseInfoDataApi({});
				} else {
					this.navigateTo({
						type: 'tip',
						tip: '操作失败，请联系管理员！'
					});
				}
			},

			// 获取用户信息 自定义方法
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
					this.globalData.iduser = userinfo.id;
				}

				await this.warehouseInfoDataApi({});
			},

			// 点击同意按钮触发 自定义方法
			async clickAgreeFunction(param) {
				let thiz = this;
				let index = param && (param.index || param.index == 0) ? param.index : thiz.index || '';
				//初始化
				this.globalData.storeflowid = 0;
				console.log(this.warehouseInfoData.data.pending[param.index].id);

				//正式赋值
				this.globalData.storeflowid = this.warehouseInfoData.data.pending[param.index].id;

				//打开弹窗
				this.navigateTo({
					type: 'openmodal',
					id: 'agree'
				});
			},

			// 点击拒绝按钮触发 自定义方法
			async clickRefuseFunction(param) {
				let thiz = this;
				let index = param && (param.index || param.index == 0) ? param.index : thiz.index || '';
				//初始化
				this.globalData.storeflowid = 0;
				console.log(this.warehouseInfoData.data.pending[param.index].id);

				//正式赋值
				this.globalData.storeflowid = this.warehouseInfoData.data.pending[param.index].id;

				//打开弹窗
				this.navigateTo({
					type: 'openmodal',
					id: 'refuse'
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.text-clz {
		margin-left: 5px;
		width: calc(100% - 5px - 5px) !important;
		margin-top: 5px;
		margin-bottom: 5px;
		margin-right: 5px;
	}
	.flex8-clz {
		margin-left: 5px;
		border-top: 1px solid #b1b1b1;
		border-right: 1px solid #b1b1b1;
		border-left: 1px solid #b1b1b1;
		width: calc(100% - 5px - 5px) !important;
		margin-top: 5px;
		margin-bottom: 5px;
		margin-right: 5px;
	}
	.flex9-clz {
		background-color: #f6f6f6;
		border-bottom: 1px solid #b1b1b1;
	}
	.text1-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text2-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text3-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text4-clz {
		padding-top: 5px;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.flex10-clz {
		border-bottom: 1px solid #b1b1b1;
	}
	.text12-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text13-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text14-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text15-clz {
		padding-top: 5px;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.flex2-clz {
		margin-left: 0px;
		width: 100% !important;
		margin-top: 20px;
		margin-bottom: 5px;
		margin-right: 0px;
	}
	.text5-clz {
		margin-left: 5px;
		width: calc(100% - 5px - 5px) !important;
		margin-top: 5px;
		margin-bottom: 5px;
		margin-right: 5px;
	}
	.flex3-clz {
		margin-left: 5px;
		border-top: 1px solid #b1b1b1;
		border-right: 1px solid #b1b1b1;
		border-left: 1px solid #b1b1b1;
		width: calc(100% - 5px - 5px) !important;
		margin-top: 5px;
		margin-bottom: 5px;
		margin-right: 5px;
	}
	.flex4-clz {
		background-color: #f6f6f6;
		border-bottom: 1px solid #b1b1b1;
	}
	.text6-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text7-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text8-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text9-clz {
		padding-top: 5px;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.flex5-clz {
		border-bottom: 1px solid #b1b1b1;
	}
	.text10-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text11-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text16-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text18-clz {
		padding-top: 5px;
		color: #00ff40;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text19-clz {
		padding-top: 5px;
		color: #f90101;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.agree-clz {
		z-index: 1000000;
	}
	.diygw-dialog-agree {
	}
	.text17-clz {
		margin-left: 5px;
		width: calc(100% - 5px - 5px) !important;
		font-size: 22px !important;
		margin-top: 10px;
		margin-bottom: 10px;
		text-align: center;
		margin-right: 5px;
	}
	.refuse-clz {
		z-index: 1000000;
	}
	.diygw-dialog-refuse {
	}
	.text20-clz {
		margin-left: 5px;
		width: calc(100% - 5px - 5px) !important;
		font-size: 22px !important;
		margin-top: 10px;
		margin-bottom: 10px;
		text-align: center;
		margin-right: 5px;
	}
	.container15293 {
		padding-left: 0px;
		padding-right: 0px;
	}
	.container15293 {
	}
</style>
