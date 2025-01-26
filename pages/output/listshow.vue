<template>
	<view class="container container15293">
		<view v-for="(item, index) in outputData.rows" :key="index" class="flex flex-wrap diygw-col-24 flex-direction-column flex1-clz">
			<view class="flex diygw-col-24 items-center flex-wrap flex-clz">
				<view class="diygw-col-0 text2-clz diygw-ellipsis"> 桩号：{{ item.zhuanghao }} </view>
				<text class="flex icon diygw-col-0 diy-icon-star"></text>
			</view>
			<view class="flex flex-wrap diygw-col-24 items-center flex3-clz">
				<view class="flex diygw-col-12 items-center flex-wrap flex2-clz">
					<view class="diygw-col-0"> 来源： </view>
					<view class="diygw-col-0 diygw-ellipsis"> 数据中心 </view>
				</view>
				<view class="flex diygw-col-12 items-center flex-wrap flex4-clz">
					<view class="diygw-col-0"> 时间： </view>
					<view class="diygw-col-0 diygw-ellipsis">
						{{ item.create_time }}
					</view>
				</view>
			</view>
		</view>
		<view class="flex diygw-col-24">
			<button @tap="navigateTo" data-type="page" data-url="/pages/index" class="diygw-btn green radius-xs flex-sub margin-xs button-button-clz">返回首页</button>
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
				globalData: { iduser: '' },
				outputData: {
					rows: [
						{
							id: 0,
							id_project: 0,
							zhuanghao: '',
							id_user: 0,
							id_zhuangxing: 0,
							remarks: null,
							hight_hujian: 'ssssa',
							hight_dimian: 'dsdsd',
							estimate_ruyan: 'sasda',
							height_zfhjcymbg: 'asdsad',
							height_zfhjcdbg: 'dsadas',
							accurate_ruyan: 'asdas',
							hight_zhuangding: 'asdas',
							zhongkong: 'asdas',
							img_dakong: 'asdasd',
							img_yanzhuang: 'asdsa',
							img_yanlong: '',
							img_yanyang: '',
							create_time: '',
							update_time: '',
							delete_time: null,
							dazhuang_time: '',
							dingxing: '',
							jiazhi: null,
							look: null,
							show: null,
							risk: '',
							img_a: '',
							img_b: '',
							chongying: ''
						}
					],
					code: 0,
					msg: ''
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
			async init() {
				await this.outputDataApi();
			},
			// outputlist API请求方法
			async outputDataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = '/bn/api.output/listoutput';
				let http_data = {
					iduser: param.iduser || this.userInfo.id
				};
				let http_header = {};

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
					//this.globalData.iduser = userinfo['idUser']
					//console.log(this.userInfo.id)
				}
				let outputData = await this.$http.post(http_url, http_data, http_header, 'json');

				this.outputData = outputData;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.flex1-clz {
		padding-top: 10px;
		padding-left: 10px;
		padding-bottom: 10px;
		border-bottom: 6px solid #eee;
		padding-right: 10px;
	}
	.text2-clz {
		flex: 1;
	}
	.icon {
		font-size: 20px;
	}
	.flex3-clz {
		padding-top: 5px;
		padding-left: 0px;
		padding-bottom: 0px;
		padding-right: 0px;
	}
	.button-button-clz {
		margin: 50px !important;
	}
	.container15293 {
		padding-left: 0px;
		padding-right: 0px;

		font-size: 12px;
	}
	.container15293 {
	}
</style>
