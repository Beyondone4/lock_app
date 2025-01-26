<template>
	<view class="container container15293">
		<view class="flex flex-wrap diygw-col-24 flex-direction-column flex2-clz">
		<view class="toolbar">
		  <button class="btn"  @click="clickDetailFunction(item,'create')" >新增</button>
		  <button class="btn" @tap="onDelete('batch')">批量删除</button>
		
		  <!-- 搜索框区域 -->
		  <view class="search-box">
		    <input
		      class="search-input"
		      v-model="searchKeyword"
		      placeholder="请输入站点名搜索"
		    />
			
		    <button class="btn" @tap="onSearch">搜索</button>
			  <button class="btn" @tap="init">重置</button>
		  </view>
		</view>
			<view class="uni-container">
				<uni-table  ref="table" :loading="loading" border stripe type="selection" emptyText="暂无更多数据" @selection-change="selectionChange">
					<uni-tr>
						<uni-th width="50" align="center">站点名称</uni-th>
						<uni-th width="50" align="center">站点编码</uni-th>
						<uni-th  align="center">站点位置</uni-th>
						<uni-th  align="center">站点管理员</uni-th>
						<uni-th  align="center">站点类型</uni-th>
						<uni-th width="160" align="center">设置</uni-th>
					</uni-tr>
					<uni-tr  v-for="(item, index) in stationList" :key="index" >
						<uni-td>{{ item.name }}</uni-td>
		
						<uni-td align="center">{{ item.code }}</uni-td>
						<uni-td align="center">{{ item.location }}</uni-td>
						<uni-td align="center">{{humansData.find(user => user.id === item.adminUserId).username }}</uni-td>
						
						<uni-td align="center">{{ item.stationType==1?'工厂':'仓库' }}</uni-td>
						
						<uni-td >
						
						<button type="primary" size="mini"  @click="clickDetailFunction(item,'update')">修改</button>

						<button type="warn" size="mini" @click="onDelete('one',item)" >删除</button>
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
		<uni-forms-item label="站点名称" name="name">
						<uni-easyinput type="text" v-model="selectedItem.name"  />
					</uni-forms-item>
					<uni-forms-item  name="code" label="站点编码">
						<uni-easyinput type="text" v-model="selectedItem.code"  />
					</uni-forms-item>
					<uni-forms-item  name="location" label="站点位置">
						<uni-easyinput type="text" v-model="selectedItem.location"   />
					</uni-forms-item>
		<uni-forms-item  name="type" label="仓库类型">
			<zqs-select
			  :multiple="false"
			  :list="stype"
			  :showSearch="false"
			  label-key="name"
			  value-key="id"
			  title="选择仓库类型"
			  clearable
			  v-model="selectedItem.stationType"
			></zqs-select>
		</uni-forms-item>
			
	</uni-forms>
	</view>
</view>

				<view class="flex justify-end">

					<button  @tap='createOrupdate' class="diygw-btn red flex1 margin-xs">保存</button>
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
import {getUserInfo,getUserList,getStationList,deleteStation,deleteStations,addStation, updateStation} from '../../api/user.js'

let station=this
	export default {
		data() {
			return {
				stationList:[],
				chooseType:null,
				//用户全局信息
				currentUser:{},
				userInfo: {},
				currentModal:'',//当前弹窗
				currentModalTitle:'',//当前弹窗标题
				inputDisabled:{
					'detail':true,
					'update':false
				},//判断是否弹窗输入框可用
				searchKeyword:'',
				stype:[{id:'1',name:'工厂'},{id:'2',name:'仓库'}],
				//页面传参
				globalOption: {},
				//自定义全局变量
				globalData: { iduser: 0, storeflowid: 0 },
				stationForm:{},
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
				humansData: [],
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
			this.currentUser=uni.getStorageSync('user')
			this.init();
		},
		methods: {
			async createOrupdate(){
				if(this.currentModal=='create'){
					console.log(this.selectedItem)
					await addStation({...this.selectedItem}).then(res=>{
						console.log(res)
					})
				}
		
				if(this.currentModal=='update'){
					console.log(this.selectedItem)
					let {id,code,name,adminUserId,stationType}=this.selectedItem
					let upform={
						code,
						name,
						adminUserId,
						stationType
						}
					await updateStation(this.selectedItem,id).then(res=>{
						console.log(res)
					})
				}
				this.navigateTo({
					type: 'closemodal',
					id: 'detail'
				});
				this.init()
			},
			// 多选处理
					selectedItems() {
						return this.selectedIndexs.map(i => this.stationList[i]['id'])
					},
					// 多选
					selectionChange(e) {
						console.log(e.detail.index)
						this.selectedIndexs = e.detail.index
					},
					//批量删除
					// delTable() {
					// 	console.log(this.selectedItems())
					// },
					// 分页触发
					async change(e) {
						this.$refs.table.clearSelection()
						this.selectedIndexs.length = 0
						await this.getData(e.current)
					},
				async onDelete(type,item={}){
					if(type=='batch'){
						console.log('selectedItems',this.selectedItems())
						let ids=this.selectedItems()
						await deleteStations({ids:ids}).then(res=>{
							console.log('xxxxxxxxxx',res)
							if(res.data.code==10002){
								uni.clearStorageSync()
								this.navigateTo({
								  type: 'page',
								  url: 'login'
								});
							}
						
						
						})
					}else{
						console.log(item)
						await deleteStations({ids:[item.id]}).then(res=>{
							console.log('xxxxxxxxxx',res)
							if(res.data.code==10002){
								uni.clearStorageSync()
								this.navigateTo({
								  type: 'page',
								  url: 'login'
								});
							}
						
						
						})
						
					}
				
						this.init()
					//deleteStation
				},
				getData(index){
						 getStationList({pageNo:index}).then(res=>{
							console.log(res)
							if(res.data.code==10002){
								uni.clearStorageSync()
								this.navigateTo({
								  type: 'page',
								  url: 'login'
								});
							}
							this.stationList=res.data.data.pageData
						
						})
					},
		
			async onSearch(){
				await  getStationList({name:this.searchKeyword}).then(res=>{
				console.log(res)
				if(res.data.code==10002){
					uni.clearStorageSync()
					this.navigateTo({
					  type: 'page',
					  url: 'login'
					});
				}
				this.stationList=res.data.data.pageData
				this.total=res.data.data.total
				});
				
			},
			async init() {
		await getUserList({pageNo:-1}).then(res=>{
		console.log(res)
		if(res.data.code==10002){
			uni.clearStorageSync()
			this.navigateTo({
			  type: 'page',
			  url: 'login'
			});
		}
		this.humansData=res.data.data.pageData
		});
				this.searchKeyword=null
				await getStationList().then(res=>{
				console.log(res)
				if(res.data.code==10002){
					uni.clearStorageSync()
					this.navigateTo({
					  type: 'page',
					  url: 'login'
					});
				}
				this.stationList=res.data.data.pageData
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
		
	
			// 获取用户信息（新） 自定义方法
		
		
		
		async clickDetailFunction(param,e) {
				if(e=='create'){
					this.currentModal='create'
					this.currentModalTitle='创建'
					this.selectedItem.name=''
					this.selectedItem.location=''
					this.selectedItem.code=null
					this.selectedItem.stationType=null
					this.selectedItem.adminUserId=uni.getStorageSync('user').id
				}
				if(e=='update'){
					this.currentModal='update'
					this.currentModalTitle='修改'
					this.selectedItem=param
	
				}

			
			
				//打开弹窗
				this.navigateTo({
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
