<template>
	<view class="container container15293">
		<view class="flex flex-wrap diygw-col-24 flex-direction-column flex2-clz">
		<view class="toolbar">
		  <button class="btn" @click="clickAddFunction" >新增</button>
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
						<uni-th width="50" align="center">派单号</uni-th>
						<uni-th width="50" align="center">派单员</uni-th>
						<uni-th  align="center">操作员</uni-th>
						<uni-th width="50" align="center">状态</uni-th>
						<uni-th width="150" align="center">设置</uni-th>
					</uni-tr>
					<uni-tr  v-for="(item, index) in orderList" :key="index" >
						<uni-td>{{ item.id }}</uni-td>
						<uni-td>
							<view class="name">{{ item.operatorId }}</view>
						</uni-td>
						<uni-td align="center">{{ item.operatorId }}</uni-td>
						<uni-td align="center">{{ item.status }}</uni-td>
						<uni-td >
						<button style="margin-right: 5rpx;" type="primary" size="mini"   @click="clickDetailFunction(item,'detail')">详情</button>
					<button v-if="isApproval" style="margin-right: 5rpx;" type="primary" size="mini"   @click="clickDetailFunction(item,'detail')">审批</button>
						<button type="warn" size="mini" >删除</button>
						</uni-td>
					</uni-tr>
				</uni-table>
	<view class="uni-pagination-box"><uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total" @change="change" /></view>
			</view>
	
		</view>


		<view class="diygw-modal basic" :class="add" style="z-index: 1000000">
			<view class="diygw-dialog diygw-dialog-consumed basis-lg">
				<view class="justify-end diygw-bar">
					<view class="content"> 新建工单 </view>
					<view class="action" data-type="closemodal" data-id="add" @tap="navigateTo">
						<i class="diy-icon-close"></i>
					</view>
				</view>
		<uni-forms :modelValue="this.addItem" style="padding: 20rpx;">
			<uni-forms-item  label="操作员" name="name">
					<zqs-select
					  :multiple="false"
					  :list="this.humansData"
					  :showSearch="false"
					  label-key="username"
					  value-key="id"
					  title="选择操作员"
					  clearable
					  v-model="orderData.operatorId"
					></zqs-select>
				</uni-forms-item>
						<uni-forms-item  name="station" label="站点">
					        <zqs-select
					          :multiple="false"
					          :list="this.stationList"
					          :showSearch="false"
					          label-key="name"
					          value-key="id"
					          title="选择站点"
					          clearable
					          v-model="orderData.stationId"
					        ></zqs-select>
						</uni-forms-item>
						<uni-forms-item  name="email" label="审批人员顺序">
						
							<zqs-select
							         :multiple="true"
							         :list="this.humansData"
							         label-key="username"
							         value-key="id"
							         placeholder=" 请选择授权联系人"
							         title="选择授权联系人"
							         clearable
							         v-model="checkApprovalList"
							         @search="searchEvent"
							         @change="selectChange2"
							       ></zqs-select>
						</uni-forms-item>
						<uni-forms-item  name="gender" label="工单步骤">
						<button  data-type="openmodal" @tap="navigateTo"  data-id="oderStepsModal"  class="diygw-btn red flex1 margin-xs">创建步骤</button>
						<button  @tap="stepsPop"  class="diygw-btn red flex1 margin-xs">删除步骤</button>
						</uni-forms-item>
				<uni-form-item>
					<uni-steps :options="orderStepList" ></uni-steps>
				</uni-form-item>
		</uni-forms>
				<view class="flex justify-end">
					<button @tap="handleSave"   class="diygw-btn green flex1 margin-xs">确认</button>
					<button  @click="resetAdd"  class="diygw-btn red flex1 margin-xs">重置表单</button>
					<button data-type="closemodal" @tap="navigateTo" data-id="add" class="diygw-btn red flex1 margin-xs">取消</button>
				</view>
			</view>
		</view>
		<view class="diygw-modal basic" :class="oderStepsModal" style="z-index: 1000000">
			<view class="diygw-dialog diygw-dialog-consumed basis-lg">
				<view class="justify-end diygw-bar">
					<view class="content"> 新建工单步骤 </view>
					<view class="action" data-type="closemodal" data-id="oderStepsModal" @tap="navigateTo">
						<i class="diy-icon-close"></i>
					</view>
				</view>
		<uni-forms :modelValue="this.addItem" style="padding: 20rpx;">
			<uni-forms-item  label="操作任务" name="name">
					<zqs-select
					  :multiple="false"
					  :list="this.tasks"
					  :showSearch="false"
					  label-key="name"
					  value-key="id"
					  title="选择任务"
					  clearable
					  v-model="orderstep.task"
					></zqs-select>
				</uni-forms-item>
	
	
			<uni-forms-item  v-if="orderstep.task<2"  label="指定锁具" name="name">
					<zqs-select
					  :multiple="false"
					  :list="this.lockList"
					  :showSearch="false"
					  label-key="sn"
					  value-key="id"
					  title="选择锁具"
					  clearable
					  v-model="orderstep.lockId"
					></zqs-select>
				</uni-forms-item>
		
		
			<uni-forms-item v-if="orderstep.task>2"   label="指定审核员" name="name">
						<zqs-select
						  :multiple="false"
						  :list="this.humansData"
						  :showSearch="false"
						  label-key="username"
						  value-key="id"
						  title="选择审核员"
						  clearable
						  v-model="orderstep.approvalId"
						></zqs-select>
				</uni-forms-item>
		</uni-forms>
				<view class="flex justify-end">
					<button @tap="navigateTo" data-type="clickAddStep"  class="diygw-btn green flex1 margin-xs">确认</button>
					<button @tap="()=>{orderstep={}}"  class="diygw-btn green flex1 margin-xs">重置</button>
					<button data-type="closemodal" @tap="navigateTo" data-id="detail" class="diygw-btn red flex1 margin-xs">取消</button>
				</view>
			</view>
		</view>
		<view class="diygw-modal basic" :class="detail" style="z-index: 1000000">
			<view class="diygw-dialog diygw-dialog-consumed basis-lg">
				<view class="justify-end diygw-bar">
					<view class="content"> 工单详情 </view>
					<view class="action" data-type="closemodal" data-id="detail" @tap="navigateTo">
						<i class="diy-icon-close"></i>
					</view>
				</view>
			<uni-section title="使用插槽" type="line">
				<uni-collapse>
					<uni-collapse-item titleBorder="none">
						<template v-slot:title>
							<uni-list>
								<uni-list-item title="标题使用自定义标题插槽" :show-extra-icon="true" :extra-icon="extraIcon">
								</uni-list-item>
							</uni-list>
						</template>
						<view class="content">
							<text class="text">折叠内容主体，可自定义内容及样式</text>
						</view>
					</uni-collapse-item>
<!-- 					<uni-collapse-item title="折叠内容使用 uni-list 组件">
						<uni-list>
							<uni-list-item title="列表文字"></uni-list-item>
							<uni-list-item :disabled="true" title="列表文字" note="列表禁用状态"></uni-list-item>
							<uni-list-item title="列表右侧显示 switch" :show-switch="true"></uni-list-item>
							<uni-list-item :show-extra-icon="true" :extra-icon="extraIcon" title="列表左侧带扩展图标"></uni-list-item>
							<uni-list-item title="列表左侧带略缩图" note="列表描述信息"
								thumb="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png"
								thumb-size="lg" rightText="右侧文字" showArrow></uni-list-item>
							<uni-list-item title="开启点击反馈" clickable showArrow @click="onClick"></uni-list-item>
						</uni-list>
					</uni-collapse-item> -->
				</uni-collapse>
			</uni-section>
			
						<uni-list>
	
							<uni-list-item title="自定义右侧插槽" note="列表描述信息" >
								<template v-slot:footer>
									<button type="primary" size="mini">执行</button>
								</template>
							</uni-list-item>
					
						</uni-list>
					
				<view class="flex justify-end">
					<button @tap="navigateTo" data-type="clickAddStep"  class="diygw-btn green flex1 margin-xs">确认</button>
					
					<button data-type="closemodal" @tap="navigateTo" data-id="detail" class="diygw-btn red flex1 margin-xs">取消</button>
				</view>
			</view>
		</view>
		<view class="clearfix"></view>
	</view>
</template>

<script>
import {getUserInfo,getUserList,getLockList,getStationList,createOrder,getOrderList} from '../../api/user.js'
	export default {
		data() {
			return {
				//用户全局信息
				orderSteps:[],
				orderApprovals:[],
				userInfo: {},
				currentModal:'',//当前弹窗
				currentModalTitle:'',//当前弹窗标题
				inputDisabled:{
					'detail':true,
					'update':false
				},//判断是否弹窗输入框可用
				//页面传参
				checkApprovalList:[],//审批人员列表需转换
				globalOption: {},
				stationId:'',
				//自定义全局变量
				globalData: { iduser: 0, storeflowid: 0 },
				selectedItem:{},
				addItem:{},
				orderData:{},//表单数据
				operatorId:null,
				lockId:null,
				task:null,
				approvalId:null,
				selectedIds:[],
				orderStepList:[],//工单步骤集合，需转换
				orderstep:{},//表单中表单步骤数据
				// 每页数据量
							pageSize: 2,
							// 当前页
							pageCurrent: 1,
							// 数据总量
							total: 4,
				checkboxValue1:[],
				isAll:{
					value:'all',
					name:'全选'},
				stationList:[],
				lockList:[],
				orderList: {
					
				},
				tasks:[
					{id:1,name:'开锁'},
					{id:2,name:'关锁'},
					{id:3,name:'上传图片'},
					{id:4,name:'状态量'}
				],
	
				returned: '',
				add: '',
				detail:'',
				oderStepsModal:''
			};
		},
		computed: {
			isApproval(){
				let roles=uni.getStorageSync('user').roles
				const hasId5 = roles.some(item => item.id === 5)
				return hasId5
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
			getUserList({pageNo:-1}).then(res=>{
				this.humansData =res.data.data.pageData
			})

			this.init();
		},
		methods: {
			
			stepsPop(){
				this.orderStepList.pop()
				this.orderSteps=	this.orderStepList.map((item,index)=>{
						return {
							orderId:0,
							sort:index+1,
							...item,
							status:0,
						}
					})
					console.log("this.orderStepList",this.orderSteps)
			},
			    selectChange2() {
			      // 此处为点击的事件
			    },
			    searchEvent(val) {
			      console.log('查询事件参数', val)
			      // 此处把新的请求值 赋值给options
			    },
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
			async init() {
				await getOrderList().then(res=>{
					console.log("dadsadasdasdasd",uni.getStorageSync('user'))
					if(res.data.code==10002){
						uni.clearStorageSync()
						this.navigateTo({
						  type: 'page',
						  url: 'login'
						});
					}
					this.orderList=res.data.data.pageData
					this.total=res.data.data.total
					
				});
				await getStationList({pageNo:-1}).then(res=>{
					
					if(res.data.code==10002){
						uni.clearStorageSync()
						this.navigateTo({
						  type: 'page',
						  url: 'login'
						});
					}
					this.stationList=res.data.data.pageData
					console.log(this.stationList)
				});
				await getLockList({pageNo:-1}).then(res=>{
					
					if(res.data.code==10002){
						uni.clearStorageSync()
						this.navigateTo({
						  type: 'page',
						  url: 'login'
						});
					}
					this.lockList=res.data.data.pageData
					console.log("xxxxxxxxx",this.lockList)
				});
			},
			//添加单个步骤
			clickAddStep(){
				this.orderStepList.push(this.orderstep)
			this.orderSteps=	this.orderStepList.map((item,index)=>{
					return {
						orderId:0,
						sort:index+1,
						...item,
						status:0,
					}
				})
				console.log("this.orderStepList",this.orderSteps)
				this.navigateTo({
					type: 'closemodal',
					id: 'oderStepsModal'
				});
			},
			resetAdd(){
				this.stationId=null
				this.checkApprovalList=[]
				this.operatorId=null
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
			

			// 获取用户信息（新） 自定义方法
				
			async clickAddFunction(){
				this.navigateTo({
					type: 'openmodal',
					id: 'add'
				});
			},
			// 点击回仓按钮触发 自定义方法
			async clickDetailFunction(param,e) {
				if(e=='detail'){
					this.currentModal='detail'
					this.currentModalTitle='详情'
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
		async handleSave(){
			this.orderApprovals=this.checkApprovalList.map((id,index)=>{
				return {
					orderId:0,
					approverId:id,
					status:0,
					sort:index+1
				}
			})
			let orderdata=this.orderData
			let steps=this.orderApprovals
			let apprs=this.orderSteps
			let user=uni.getStorageSync('user')
				let thiz = this;
			let finalOrder={
				...orderdata,
				status:1,
				userId:user.id,
				orderSteps:steps,
				orderApprovals:apprs,
				
			}
			await  createOrder(finalOrder).then(()=>{
				console.log('finalOrder',finalOrder)
			
			
			})
			this.orderData={}
			this.orderApprovals=[]
			this.orderStepList=[]
			this.orderSteps=[]
			this.orderstep={}
			this.checkApprovalList=[]
			thiz.navigateTo({
				type: 'closemodal',
				id: 'add'
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
