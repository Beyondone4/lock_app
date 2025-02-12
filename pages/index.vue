<template>
	<view class="container container15293">
		<view class="diygw-col-24">
			<view class="diygw-search">
				<view class="flex1 align-center flex padding-xs solid radius">
					<text style="color: #555 !important" class="diy-icon-search"></text>
					<input class="flex1" name="search" type="" v-model="search" placeholder="请输入关键字" />
				</view>
				<view style="color: #333 !important" class="diygw-tag margin-left-xs radius-xs"> 搜索 </view>
			</view>
		</view>
		<view class="flex diygw-col-24">
			<swiper class="swiper" indicator-color="rgba(51, 51, 51, 0.39)" indicator-active-color="#fff" indicator-dots="true" autoplay interval="3000" circular="true" style="height: 200px">
				<swiper-item v-for="(item, index) in hdp.rows" :key="index" class="diygw-swiper-item">
					<view class="diygw-swiper-item-wrap">
						<image :src="item.img" class="diygw-swiper-image"></image>
						<view class="diygw-swiper-item-title">
							{{ item.title }}
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view @tap="navigateTo" data-type="page" data-url="/pages/reimbursementAll" class="diygw-title flex diygw-col-24">
			<view class="title font-normal"> <text class="diy-icon-home"></text> 快捷入口 </view>
		
		</view>
		<view class="flex diygw-col-24">
			<view class="diygw-grid col-3">
				<view  @tap="navigateTo" data-type="page" data-url="/pages/order/index" class="diygw-grid-item">
					<view class="diygw-grid-inner">
						<view class="diygw-grid-icon diygw-avatar diy-icon-vipcard"> </view>
						<view class="diygw-grid-title"> 工单详情 </view>
					</view>
				</view>
				<view v-if="isAdmin" @tap="navigateTo" data-type="page" data-url="/pages/human/human" class="diygw-grid-item">
					<view class="diygw-grid-inner">
						<view class="diygw-grid-icon diygw-avatar diy-icon-profile"> </view>
						<view class="diygw-grid-title"> 人员管理 </view>
					</view>
				</view>
				<view v-if="isAdmin" @tap="navigateTo" data-type="page" data-url="/pages/lock/index" class="diygw-grid-item">
					<view class="diygw-grid-inner">
						<view class="diygw-grid-icon diygw-avatar diy-icon-magic"> </view>
						<view class="diygw-grid-title"> 锁具管理 </view>
					</view>
				</view>
				<view v-if="isAdmin" @tap="navigateTo" data-type="page" data-url="/pages/station/index" class="diygw-grid-item">
					<view class="diygw-grid-inner">
						<view class="diygw-grid-icon diygw-avatar diy-icon-shop"> </view>
						<view class="diygw-grid-title"> 站点管理 </view>
					</view>
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
				hdp: {
					rows: [
						{
							id: 2,
							title: '测试幻灯2',
							sort: 2,
							img: 'http://YourWebsite.cn/storage/20230105/ea111afc34ef0377f0aff93089acda39.jpg',
							createTime: '2023-01-05 21:48:32',
							updateTime: '2023-01-05 21:48:32',
							deleteTime: null
						},
						{
							id: 1,
							title: ' 测试幻灯3',
							sort: 3,
							img: 'https://mjke.oss-cn-shenzhen.aliyuncs.com/0b4d5202212060953199408.jpg',
							createTime: '2023-01-05 20:58:26',
							updateTime: '2023-01-05 21:46:36',
							deleteTime: null
						}
					],
					total: 2,
					code: 200,
					msg: 'success'
				},
				search: ''
			};
		},
		computed:{
			isAdmin(){
				let roles=uni.getStorageSync('user').roles
				const hasId5 = roles.some(item => item.id === 1)
				return hasId5
			},
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
				await this.hdpApi();
			},
			// 幻灯片 API请求方法
			async hdpApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = '/bn/api.banner/list';
				let http_data = {};
				let http_header = {};

				let hdp = await this.$http.get(http_url, http_data, http_header, 'json');

				this.hdp = hdp;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.container15293 {
		padding-left: 0px;
		padding-right: 0px;
	}
	.container15293 {
	}
</style>
