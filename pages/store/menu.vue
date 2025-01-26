<template>
	<view class="container container15293">
		<view class="flex diygw-col-24">
			<view class="diygw-grid col-3">
				<view @tap="navigateTo" data-type="page" data-url="/pages/store/into" class="diygw-grid-item">
					<view class="diygw-grid-inner">
						<view class="diygw-grid-icon diygw-avatar diy-icon-deliver"> </view>
						<view class="diygw-grid-title"> 入库 </view>
					</view>
				</view>
				<view @tap="navigateTo" data-type="page" data-url="/pages/store/out" class="diygw-grid-item">
					<view class="diygw-grid-inner">
						<view class="diygw-grid-icon diygw-avatar diy-icon-cart"> </view>
						<view class="diygw-grid-title"> 出库 </view>
					</view>
				</view>
				<view @tap="navigateTo" data-type="page" data-url="/pages/store/manage" class="diygw-grid-item">
					<view class="diygw-grid-inner">
						<view class="diygw-grid-icon diygw-avatar diy-icon-location"> </view>
						<view class="diygw-grid-title"> 我管理的仓库 </view>
					</view>
				</view>
				<view @tap="navigateTo" data-type="page" data-url="/pages/store/myassets" class="diygw-grid-item">
					<view class="diygw-grid-inner">
						<view class="diygw-grid-icon diygw-avatar diy-icon-people"> </view>
						<view class="diygw-grid-title"> 我名下的资产 </view>
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
				globalData: {}
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
			async init() {}
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
