<template>
	<view class="container container15293">
		<view class="flex flex-wrap diygw-col-24 flex-direction-column flex2-clz">
		<view class="toolbar">
		  <button class="btn" @click="clickAddFunction" >新增</button>
		  <button class="btn" @tap="onDelete('batch')">批量删除</button>
		
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
					<uni-tr   v-for="(item, index) in orderList" :key="index" >
						<uni-td>{{ item.id }}</uni-td>
						<uni-td>
							<view class="name">{{ humansData.find(x=>x.id==item.dispatcherId).username }}</view>
						</uni-td>
						<uni-td align="center">{{ humansData.find(x=>x.id==item.operatorId).username }}</uni-td>
						<uni-td align="center">{{ OrderStatus.find(x=>x.id==item.status).name }}</uni-td>
						<uni-td >
						<button style="margin-right: 5rpx;" type="primary" size="mini"   @click="clickDetailFunction(item,'detail')">详情</button>
					<button :disabled="isCurrentApproval(item)" v-if="isApproval" style="margin-right: 5rpx;" type="primary" size="mini"   @click="clickApproval(item)">审批</button>
						<button type="warn" size="mini" @click="onDelete('one',item)" >删除</button>
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
		<uni-forms :modelValue="this.addItem" style="padding: 18rpx;">
			<uni-forms-item required  label="任务" name="name">
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
		
		
			<uni-forms-item v-if="orderstep.task>=2"   label="指定审核员" name="name">
						<zqs-select
						  :multiple="false"
						  :list="this.humansData"
						  :showSearch="false"
						  label-key="username"
						  value-key="id"
						  title="选择审核员"
						  clearable
						  v-model="orderstep.reviewerId"
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
			      <!-- 遍历 orderSteps 生成动态的折叠面板 -->
			      <uni-collapse-item 
			        v-for="(step, index) in selectedItem.orderSteps" 
			        :key="step.id" 
			        :title="`任务步骤 ${step.sort}`" 
			        titleBorder="none">
			        
			        <template v-slot:title>
			          <uni-list>
			            <uni-list-item 
			              :title="`步骤 ${step.sort} - 任务 ${tasks.find(item=>item.id==step.task)['name']} ${step.lockId==null?'':lockList.find(item=>item.id==step.lockId)['name']}`" 
			              :show-extra-icon="step.status>3" 
			              :extra-icon="extraIcon">
			            </uni-list-item>
			          </uni-list>
			        </template>
			        
			        <view class="content">
					<!-- todo:如果当前是开锁，就显示锁的详细信息 -->
			          <!-- 根据用户ID判断按钮的显示 -->
			
			          <button 
						 :disabled="step.sort> curStep"
			            v-if="step.task ===1 && selectedItem.status>=3&&selectedItem.status!=10" 
			            type="primary" 
			            size="mini" 
			            @click="handleUnlock(step)">
			            开锁
			          </button>
<!-- 			         <button
			       :disabled="step.sort> curStep"
			            v-if="step.task ===1 &&selectedItem.status>=3" 
			            type="primary" 
			            size="mini" 
			            @click="Unlock(step)">
			            开锁
			          </button> -->
			<!--          <button 
					  :disabled="step.sort> curStep"
			            v-if="step.task === 1 &&selectedItem.status>=3" 
			            type="primary" 
			            size="mini" 
			            @click="handleValidate(step)">
			            校验
			          </button> -->
			           <image v-if="step.status>=6&&step.task==3" style="width: 200px; height: 200px; background-color: #eeeeee;" :src="`http://182.92.76.31:8800/uploads/${step.imageUrl}`" mode="aspectFit" ></image>
			
			          <uni-file-picker 
					 :disabled="step.sort>curStep"
					  v-if="step.task === 3 && (step.status==3 || step.status==4)" 
			          	v-model="imageValue" 
			          	fileMediatype="image" 
			          	mode="grid" 
						limit="1"
						:auto-upload="false"
						
			          	@select="select" 
			
			          />
					  
					  <view style="padding: 10rpx; margin-top: 10rpx;" v-if="step.task === 4 " >
					    <!-- 审批意见的标签 -->
					    <text style="font-size: 18px; color: #444; font-weight: bold; display: block; margin-bottom: 8px;">
					      填写状态量
					    </text>
					    <!-- 输入框 -->
						
					    <uni-easyinput 
					 :disabled="step.sort> curStep"
					      type="text" 
					  	placeholder="填写状态量"
					      v-model="step.comment" 
					      style="border: 1px solid #ddd; border-radius: 4px; padding: 10px; font-size: 16px; width: 100%;" 
					    />
					  </view>
					 
		<!-- 	          <button 
					   :disabled="isCurrentStep"
			            v-if="step.task === 3" 
			            type="primary" 
			            size="mini" 
			            @click="handleUploadStatus(step)">
			            上传状态
			          </button> -->
					  <button
					   :disabled="step.sort> curStep"
					    v-if="(step.task === 3 || step.task === 4)&& selectedItem.status>=3&&selectedItem.status!=10" 
					    type="primary" 
					    size="mini" 
					    @click="handleUpload(step)">
					    上传
					  </button>
					  <button
					   :disabled="!(step.reviewerId===userid&&ableReview)"
					    v-if="isReview&&step.task>=3 &&selectedItem.status!=10" 
					    type="primary" 
					    size="mini" 
					    @click="handleReview(step)">
					    审核
					  </button>
			        </view>
			        
			      </uni-collapse-item>
			    </uni-collapse>
			</uni-section>
			
		
					
				<view class="flex justify-end">
					<button :disabled="selectedItem.status===8?false:true" @tap="clickConfirm"  class="diygw-btn green flex1 margin-xs">提交工单</button>
					<button data-type="closemodal" @tap="navigateTo" data-id="detail" class="diygw-btn red flex1 margin-xs">取消</button>
				</view>
			</view>
		</view>
		<view class="diygw-modal basic" :class="approval" style="z-index: 1000000">
			<view class="diygw-dialog diygw-dialog-consumed basis-lg">
				<view class="justify-end diygw-bar">
					<view class="content"> 审批 </view>
					<view class="action" data-type="closemodal" data-id="detail" @tap="navigateTo">
						<i class="diy-icon-close"></i>
					</view>
				</view>	
					<view class="justify-end diygw-bar">
						<view class="content"> 
						<text style="font-size: 18px; color: #444; font-weight: bold; display: block; margin-bottom: 8px;">
						 请确认查阅工单详情后进行审批操作！
						</text>
						 </view>
					
					</view>	
			<view style="padding: 20px; margin-top: 20px;">
			  <!-- 审批意见的标签 -->
			  <text style="font-size: 18px; color: #444; font-weight: bold; display: block; margin-bottom: 8px;">
			    审批意见
			  </text>
			  <!-- 输入框 -->
			  <uni-easyinput 
			    type="text" 
				placeholder="默认可不填写"
			    v-model="approvalForm.comment" 
			    style="border: 1px solid #ddd; border-radius: 4px; padding: 10px; font-size: 16px; width: 100%;" 
			  />
			</view>
				
			
				<view class="flex justify-end">
					<button @tap="navigateTo" data-type="toApprove"  class="diygw-btn green flex1 margin-xs">审批通过</button>
					
					<button data-type="noApprove" @tap="navigateTo" data-id="detail" class="diygw-btn red flex1 margin-xs">审批驳回</button>
				</view>
			</view>
		</view>
		<view class="diygw-modal basic" :class="review" style="z-index: 1000000">
			<view class="diygw-dialog diygw-dialog-consumed basis-lg">
				<view class="justify-end diygw-bar">
					<view class="content"> 审核 </view>
					<view class="action" data-type="closemodal" data-id="review" @tap="navigateTo">
						<i class="diy-icon-close"></i>
					</view>
				</view>	
					<view class="justify-end diygw-bar">
						<view class="content"> 
						<text style="font-size: 18px; color: #444; font-weight: bold; display: block; margin-bottom: 8px;">
						 请确认工单执行操作无误后进行审核！
						</text>
						 </view>
					
					</view>	
		
				
			
				<view class="flex justify-end">
					<button @tap="navigateTo" data-type="toReview"  class="diygw-btn green flex1 margin-xs">审核通过</button>
					
					<button data-type="noReview" @tap="navigateTo" data-id="detail" class="diygw-btn red flex1 margin-xs">审核驳回</button>
				</view>
			</view>
		</view>
		<view class="diygw-modal basic" :class="submit" style="z-index: 1000000">
			<view class="diygw-dialog diygw-dialog-consumed basis-lg">
				<view class="justify-end diygw-bar">
					<view class="content"> 确认工单 </view>
					<view class="action" data-type="closemodal" data-id="submit" @tap="navigateTo">
						<i class="diy-icon-close"></i>
					</view>
				</view>	
					<view class="justify-end diygw-bar">
						<view class="content"> 
						<text style="font-size: 18px; color: #444; font-weight: bold; display: block; margin-bottom: 8px;">
						 请确认工单所有步骤已完成并关闭所有锁具后进行提交！
						</text>
						 </view>
					
					</view>	
		
				
			
				<view class="flex justify-end">
					<button @tap="navigateTo" data-type="toSubmit"  class="diygw-btn green flex1 margin-xs">确认提交</button>
					
					
				</view>
			</view>
		</view>
		<view class="clearfix"></view>
	</view>
</template>

<script>
import {uploadimg,getUserList,getLockList,getStationList,createOrder,getOrderList,deleteOrders, approveOrder,getLockCmd, stepOrder, getImg, updateLock, updateOrder} from '../../api/user.js'

import bluetooth from '../../mixins/bluetooth.js'
	export default {
		mixins:[bluetooth],
		data() {
			return {
				
				//用户全局信息
				OrderStatus : [
					{ id: -1, name: '已驳回', type: '' },
					{ id: 0, name: '初始值', type: '' },
				  { id: 1, name: '审批中', type: '' },
				  { id: 2, name: '已审批', type: 'success' },
				  { id: 3, name: '执行中', type: 'error' },
				  { id: 4, name: '审批驳回', type: 'warning' },
				  { id: 5, name: '已执行', type: 'success' },
				  { id: 6, name: '审核中', type: 'warning' },
				  { id: 7, name: '审核通过', type: 'error' },
				  { id: 8, name: '确认中', type: 'success' },
				  { id: 9, name: '已确认', type: 'success' },
				  { id: 10, name: '已完成', type: 'success' },
				],
				extraIcon: {
						color: '#4cd964',
						size: '22',
						type: 'checkbox-filled'
					},
				userid:null,
				FilePaths:[],
				orderSteps:[],
				orderApprovals:[],
				userInfo: {},
				currentImg:'',//当前步骤的img
				currentStep:{},
				currentLock:{},//当前锁
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
				approvalForm:{
					id:null,
					approverId:null,
					status:null,
					comment:null
				},
				imageData:null,
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
				orderList: [],
				tasks:[
					{id:1,name:'开锁'},
					{id:3,name:'上传图片'},
					{id:4,name:'状态量'}
				],
				ableReview:false,
				review:'',
				returned: '',
				add: '',
				detail:'',
				oderStepsModal:'',
				approval:'',
				submit:''
			};
		},
		computed: {
			isApproval(){
				let roles=uni.getStorageSync('user').roles
				const hasId5 = roles.some(item => item.id === 5||item.id===1)
				return hasId5
			},
			isReview(){
				let roles=uni.getStorageSync('user').roles
				
				const hasId5 = roles.some(item => item.id === 2||item.id===1)
				console.log('roles',hasId5)
				return hasId5
			},
			curStep(){
				const nowstep = this.selectedItem.orderSteps.find(item => item.status===3)||this.selectedItem.orderSteps.find(item => item.status===6)||this.selectedItem.orderSteps.find(item => item.status===7)
				console.log('this.selectedItem',this.selectedItem)
				return nowstep.sort
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
			async toSubmit(){
				await updateOrder({id:this.selectedItem.id,status:10},this.selectedItem.id).then(res=>{
					console.log(res)
					// 获取当前页面的路由路径
					    const pages = getCurrentPages();
					    const currentPage = pages[pages.length - 1];
					    const currentRoute = currentPage.route;
					 // 重定向到当前页面
					    uni.redirectTo({
					      url: '/' + currentRoute
					    });
				})
			},
			async toReview(){
				this.currentStep.status=7
				await stepOrder(this.currentStep,this.currentStep.id).then(res=>{
						  // 获取当前工单的所有步骤
						    const steps = this.selectedItem.orderSteps;
						    
						    if (steps && steps.length > 0) {
						      // 通过 findIndex 查找当前步骤在步骤数组中的位置
						      const currentIndex = steps.findIndex(item => item.id === this.currentStep.id);
						      
						      // 如果当前步骤存在并且是最后一个步骤，则将工单状态改为 8
						      if (currentIndex !== -1 && currentIndex === steps.length - 1) {
						        this.selectedItem.status = 8;
						      }else{
								  this.selectedItem.status = 7;
							  }
						    }
						this.navigateTo({
							type: 'closemodal',
							id: 'review'
						});			
				})
			},
			async noReview(){
				this.currentStep.status=4
				this.ableReview=false
				await stepOrder(this.currentStep,this.currentStep.id).then(res=>{
										  console.log(res)
										  this.navigateTo({
										  	type: 'closemodal',
										  	id: 'review'
										  });	
									
				})
			},
			clickConfirm(){
				this.navigateTo({
					type: 'openmodal',
					id: 'submit'
				});
			},
			handleReview(step){
				console.log(step)
				this.currentStep=step
				this.navigateTo({
					type: 'openmodal',
					id: 'review'
				});
			},
			imageValue(){
				getImg('20250207121400_1738901637543.jpg').then(res=>{
					// let datas = res.data;
					// this.imageData =  '/f/20250207121400_1738901637543.jpg'
					this.imageData='http://182.92.76.31:8800/uploads/20250207121400_1738901637543.jpg'
				  // const base64 = uni.arrayBufferToBase64(res.data);
				  //   this.imageData = `data:image/jpeg;base64,${base64}`;
					console.log('imgres', res)
				})
			},
			//根据当前ordersetp变量来判断是否是当前或之后的步骤，如果是 就把对应里面的按钮都able
			isCurrentStep(step){
				
				 const targetOrderstep= this.selectedItem.orderSteps.find(
				 i => i.status === 3)
				let nowid=uni.getStorageSync('user').id
				 if(step.sort> targetOrderstep.sort||this.selectedItem.dispatcherId!=nowid){
					 return true
				 }
				 return false
			},
			//todo:根据selectitem（所选整工单）来确定ordersetp更新时orderid的来源，然后将这个一小setp请求更改step接口
			//判断当前用户是否需要审批，如果不是，返回true禁止审批按钮
			isCurrentApproval(item){
				 const targetApproval = item.orderApprovals.find(
				        i => i.status === 1
				      )
					console.log('item',item)
				      // 如果找不到或 approverId 匹配则返回 false，否则返回 true
				      return !(targetApproval?.approverId === uni.getStorageSync('user').id)
			},
			clickApproval(item){
				let thiz=this
				thiz.approvalForm.approverId=uni.getStorageSync('user').id
				thiz.approvalForm.id=item.orderApprovals.find(
				        i => i.status === 1
				      ).id
				thiz.approvalForm.comment=''
				//打开审批弹窗
				thiz.navigateTo({
					type: 'openmodal',
					id: 'approval'
				});
			},
			//审批通过
			toApprove(){
				
				this.approvalForm.status=2
				console.log('approvalForm',this.approvalForm)
				// 显示加载中提示
				uni.showLoading({
				  title: '审批上传中...',
				  mask: true // 可选，设置为 true 可以避免用户点击操作
				});
			approveOrder(this.approvalForm,this.approvalForm.id).then(res=>{
				// 获取当前页面的路由路径
				    const pages = getCurrentPages();
				    const currentPage = pages[pages.length - 1];
				    const currentRoute = currentPage.route;
				 // 重定向到当前页面
				    uni.redirectTo({
				      url: '/' + currentRoute
				    });
			}
			)
				 uni.hideLoading();
				this.navigateTo({
					type: 'closemodal',
					id: 'approval'
				})
			},
			//审批驳回
			noApprove(){
				this.approvalForm.status=-1
					console.log('approvalForm',this.approvalForm)
				approveOrder(this.approvalForm,this.approvalForm.id).then(res=>console.log(res))
					this.navigateTo({
						type: 'closemodal',
						id: 'approval'
					})
				
			},
			//
		async Unlock(step){
			
			
			let thiz=this
			// await getLockCmd({ id: step.lockId, roll: this.roll, type: 0x10 })
			//   .then(res => {
			// 	console.log('蓝牙设备roll:', this.roll);
			//     console.log(res);
			// 	let ins=[]
			//     ins.push(res.data.data['cmd']);
			// 	thiz.sendUnlockInstruct1(ins);
			//   });
			thiz.currentStep=step
			await getLockCmd({ id: step.lockId, roll: this.roll, type: 0xE0 })
			  .then(async res => {
			// console.log('蓝牙设备roll:', this.roll);
			// console.log(res);
			let ins=[]
			
			ins.push(res.data.data['cmd']);
			thiz.sendUnlockInstruct1(ins);
	
			  });
			
		},
	async handleUnlock(step) {
		 let ins = [];
	  // 根据 step.lockId 在 lockList 中查找对应的锁信息
	  // console.log('locki', this.lockList);
	  let curlock = this.lockList.find(lock => lock.id === step.lockId);
	  this.currentLock=curlock
	  if (!curlock) {
	    uni.showToast({
	      title: '未找到对应锁的信息',
	      icon: 'none',
	      duration: 2000
	    });
	    return;
	  }
	  
	  // 蓝牙模块中，扫描到的设备，其 deviceId（去掉冒号并转为小写）作为 mac 值
	  let targetMac = curlock.mac.toLowerCase();
	  // console.log('targetMac',curlock)
	  // 触发蓝牙扫描（内部会调用 openBluetoothAdapter、getBluetoothAdapterState、findBluetooth 等）
	   this.openBluetoothAdapter();
	  // console.log('devices',this.devices)
	  // 等待6秒，确保扫描结果已经更新到 this.devices 中
	  setTimeout(async () => {
	    // 在扫描到的设备数组（this.devices）中查找与 targetMac 匹配的设备
	    const device = this.devices.find(dev => {
	      const devMac = dev.deviceId.replace(/:/g, '').toLowerCase();
	      return devMac === targetMac;
	    });
	    
	    // console.log('rollz', this.roll);
	    // console.log('device',device)
	    if (device) {
	     
	      // 调用蓝牙连接方法
		  // console.log('device',device)
	      this.connectBluetoothDevice(device);
	      this.device=device
	      // 增加等待时间（例如 3 秒），让连接有足够时间完成
	      await new Promise(resolve => setTimeout(resolve, 6000));
	      
	      // console.log('蓝牙设备已连接, roll:', this.roll);
	      
	    // 发送开锁指令（类型 0x01）
	    await getLockCmd({ id: step.lockId, roll: this.roll, type: 0x01 })
	      .then(res => {
			let ins01=[]
	        // console.log(res);
	        ins01.push(res.data.data['cmd']);
			// ins1.push('0100000dc1020101e1b219020800241ac6')
			this.sendUnlockInstruct1(ins01);
	      });
		await  this.Unlock(step)
	    // await new Promise(resolve => setTimeout(resolve, 500));
	    
	    // 调用接口获取开锁指令（类型 0xE0）
	    // await getLockCmd({ id: step.lockId, roll: this.roll, type: 0xE0 })
	    //   .then(res => {
	    //     console.log(res);
	    //     ins.push(res.data.data['cmd']);
	    //   });
	    // console.log('蓝牙设备roll:', this.roll);
	    // this.sendUnlockInstruct(ins);
	    

		//todo：发送01校验开锁，如果状态为开patch更改锁状态，然后patch orderstep状态
	      // 如有需要，可更新步骤状态（例如标记为已开锁）
	      // step.status = 'unlocked';
	      // this.$set(this.selectedItem.orderSteps, this.selectedItem.orderSteps.indexOf(step), step);
	  //    await this.Unlock(step)
		 //  getLockCmd({ id: step.lockId, roll: this.roll, type: 0x01 })
		 //   .then(async res => {
		 // 	let ins01=[]
		 //     console.log(res);
		 //     ins01.push(res.data.data['cmd']);
		 // 	// ins1.push('0100000dc1020101e1b219020800241ac6')
		 //  await	this.sendUnlockInstruct1(ins01);
			// console.log('someDataFromB',this.someDataFromB)
			// if(this.someDataFromB.lockStatus=='01'){
			// 	updateLock({lockStatus:this.someDataFromB.lockStatus},step.lockId).then(res=>{
			// 		if(res.data.code==0){
			// 			step.status = 5;
			// 			this.$set(this.selectedItem.orderSteps, this.selectedItem.orderSteps.indexOf(step), step);
			// 		}
			// 	})
			// }
		 //   });
	      // console.log('开锁操作完成:', step);
	    } else {
	      // 未找到设备时给出提示
	      uni.showToast({
	        title: '未找到对应的蓝牙设备，请确认设备是否已开启',
	        icon: 'none',
	        duration: 2000
	      });
	    }
	  }, 6000);
	},


			
			async  handleValidate(step) {
				    //todo：获取step中lock的status，看是否是关锁，如果是最后一个开锁步骤的锁关，更新工单状态为完成
					  let thiz=this
				   await getLockCmd({ id: step.lockId, roll: this.roll, type: 0x01 })
				     .then(res => {
				   // console.log('蓝牙设备roll:', this.roll);
				   // console.log(res);
				   let ins=[]
				   ins.push(res.data.data['cmd']);
				   thiz.sendUnlockInstruct1(ins);
				     });
	
				   
			
			    // step.status = 'validated';  // 更新状态
			//     this.$set(this.selectedItem.orderSteps, this.selectedItem.orderSteps.indexOf(step), step);
			
			//     console.log('校验操作完成:', step);
			  },
			  upload  (filename, file) {
				  let thiz=this
			    return uni.uploadFile({
			      url: 'http://182.92.76.31:8800/f/' + filename,  // 上传的 URL
			      // file: file,         // 选择的文件路径
			  
			  	header:{
			  		Authorization: "Bearer " + uni.getStorageSync('token'),
			  	},
			  	name: 'file',           // 上传的字段名
			  	filePath: file, // 文件资源的路径
			      success(res) {
			  		thiz.currentImg= JSON.parse(res.data).data
					console.log('this.img',thiz.currentImg)
			        console.log('上传成功:', JSON.parse(res.data));
			      },
			      fail(err) {
			        console.error('上传失败:', err);
			      }
			    });
			  },
			
			async  handleUpload(step) {
				  //首先判断step的status是不是执行中，不是直接返回
				  //当上传图片时，更改setp patch 状态改为审核中
				  //当上传状态量时
				  let stepform={
					  id:step.id,
					  orderId:step.orderId,
					  task:step.task,
					  status:5,
					 
				  }
				  if(step.task==3){
					  stepform.imageUrl=this.currentImg
					  await stepOrder(stepform,step.id).then(res=>{
						  console.log(res)
						this.ableReview=true
						 
					  })
				  }
				  if(step.task==4){
					  stepform.comment=step.comment
					  console.log('step.comment',stepform)
					 await stepOrder(stepform,step.id).then(res=>{
					 						  console.log('sss',res)
					 				this.ableReview=true	 	
					
					 })
				  }
			    console.log('上传状态操作完成:', step);
			  },
			
		     select(e) {
		                console.log('选择文件：', e)
		                // 解决file对象取值问题
		                // h5上传-需要文件file对象
						// const tempFilePaths = e.tempFiles[0].file;
						// 微信小程序上传-需要微信临时提供临时地址
						const tempFilePaths = e.tempFilePaths;
						let token=uni.getStorageSync('token')
						console.log(token)
						
					const result=this.upload(e.tempFiles[0].name,tempFilePaths[0])
					console.log(result)
	
		            },
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
			return this.selectedIndexs.map(i => this.orderList[i]['id'])
		},
		// 多选
		selectionChange(e) {
			console.log(e.detail.index)
			this.selectedIndexs = e.detail.index
		},
				
					// 分页触发
					change(e) {
						this.$refs.table.clearSelection()
						this.selectedIndexs.length = 0
						this.getData(e.current)
					},
			async init() {

				this.userInfo=uni.getStorageSync('user')
				this.userid=this.userInfo.id
				console.log('userid',this.userInfo.id)
			await	getUserList({pageNo:-1}).then(res=>{
					this.humansData =res.data.data.pageData
				})
				await getOrderList({all:1}).then(res=>{
					console.log("dadsadasdasdasd",res)
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
			async onDelete(type,item={}){
				if(type=='batch'){
					console.log('selectedItems',this.selectedItems())
					let ids=this.selectedItems()
					await deleteOrders({ids:ids}).then(res=>{
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
					await deleteOrders({ids:[item.id]}).then(res=>{
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
			//添加单个步骤
			//todo : 添加步骤时候判断是否添加了同类型审核任务，如果是则不通过
		clickAddStep() {
		  // 判断 this.orderstep.task 是否为 3 或 4
		  if ((this.orderstep.task === 3 || this.orderstep.task === 4)&&this.orderstep.reviewerId) {
		    // 检查 this.orderStepList 是否已经包含 task 为 3 或 4 的项
		    const taskExists = this.orderStepList.some(item => item.task === this.orderstep.task);
			
		    if (taskExists) {
		      // 弹窗提示无法创建
		      uni.showToast({
		        title: '无法创建，审核任务只能唯一',
		        icon: 'none',
		        duration: 2000
		      });
		      return; // 退出函数，避免添加重复的任务
		    }
		  }else if(this.orderstep.task === 1&&this.orderstep.lockId){
			  console.log('success')
		  }else{
			  uni.showToast({
			    title: '无法创建，请选择必要属性',
			    icon: 'none',
			    duration: 2000
			  });
			   return; 
		  }
		
		  // 如果通过验证，继续执行添加步骤
		  this.orderStepList.push(this.orderstep);
		  
		  this.orderSteps = this.orderStepList.map((item, index) => {
		    return {
		      orderId: 0,
		      sort: index + 1,
		      ...item,
		      status: 0,
		    };
		  });
		
		  console.log("this.orderStepList", this.orderSteps);
		
		  // 关闭弹窗
		  this.navigateTo({
		    type: 'closemodal',
		    id: 'oderStepsModal'
		  });
		},

			resetAdd(){
				this.orderData.stationId=null
				this.orderData.operatorId=null
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
				this.orderStepList=[]
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
				console.log('param',thiz.selectedItem)
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
		//创建order，todo：检验步骤最后两步的不是和状态量，如果是调用接口，如果不是就弹窗
	async handleSave() {
	  // 检查 this.orderSteps 最后两个元素的 task 是否分别为 3 和 4
	  if (this.orderSteps.length > 2) {
	    const lastStep = this.orderSteps[this.orderSteps.length - 1];
	    const secondLastStep = this.orderSteps[this.orderSteps.length - 2];
		
	    if (!(lastStep.task === 4 && secondLastStep.task === 3)) {
	      uni.showToast({
	        title: '工单创建不符合规范，请确定上传审核顺序',
	        icon: 'none',
	        duration: 2000
	      });
	      return; // 退出函数，不继续保存
	    }
	  }else{
		  uni.showToast({
		    title: '工单至少创建三个步骤，请确定步骤合理',
		    icon: 'none',
		    duration: 2000
		  });
		  return ;
	  }
	
	  // 转换 checkApprovalList 为 orderApprovals
	  this.orderApprovals = this.checkApprovalList.map((id, index) => {
	    return {
	      orderId: 0,
	      approverId: id,
	      status: 0,
	      sort: index + 1
	    };
	  });
	  
	  let orderdata = this.orderData;
	  let steps = this.orderSteps;
	  let apprs = this.orderApprovals;
	  let user = uni.getStorageSync('user');
	  let thiz = this;
	if(!apprs&&orderdata.operatorId&&orderdata.stationId){
		uni.showToast({
		  title: '请确定表单填写完整！',
		  icon: 'none',
		  duration: 2000
		});
		return ;
	}
	  let finalOrder = {
	    ...orderdata,
	    status: 1,
	    userId: user.id,
	    orderSteps: steps,
	    orderApprovals: apprs,
	  };
	
	  await createOrder(finalOrder).then((res) => {
	    console.log(res);
	    console.log('finalOrder', finalOrder);
	  });
	
	  // 清空表单数据
	  this.orderData = {};
	  this.orderApprovals = [];
	  this.orderStepList = [];
	  this.orderSteps = [];
	  this.orderstep = {};
	  this.checkApprovalList = [];
	
	  // 关闭模态框
	  thiz.navigateTo({
	    type: 'closemodal',
	    id: 'add'
	  });
	  // 获取当前页面的路由路径
	      const pages = getCurrentPages();
	      const currentPage = pages[pages.length - 1];
	      const currentRoute = currentPage.route;
	   // 重定向到当前页面
	      uni.redirectTo({
	        url: '/' + currentRoute
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
