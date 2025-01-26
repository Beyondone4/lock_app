<template>
	<view class="container container15293">
		<view class="flex flex-wrap diygw-col-24 flex-direction-column flex2-clz">
		<view class="toolbar">
		  <button class="btn" @tap="navigateTo" data-type="page" data-url="pages/human/roster">新增</button>
		  <button class="btn" @tap="onBatchDelete">批量删除</button>
		
		  <!-- 搜索框区域 -->
		  <view class="search-box">
		    <input
		      class="search-input"
		      v-model="searchKeyword"
		      placeholder="请输入关键字搜索"
		    />
		    <button class="btn" @tap="onSearch">搜索</button>
			  <button class="btn" @tap="onSearch">重置</button>
		  </view>
		</view>
			<view class="uni-container">
				<uni-table  ref="table" :loading="loading" border stripe type="selection" emptyText="暂无更多数据" @selection-change="selectionChange">
					<uni-tr>
						<uni-th width="50" align="center">工号</uni-th>
						<uni-th width="50" align="center">姓名</uni-th>
						<uni-th  align="center">联系方式</uni-th>
						<uni-th width="180" align="center">设置</uni-th>
					</uni-tr>
					<uni-tr  v-for="(item, index) in humansData" :key="index" >
						<uni-td>{{ item.id }}</uni-td>
						<uni-td>
							<view class="name">{{ item.username }}</view>
						</uni-td>
						<uni-td align="center">{{ item.email }}</uni-td>
						<uni-td >
						<button style="margin-right: 5rpx;" type="primary" size="mini"   @click="clickDetailFunction(item,'detail')">详情</button>
						<button type="primary" size="mini"  @click="clickDetailFunction(item,'update')">修改</button>
						<button style="margin-right: 5rpx;" type="warn" size="mini"  @click="clickDetailFunction(item,'update')">重置密码</button>
						<button type="warn" size="mini" >删除</button>
						</uni-td>
					</uni-tr>
				</uni-table>
	<view class="uni-pagination-box"><uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total" @change="change" /></view>
			</view>
	
		</view>
		<view class="diygw-modal basic" :class="detail"  style="z-index: 1000000">
			<view class="diygw-dialog diygw-dialog-return basis-lg">
				<view class="justify-end diygw-bar">
					<view class="content"> {{this.currentModalTitle}} </view>
					<view class="action" data-type="closemodal" data-id="detail" @tap="navigateTo">
						<i class="diy-icon-close"></i>
					</view>
				</view>
				<view>
					<view style="padding: 20rpx;">
	<uni-forms :modelValue="this.selectedItem">
		<uni-forms-item label="姓名" name="name">
						<uni-easyinput type="text" v-model="selectedItem.username" :disabled='this.inputDisabled[this.currentModal]' />
					</uni-forms-item>
					<uni-forms-item  name="phone" label="联系方式">
						<uni-easyinput type="text" v-model="selectedItem.phone" :disabled='this.inputDisabled[this.currentModal]' />
					</uni-forms-item>
					<uni-forms-item  name="email" label="邮箱">
						<uni-easyinput type="text" v-model="selectedItem.email" :disabled='this.inputDisabled[this.currentModal]'  />
					</uni-forms-item>
					<uni-forms-item  name="gender" label="权限">
						<uni-easyinput type="text" v-model="selectedItem.roles" :disabled='this.inputDisabled[this.currentModal]'  />
					</uni-forms-item>
					<uni-forms-item  name="gender" label="性别">
						<uni-easyinput type="text" v-model="selectedItem.gender" :disabled='this.inputDisabled[this.currentModal]'  />
					</uni-forms-item>
	</uni-forms>
	</view>
</view>

				<view class="flex justify-end">
					<button v-if="this.currentModal=='update'" data-type="closemodal" @tap="navigateTo" data-id="detail" class="diygw-btn red flex1 margin-xs">重置密码</button>
					<button  v-if="this.currentModal=='update'" data-type="closemodal" @tap="navigateTo" data-id="detail" class="diygw-btn red flex1 margin-xs">保存</button>
					<button  data-type="closemodal" @tap="navigateTo" data-id="detail" class="diygw-btn red flex1 margin-xs">关闭</button>
				</view>
			</view>
		</view>

		<view class="diygw-modal basic" :class="consumed" style="z-index: 1000000">
			<view class="diygw-dialog diygw-dialog-consumed basis-lg">
				<view class="justify-end diygw-bar">
					<view class="content"> 删除 </view>
					<view class="action" data-type="closemodal" data-id="consumed" @tap="navigateTo">
						<i class="diy-icon-close"></i>
					</view>
				</view>
				<view>
					<view class="flex diygw-dialog-content">
						<view class="diygw-col-24 text29-clz"> 删除后该账户信息将被清空，请确认删除！ </view>
					</view>
				</view>
				<view class="flex justify-end">
					<button @tap="navigateTo" data-type="clickConsumedDataApi" :data-id="globalData.storeflowid" class="diygw-btn green flex1 margin-xs">确认</button>
					<button data-type="closemodal" @tap="navigateTo" data-id="consumed" class="diygw-btn red flex1 margin-xs">取消</button>
				</view>
			</view>
		</view>
		<view class="clearfix"></view>
	</view>
</template>

<script>
import {getUserInfo,getUserList} from '../../api/user.js'
	export default {
		data() {
			return {
				//用户全局信息
				userInfo: {},
				currentModal:'',//当前弹窗
				currentModalTitle:'',//当前弹窗标题
				inputDisabled:{
					'detail':true,
					'update':false
				},//判断是否弹窗输入框可用
				//页面传参
				globalOption: {},
				//自定义全局变量
				globalData: { iduser: 0, storeflowid: 0 },
				selectedItem:{},
				selectedIds:[],
				// 每页数据量
							pageSize: 10,
							// 当前页
							pageCurrent: 1,
							// 数据总量
							total: 4,
				checkboxValue1:[],
				isAll:{
					value:'all',
					name:'全选'},
				humansData: {
					
				},
				clickRseIntoData: {
					code: 500,
					msg: '回仓失败'
				},
				clickConsumedData: {
					code: 500,
					msg: '操作失败'
				},
				returned: '',
				consumed: '',
				detail:''
			};
		},
		computed: {
			
		    // 判断是否全选
		    isAllSelected() {
		      return this.humansData.data.length > 0 && this.humansData.data.every(item =>item.checked==true);
		    }
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
			// 多选处理
					selectedItems() {
						return this.selectedIndexs.map(i => this.tableData[i])
					},
					// 多选
					selectionChange(e) {
						console.log(e.detail.index)
						this.selectedIndexs = e.detail.index
					},
					//批量删除
					delTable() {
						console.log(this.selectedItems())
					},
					// 分页触发
					change(e) {
						this.$refs.table.clearSelection()
						this.selectedIndexs.length = 0
						this.getData(e.current)
					},
					getData(current){
						getUserList({pageNo:current}).then(res=>{
							if(res.data.code==10002){
								uni.clearStorageSync()
								this.navigateTo({
								  type: 'page',
								  url: 'login'
								});
							}
							this.humansData=res.data.data.pageData
						})
					},
			async init() {
				await getUserList().then(res=>{
					console.log(res)
					if(res.data.code==10002){
						uni.clearStorageSync()
						this.navigateTo({
						  type: 'page',
						  url: 'login'
						});
					}
					this.humansData=res.data.data.pageData
					this.total=res.data.data.total
				});
			},
			onAdd(){
				console.log('触发新增按钮')
			},
			 // 切换单个复选框的状态
			  	checkboxChange: function (e) {
			  				var items = this.humansData.data
			  					
								console.log(items)
								console.log(e)
							
							var item=items.filter(item=>item.id==e.detail.value[0].id)
							console.log(item)
					
			  				for (var i = 0, lenI = items.length; i < lenI; ++i) {
			  					const item = items[i]
			  					if(e.detail.value[0].id==item.id){
			  						this.$set(item,'checked',true)
			  					}else{
			  						this.$set(item,'checked',false)
			  					}
			  				}
			  			},
			    // 切换全选/取消全选
			    toggleAll(e) {
			
				  console.log(e)
			
			      if (e.detail.value[0]) {
			        // 如果全选，就将当前页面的所有 id 加入 selectedIds
			         this.humansData.data.map(item => this.$set(item,'checked',true));
			      } else {
			        // 如果取消全选，就清空 selectedIds
			         this.humansData.data.map(item => this.$set(item,'checked',false));
			      }
			    },
			// 我名下的资产 API请求方法
			async myassetsDataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = 'bn/api.storeFlow/myassets';
				let http_data = {};
				let http_header = {};

				let myassetsData = await this.$http.post(http_url, http_data, http_header, 'json');

				this.myassetsData = myassetsData;
			},
			// 回仓 API请求方法
			async clickRseIntoDataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = 'bn/api.storeFlow/rseInto';
				let http_data = {
					id: param.id || this.globalData.storeflowid
				};
				let http_header = {};

				let clickRseIntoData = await this.$http.post(http_url, http_data, http_header, 'json');

				this.clickRseIntoData = clickRseIntoData;
				this.navigateTo({
					type: 'closemodal',
					id: 'return'
				});

				if (this.clickRseIntoData.code == 200) {
					this.navigateTo({
						type: 'tip',
						tip: '操作成功！'
					});
					await this.myassetsDataApi({});
				} else {
					this.navigateTo({
						type: 'tip',
						tip: '操作失败，请联系管理员！'
					});
				}
			},
			// 已消耗 API请求方法
			async clickConsumedDataApi(param) {
				let thiz = this;
				param = param || {};
				//请求地址及请求数据，可以在加载前执行上面增加自己的代码逻辑
				let http_url = 'bn/api.storeFlow/isConsumed';
				let http_data = {
					id: param.id || this.globalData.storeflowid
				};
				let http_header = {};

				let clickConsumedData = await this.$http.post(http_url, http_data, http_header, 'json');

				this.clickConsumedData = clickConsumedData;
				this.navigateTo({
					type: 'closemodal',
					id: 'consumed'
				});

				if (this.clickConsumedData.code == 200) {
					this.navigateTo({
						type: 'tip',
						tip: '操作成功！'
					});
					await this.myassetsDataApi({});
				} else {
					this.navigateTo({
						type: 'tip',
						tip: '操作失败，请联系管理员！'
					});
				}
			},

			// 获取用户信息（新） 自定义方法
		
			// 点击回仓按钮触发 自定义方法
			async clickDetailFunction(param,e) {
				if(e=='detail'){
					this.currentModal='detail'
					this.currentModalTitle='详情'
				}
				if(e=='update'){
					this.currentModal='update'
					this.currentModalTitle='修改'
				}
				let thiz = this;
				thiz.selectedItem=param
				let index = param && (param.index || param.index == 0) ? param.index : thiz.index || '';
				//初始化
				this.globalData.storeflowid = 0;
				
				thiz.globalData.storeflowid = param.id;
			
				//打开弹窗
				thiz.navigateTo({
					type: 'openmodal',
					id: 'detail'
				});
			},
		

			// 点击回仓按钮触发 自定义方法
			async clickReturnFunction(param) {
				let thiz = this;
				let index = param && (param.index || param.index == 0) ? param.index : thiz.index || '';
				//初始化
				this.globalData.storeflowid = 0;
				console.log("xxxxxxxxx");

				//正式赋值
				console.log(param.index);
				
				thiz.globalData.storeflowid = thiz.humansData.data[param.index].id;

				//打开弹窗
				thiz.navigateTo({
					type: 'openmodal',
					id: 'returned'
				});
			},

			// 点击消耗按钮触发 自定义方法
			async clickConsumedFunction(param) {
				let thiz = this;
				let index = param && (param.index || param.index == 0) ? param.index : thiz.index || '';
				//初始化
				thiz.globalData.storeflowid = 0;
				console.log(thiz.humansData.data[param.index].id);

				//正式赋值
				thiz.globalData.storeflowid = thiz.humansData.data[param.index].id;

				//打开弹窗
				thiz.navigateTo({
					type: 'openmodal',
					id: 'consumed'
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	/* 父容器：让所有子元素在同一行、垂直居中 */
	.toolbar {
	  display: flex;
	  align-items: center;
	  padding: 1rpx;
	  background-color: #f8f8f8; /* 浅色背景，区分内容区域 */
	}
	
	/* 按钮样式 */
	.btn {
	  height: 50rpx;
	  line-height: 50rpx;
	  margin-right: 12rpx;
	  padding: 0 16rpx;
	  background-color: #007aff; /* 主色 */
	  color: #fff;
	  border-radius: 6rpx;
	  font-size: 24rpx;
	  box-sizing: border-box; 
	}
	
	/* 将搜索框区域顶到右侧 */
	.search-box {
	  display: flex;
	  align-items: center;
	  margin-left: auto; /* 左侧自动扩展，把搜索框推到右边 */
	}
	
	/* 搜索输入框，和按钮同高 */
	.search-input {
	  width: 240rpx;
	  height: 50rpx;
	  line-height: 50rpx;
	  border: 1rpx solid #ccc;
	  border-radius: 6rpx;
	  margin-right: 12rpx;
	  padding: 0 10rpx;
	  font-size: 24rpx;
	  box-sizing: border-box;
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
		color: #ffaa00;
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
	.text18-detail-clz {
		padding-top: 5px;
		color: #00ff00;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.flex9-clz {
		margin-left: 5px;
		width: calc(100% - 5px - 5px) !important;
		margin-top: 20px;
		margin-bottom: 5px;
		margin-right: 5px;
	}
	.text17-clz {
		margin-left: 5px;
		width: calc(100% - 5px - 5px) !important;
		margin-top: 5px;
		margin-bottom: 5px;
		margin-right: 5px;
	}
	.flex10-clz {
		margin-left: 5px;
		border-top: 1px solid #b1b1b1;
		border-right: 1px solid #b1b1b1;
		border-left: 1px solid #b1b1b1;
		width: calc(100% - 5px - 5px) !important;
		margin-top: 5px;
		margin-bottom: 5px;
		margin-right: 5px;
	}
	.flex11-clz {
		background-color: #f6f6f6;
		border-bottom: 1px solid #b1b1b1;
	}
	.text20-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text21-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text22-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text23-clz {
		padding-top: 5px;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.flex12-clz {
		border-bottom: 1px solid #b1b1b1;
	}
	.text24-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text25-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text26-clz {
		padding-top: 5px;
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.text27-clz {
		padding-top: 5px;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.flex-clz {
		margin-left: 0px;
		width: 100% !important;
		margin-top: 20px;
		margin-bottom: 5px;
		margin-right: 0px;
	}
	.text-clz {
		margin-left: 5px;
		width: calc(100% - 5px - 5px) !important;
		margin-top: 5px;
		margin-bottom: 5px;
		margin-right: 5px;
	}
	.flex1-clz {
		margin-left: 5px;
		border-top: 1px solid #b1b1b1;
		border-right: 1px solid #b1b1b1;
		border-left: 1px solid #b1b1b1;
		width: calc(100% - 5px - 5px) !important;
		margin-top: 5px;
		margin-bottom: 5px;
		margin-right: 5px;
	}
	.flex7-clz {
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
	.flex8-clz {
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
		border-right: 1px solid #b1b1b1;
		flex: 1;
		padding-left: 5px;
		padding-bottom: 5px;
		text-align: center;
		padding-right: 5px;
	}
	.return-clz {
		z-index: 1000000;
	}
	.diygw-dialog-return {
	}
	.text28-clz {
		padding-top: 5px;
		padding-left: 5px;
		font-size: 18px !important;
		padding-bottom: 5px;
		padding-right: 5px;
	}
	.consumed-clz {
		z-index: 1000000;
	}
	.diygw-dialog-consumed {
	}
	.text29-clz {
		padding-top: 5px;
		padding-left: 5px;
		font-size: 18px !important;
		padding-bottom: 5px;
		padding-right: 5px;
	}
	.container15293 {
		padding-left: 0px;
		padding-right: 0px;
	}
	.container15293 {
	}
	.uni-container{
		width: 100%;
	}
/* 模拟表格整体 */
.detail-table {
  display: table; 
  width: 100%; /* 占满父容器宽度 */
  border-collapse: collapse; /* 合并边框，类似 <table border-collapse="collapse"> */
  margin: 24rpx; /* 让表格离弹窗边有点间距 */
  background-color: #fff; /* 里面一般是白底 */
}



</style>
