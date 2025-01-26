<template>
	<view class="container container15293">
		<view v-for="(item, index) in inventoryData.data.statistics" :key="index" class="flex flex-wrap diygw-col-24 flex-direction-column flex3-clz">
			<view class="diygw-col-24 text16-clz diygw-text-lg text-cyan">
				{{ item.name }}
			</view>
			<view class="flex flex-wrap diygw-col-24 flex-clz">
				<view class="diygw-col-0 text-clz"> 物品 </view>
				<view class="diygw-col-0 text2-clz"> 规格 </view>
				<view class="diygw-col-0 text1-clz"> 数量 </view>
				<view class="diygw-col-0 text3-clz"> 单位 </view>
			</view>
			<view v-for="(item, index) in item.count" :key="index" class="flex flex-wrap diygw-col-24 flex4-clz">
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
				inventoryData: {
					code: 0,
					msg: '',
					data: {
						statistics: [
							{
								name: '',
								count: [
									{
										num: 0,
										specs: '',
										title: '',
										unit: ''
									}
								]
							}
						]
					}
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
				await this.inventoryDataApi();
			},
			// 库存统计 API请求方法
			async inventoryDataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = 'bn/api.storeFlow/inventory';
				let http_data = {};
				let http_header = {};

				let inventoryData = await this.$http.post(http_url, http_data, http_header, 'json');

				this.inventoryData = inventoryData;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.flex3-clz {
		margin-left: 5px;
		border-top: 1px solid #b1b1b1;
		border-right: 1px solid #b1b1b1;
		border-left: 1px solid #b1b1b1;
		width: calc(100% - 5px - 5px) !important;
		margin-top: 5px;
		margin-bottom: 20px;
		margin-right: 5px;
	}
	.text16-clz {
		margin-left: 5px;
		width: calc(100% - 5px - 5px) !important;
		margin-top: 5px;
		margin-bottom: 5px;
		margin-right: 5px;
	}
	.flex-clz {
		background-color: #f6f6f6;
		border-bottom: 1px solid #b1b1b1;
	}
	.text-clz {
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
	.text1-clz {
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
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.flex4-clz {
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
	.container15293 {
		padding-left: 0px;
		padding-right: 0px;
	}
	.container15293 {
	}
</style>
