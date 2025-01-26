<template>
	<view class="container container15293">
		<view class="flex flex-wrap diygw-col-24 items-center flex9-clz">
			<image src="https://YourWebsite.cn/static/gonggao.png" class="diygw-image diygw-col-0" style="height: 18px !important; width: 32px" mode="widthFix"></image>
			<text class="flex icon2 diygw-col-0 icon2-clz diy-icon-right"></text>
			<view class="diygw-col-24 text18-clz diygw-ellipsis"> 编辑功能暂时需要使用电脑端。 </view>
		</view>
		<view v-for="(item, index) in outputData.rows" :key="index" class="flex flex-wrap diygw-col-24 flex12-clz">
			<view class="flex flex-wrap diygw-col-24 items-center flex-clz">
				<view class="diygw-col-0"> 项目： </view>
				<view class="diygw-col-0 text1-clz">
					{{ item.project }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-12 items-center flex1-clz">
				<view class="diygw-col-0"> ID： </view>
				<view class="diygw-col-0">
					{{ item.id }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-12 items-center flex4-clz">
				<view class="diygw-col-0"> 桩型： </view>
				<view class="diygw-col-0">
					{{ item.class }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-24 items-center flex8-clz">
				<view class="diygw-col-0"> 数据创建时间： </view>
				<view class="diygw-col-0 text17-clz">
					{{ item.createTime }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-12 flex2-clz">
				<view class="diygw-col-0"> 桩号： </view>
				<view class="diygw-col-0">
					{{ item.zhuanghao }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-12 items-center flex6-clz">
				<view class="diygw-col-0"> 护简标高： </view>
				<view class="diygw-col-0 text16-clz">
					{{ item.hightHujian }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-12 items-center flex3-clz">
				<view class="diygw-col-0"> 地面标高： </view>
				<view class="diygw-col-0 text14-clz">
					{{ item.hightDimian }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-12 items-center flex5-clz">
				<view class="diygw-col-0"> 设计入岩： </view>
				<view class="diygw-col-0 text13-clz">
					{{ item.estimateRuyan }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-24 items-center flex11-clz">
				<view class="diygw-col-0"> 中风化夹层岩面标高： </view>
				<view class="diygw-col-0 text25-clz">
					{{ item.heightZfhjcymbg }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-24 items-center flex7-clz">
				<view class="diygw-col-0"> 中风化夹层底标高： </view>
				<view class="diygw-col-0 text19-clz">
					{{ item.heightZfhjcdbg }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-12 items-center flex13-clz">
				<view class="diygw-col-0"> 实际入岩： </view>
				<view class="diygw-col-0 text24-clz">
					{{ item.accurateRuyan }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-12 items-center flex14-clz">
				<view class="diygw-col-0"> 桩顶标高： </view>
				<view class="diygw-col-0 text28-clz">
					{{ item.hightZhuangding }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-12 items-center flex15-clz">
				<view class="diygw-col-0"> 终孔： </view>
				<view class="diygw-col-0 text31-clz">
					{{ item.zhongkong }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-12 items-center flex10-clz">
				<view class="diygw-col-0"> 空桩： </view>
				<view class="diygw-col-0 text22-clz">
					{{ item.kongzhuang }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-12 items-center flex18-clz">
				<view class="diygw-col-0"> 实桩： </view>
				<view class="diygw-col-0 text32-clz">
					{{ item.shizhuang }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-12 items-center flex17-clz">
				<view class="diygw-col-0"> 入岩： </view>
				<view class="diygw-col-0 text26-clz">
					{{ item.ruyan }}
				</view>
			</view>
			<view class="flex flex-wrap diygw-col-24 items-center flex16-clz">
				<view class="diygw-col-0"> 打桩日期： </view>
				<view class="diygw-col-0 text34-clz">
					{{ item.dazhuangTime }}
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
				outputData: {
					rows: [
						{
							id: 0,
							project: '',
							class: '',
							zhuanghao: '',
							zhongkong: '',
							hightHujian: '',
							hightDimian: '',
							estimateRuyan: '',
							heightZfhjcymbg: '',
							heightZfhjcdbg: '',
							accurateRuyan: '',
							hightZhuangding: '',
							dazhuangTime: '',
							createTime: '',
							kongzhuang: '',
							shizhuang: '',
							ruyan: ''
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
			// 产值数据 API请求方法
			async outputDataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = '/bn/api.output/apioutput';
				let http_data = {
					pageSize: param.pageSize || '10000'
				};
				let http_header = {};

				let outputData = await this.$http.post(http_url, http_data, http_header, 'json');

				this.outputData = outputData;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.flex9-clz {
		padding-top: 15px;
		border-bottom-left-radius: 15px;
		padding-left: 15px;
		padding-bottom: 15px;
		border-top-right-radius: 15px;
		margin-right: 15px;
		background-color: #ffffff;
		margin-left: 15px;
		box-shadow: 0px 1px 3px rgba(31, 31, 31, 0.16);
		overflow: hidden;
		width: calc(100% - 15px - 15px) !important;
		border-top-left-radius: 15px;
		margin-top: 15px;
		border-bottom-right-radius: 15px;
		margin-bottom: 0px;
		padding-right: 15px;
	}
	.icon2-clz {
		color: #c2c2c2;
	}
	.icon2 {
		font-size: 16px;
	}
	.text18-clz {
		flex: 1;
	}
	.flex12-clz {
		border-bottom-left-radius: 6px;
		font-size: 14px !important;
		border-top-right-radius: 6px;
		margin-right: 15px;
		background-color: rgba(0, 132, 255, 0.03);
		margin-left: 15px;
		box-shadow: 0px 1px 3px rgba(31, 31, 31, 0.16);
		overflow: hidden;
		width: calc(100% - 15px - 15px) !important;
		border-top-left-radius: 6px;
		margin-top: 15px;
		border-bottom-right-radius: 6px;
		margin-bottom: 20px;
	}
	.flex-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		border-bottom: 1px solid #0084ff;
		padding-right: 8px;
	}
	.text1-clz {
		color: #0084ff;
	}
	.flex1-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.flex4-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.flex8-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text17-clz {
		color: #ff0000;
	}
	.flex2-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.flex6-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text16-clz {
		color: #0084ff;
	}
	.flex3-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text14-clz {
		color: rgba(255, 0, 0, 0.97);
	}
	.flex5-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text13-clz {
		color: #f70505;
	}
	.flex11-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text25-clz {
		color: #ff0000;
	}
	.flex7-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text19-clz {
		color: #0084ff;
	}
	.flex13-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text24-clz {
		color: rgba(255, 0, 0, 0.97);
	}
	.flex14-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text28-clz {
		color: rgba(255, 0, 0, 0.97);
	}
	.flex15-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text31-clz {
		color: rgba(255, 0, 0, 0.97);
	}
	.flex10-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text22-clz {
		color: rgba(255, 0, 0, 0.97);
	}
	.flex18-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text32-clz {
		color: rgba(255, 0, 0, 0.97);
	}
	.flex17-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text26-clz {
		color: rgba(255, 0, 0, 0.97);
	}
	.flex16-clz {
		padding-top: 8px;
		padding-left: 8px;
		padding-bottom: 8px;
		padding-right: 8px;
	}
	.text34-clz {
		color: #ff0000;
	}
	.container15293 {
		padding-left: 0px;
		padding-right: 0px;

		font-size: 12px;
	}
	.container15293 {
	}
</style>
