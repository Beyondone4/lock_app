<template>
	<view class="container container15293">
		<view class="diygw-col-24 xm-clz"> 项目支出可视化分析 </view>
		<view style="height: 800rpx" class="flex diygw-col-24">
			<qiun-data-charts type="ring" :opts="ringOpts" :chartData="analysisData.analysisProject" />
		</view>
		<view class="diygw-col-24 text-clz"> 支出费用分类可视化分析 </view>
		<view style="height: 400rpx" class="flex diygw-col-24 pie-clz">
			<qiun-data-charts type="pie" :opts="pieOpts" :chartData="analysisData.analysisClass" />
		</view>
		<view class="diygw-col-24 text1-clz"> 月度费用支出统计（大数据） </view>
		<view style="height: 400rpx" class="flex diygw-col-24">
			<qiun-data-charts type="line" :opts="linechartOpts" :chartData="analysisData.analysisMonth" />
		</view>
		<view class="diygw-col-24 text2-clz"> 大额支出项展示（仅展示部分） </view>
		<view class="flex flex-wrap diygw-col-24 flex-clz">
			<view class="flex flex-wrap diygw-col-4 flex-direction-column justify-center ID-clz">
				<view class="diygw-col-24 text3-clz"> ID </view>
			</view>
			<view class="flex flex-wrap diygw-col-6 flex-direction-column justify-center 总价-clz">
				<view class="diygw-col-24 text4-clz"> 总价 </view>
			</view>
			<view class="flex flex-wrap diygw-col-14 flex-direction-column flex1-clz">
				<view class="diygw-col-24 text5-clz"> 描述 </view>
			</view>
		</view>
		<view v-for="(item, index) in analysisData.analysisBill" :key="index" class="flex flex-wrap diygw-col-24 flex2-clz">
			<view class="flex flex-wrap diygw-col-4 flex-direction-column justify-center flex3-clz">
				<view class="diygw-col-24">
					{{ item.id }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-6 flex-direction-column justify-center flex4-clz">
				<view class="diygw-col-24 text7-clz">
					{{ item.priceAll }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-14 flex-direction-column flex5-clz">
				<view class="diygw-col-24 text8-clz">
					{{ item.remarks }}
				</view>
			</view>
		</view>
		<view class="flex diygw-col-24 button-clz">
			<button @tap="navigateTo" data-type="page" data-url="/pages/boss/caiwu/zhichu" class="diygw-btn green radius-xs flex-sub margin-xs button-button-clz">查看更多数据</button>
		</view>
		<view class="flex diygw-col-24 button1-clz">
			<button class="diygw-btn red radius-xs flex-sub margin-xs button1-button-clz">工程产值数据未上报，暂时无法分析</button>
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
				analysisData: {
					analysisProject: {
						series: [
							{
								name: '',
								data: 0
							}
						]
					},
					analysisClass: {
						series: [
							{
								class_sum: '',
								name: '',
								data: 0
							}
						]
					},
					analysisMonth: {
						categories: ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05'],
						series: [
							{
								name: '',
								data: ['20262.33', '148292.70', '158907.08', '67192.48', '4889.57']
							}
						]
					},
					analysisBill: [
						{
							id: 0,
							project: '',
							class: '',
							quantity: 0,
							reimburser: '',
							supervisor: '',
							price: '',
							flowname: '',
							remarks: '',
							priceAll: '',
							remarksBack: null,
							orderTime: '',
							createTime: ''
						}
					],
					code: 0,
					msg: ''
				},
				ringOpts: {
					type: 'ring',
					color: ['#1890FF', '#91CB74', '#FAC858', '#EE6666', '#73C0DE', '#3CA272', '#FC8452', '#9A60B4', '#ea7ccc'],
					padding: [5, 5, 5, 5],
					rotate: false,
					dataLabel: true,
					legend: { show: true, position: 'right', lineHeight: 25 },
					title: { name: '项目支出', fontSize: 15, color: '#666666' },
					subtitle: { name: '主占', fontSize: 25, color: '#7cb5ec' },
					extra: { ring: { linearType: 'custom', linearOpacity: 0.9, ringWidth: 30, activeOpacity: 0.5, activeRadius: 10, offsetAngle: 0, labelWidth: 15, border: true, borderWidth: 3, borderColor: '#FFFFFF' } }
				},

				pieOpts: { type: 'pie', color: ['#1890FF', '#91CB74', '#FAC858', '#EE6666', '#73C0DE', '#3CA272', '#FC8452', '#9A60B4', '#ea7ccc', '#533a00', '#6666FF', '#FF0000', '#FF6600', '#99CC00', '#6600FF'], padding: [5, 5, 5, 5], extra: { pie: { linearType: 'custom', linearOpacity: 0.9, activeOpacity: 0.5, activeRadius: 10, offsetAngle: 0, labelWidth: 15, border: false, borderColor: '#FFFFFF' } } },

				linechartOpts: { type: 'line', color: ['#1890FF', '#91CB74', '#FAC858', '#EE6666', '#73C0DE', '#3CA272', '#FC8452', '#9A60B4', '#ea7ccc'], padding: [15, 10, 0, 15], xAxis: { disableGrid: true }, yAxis: { gridType: 'dash', dashLength: 2 }, legend: {}, extra: { line: { linearType: 'custom', linearOpacity: 0.9, type: 'straight', width: 2 } } }
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
				await this.analysisDataApi();
			},
			// 获取数据分析结果 API请求方法
			async analysisDataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = 'bn/api.reimbursement/analysis';
				let http_data = {};
				let http_header = {};

				let analysisData = await this.$http.post(http_url, http_data, http_header, 'json');

				this.analysisData = analysisData;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.xm-clz {
		padding-top: 10px;
		padding-left: 5px;
		font-size: 16px !important;
		padding-bottom: 10px;
		text-align: center;
		padding-right: 5px;
	}
	.text-clz {
		border-top: 1px solid #0084ff;
		padding-top: 10px;
		padding-left: 5px;
		font-size: 16px !important;
		padding-bottom: 10px;
		text-align: center;
		padding-right: 5px;
	}
	.pie-clz {
		flex-shrink: 0;
		height: 520px !important;
	}
	.text1-clz {
		border-top: 1px solid #0084ff;
		padding-top: 10px;
		padding-left: 5px;
		font-size: 16px !important;
		padding-bottom: 10px;
		text-align: center;
		padding-right: 5px;
	}
	.text2-clz {
		border-top: 1px solid #0084ff;
		padding-top: 10px;
		padding-left: 5px;
		font-size: 16px !important;
		padding-bottom: 10px;
		text-align: center;
		padding-right: 5px;
	}
	.ID-clz {
		font-size: 18px !important;
		text-align: center;
	}
	.text3-clz {
		border: 1px solid #0084ff;
	}
	.text4-clz {
		border: 1px solid #0084ff;
		font-size: 18px !important;
		text-align: center;
	}
	.text5-clz {
		border: 1px solid #0084ff;
		font-size: 18px !important;
		text-align: center;
	}
	.flex3-clz {
		border: 1px solid #0084ff;
		font-size: 18px !important;
		text-align: center;
	}
	.flex4-clz {
		border: 1px solid #0084ff;
	}
	.text7-clz {
		font-size: 18px !important;
		text-align: center;
	}
	.text8-clz {
		border: 1px solid #0084ff;
		padding-top: 10px;
		padding-left: 10px;
		font-size: 18px !important;
		padding-bottom: 10px;
		text-align: center;
		padding-right: 10px;
	}
	.button-clz {
		padding-top: 20px;
		padding-left: 20px;
		padding-bottom: 20px;
		padding-right: 20px;
	}
	.button-button-clz {
		margin: 3px !important;
	}
	.button1-clz {
		padding-top: 20px;
		padding-left: 20px;
		padding-bottom: 20px;
		padding-right: 20px;
	}
	.button1-button-clz {
		margin: 3px !important;
	}
	.container15293 {
		padding-left: 0px;
		padding-right: 0px;
	}
	.container15293 {
	}
</style>
